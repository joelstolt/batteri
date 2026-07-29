import Stripe from "stripe"
import { publicProducts } from "./products"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

/**
 * Förskottsfaktura mot bankgiro.
 *
 * För kunder vars attestrutin kräver ett fakturaunderlag men som inte kan
 * betala med kort. Ingen kredit lämnas: batteriet skickas först när pengarna
 * kommit, så Batteriproffs tar ingen risk.
 *
 * Fakturan lagras som ett Stripe Invoice-objekt. Det ger fakturanummer,
 * radhantering och status utan någon ny databas, precis som ordrarna ligger på
 * PaymentIntents. Betalningen sker dock UTANFÖR Stripe, till bankgiro, så
 * Stripe kan aldrig veta av sig själv att fakturan är betald — den markeras för
 * hand med paid_out_of_band när pengarna syns på kontot.
 *
 * Mejlet skickas via Resend i sajtens egen mall, inte via Stripes
 * fakturautskick. Stripes mall skulle visa Stripes betalalternativ i stället
 * för vårt bankgiro, vilket är precis fel för ett förskottsköp.
 */

export const BANKGIRO = "5218-3480"
export const FORFALLODAGAR = 10
const VAT_RATE = 1.25
const SHIPPING_COST = 556

/** Öre, som Stripe räknar i. */
function ore(kr) {
  return Math.round(kr * 100)
}

/**
 * Räknar ut en order utifrån slugs och antal.
 *
 * Priserna i lib/products.js är INKLUSIVE moms, frakten exklusive. Samma regel
 * som i create-payment-intent, och den får inte divergera — två ställen som
 * räknar moms olika ger fakturor som inte stämmer med kassan.
 */
export function raknaOrder(rader) {
  const poster = rader.map(({ slug, antal }) => {
    const p = publicProducts.find((x) => x.slug === slug)
    if (!p) throw new Error(`Okänd artikel: ${slug}`)
    const q = Number(antal)
    if (!Number.isInteger(q) || q < 1 || q > 99) throw new Error("Ogiltigt antal")
    return {
      slug: p.slug,
      namn: p.name,
      antal: q,
      styckInkl: p.price,
      styckExkl: p.price / VAT_RATE,
      radExkl: (p.price / VAT_RATE) * q,
    }
  })

  if (!poster.length) throw new Error("Fakturan saknar rader")

  const fraktExkl = poster.every(
    ({ slug }) => publicProducts.find((p) => p.slug === slug)?.freeShipping
  )
    ? 0
    : SHIPPING_COST

  const nettoExkl = poster.reduce((s, r) => s + r.radExkl, 0) + fraktExkl
  const moms = nettoExkl * (VAT_RATE - 1)

  return {
    poster,
    fraktExkl,
    nettoExkl: Math.round(nettoExkl),
    moms: Math.round(moms),
    totalInkl: Math.round(nettoExkl + moms),
  }
}

/**
 * Skapar och färdigställer fakturan i Stripe.
 *
 * Färdigställandet är det som sätter fakturanumret, och numret är den referens
 * kunden ska ange vid betalning. Utan finalize har fakturan inget nummer.
 */
export async function skapaFaktura({ epost, foretag, orgnr, referens, rader, meddelande }) {
  const berakning = raknaOrder(rader)

  const kund = await stripe.customers.create({
    email: epost,
    name: foretag,
    metadata: {
      org_nr: orgnr || "",
      referens: referens || "",
      typ: "forskottsfaktura",
    },
  })

  const faktura = await stripe.invoices.create({
    customer: kund.id,
    currency: "sek",
    // send_invoice, inte charge_automatically: Stripe ska aldrig försöka dra
    // pengar. Betalningen kommer via bankgiro.
    collection_method: "send_invoice",
    days_until_due: FORFALLODAGAR,
    // Stripes eget utskick är avstängt. Vi mejlar i vår egen mall.
    auto_advance: false,
    description: meddelande || undefined,
    metadata: {
      typ: "forskottsfaktura",
      org_nr: orgnr || "",
      referens: referens || "",
      rader: JSON.stringify(rader).slice(0, 500),
    },
  })

  for (const r of berakning.poster) {
    await stripe.invoiceItems.create({
      customer: kund.id,
      invoice: faktura.id,
      currency: "sek",
      amount: ore(r.radExkl),
      description: `${r.antal} × ${r.namn}`,
    })
  }

  if (berakning.fraktExkl > 0) {
    await stripe.invoiceItems.create({
      customer: kund.id,
      invoice: faktura.id,
      currency: "sek",
      amount: ore(berakning.fraktExkl),
      description: "Frakt",
    })
  }

  await stripe.invoiceItems.create({
    customer: kund.id,
    invoice: faktura.id,
    currency: "sek",
    amount: ore(berakning.moms),
    description: "Moms 25 %",
  })

  const klar = await stripe.invoices.finalizeInvoice(faktura.id)
  return { faktura: klar, berakning, kund }
}

/** Markerar betald när pengarna syns på bankgirot. */
export async function markeraBetald(fakturaId) {
  return stripe.invoices.pay(fakturaId, { paid_out_of_band: true })
}

/** Makulerar en faktura som inte ska betalas. Går bara på obetalda. */
export async function makulera(fakturaId) {
  return stripe.invoices.voidInvoice(fakturaId)
}

/** Alla förskottsfakturor, obetalda först. */
export async function hamtaFakturor() {
  const svar = await stripe.invoices.list({ limit: 100, expand: ["data.customer"] })

  const ordning = { open: 0, draft: 1, paid: 2, void: 3, uncollectible: 4 }

  return svar.data
    .filter((f) => f.metadata?.typ === "forskottsfaktura")
    .map((f) => ({
      id: f.id,
      nummer: f.number,
      status: f.status,
      // Förfallen men obetald. Den skillnaden syns inte i Stripes status.
      forfallen:
        f.status === "open" && f.due_date && f.due_date * 1000 < Date.now(),
      skapad: f.created,
      forfaller: f.due_date,
      totalInkl: f.total / 100,
      epost: typeof f.customer === "object" ? f.customer?.email : null,
      foretag: typeof f.customer === "object" ? f.customer?.name : null,
      orgnr: f.metadata?.org_nr || "",
      referens: f.metadata?.referens || "",
      rader: f.lines?.data?.map((l) => ({ text: l.description, belopp: l.amount / 100 })) || [],
    }))
    .sort((a, b) => (ordning[a.status] ?? 9) - (ordning[b.status] ?? 9) || b.skapad - a.skapad)
}
