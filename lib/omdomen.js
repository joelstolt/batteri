import Stripe from "stripe"
import { orderIdFor } from "./orders"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

/**
 * Kundomdömen, knutna till ett verifierat köp.
 *
 * Omdömet lagras i metadatan på den PaymentIntent köpet gjordes med. Det ger
 * två saker gratis: ingen ny databas, och en garanti att den som skriver
 * faktiskt har köpt artikeln — omdömet kan inte existera utan en genomförd
 * betalning att hänga på.
 *
 * Det är den enda punkt där vi är bättre än den enda konkurrent som visar
 * omdömen alls. Deras går inte att verifiera. Våra kan bara skrivas av någon
 * som loggat in på mejladressen som betalade.
 *
 * ALLT MODERERAS. Ingenting syns förrän någon i admin godkänt det. Ett
 * publicerat omdöme är ett marknadsföringspåstående, och det är vårt namn på
 * det.
 */

const NYCKEL_PREFIX = "omd_"
export const MAX_TEXT = 350
export const MIN_BETYG = 1
export const MAX_BETYG = 5

/** Väntar, Godkänt, Nekat. Enbokstavskoder för att spara metadatautrymme. */
export const VANTAR = "v"
export const GODKANT = "g"
export const NEKAT = "n"

function nyckelFor(slug) {
  // Stripe tillåter 40 tecken i metadatanycklar. Längsta sluggen i sortimentet
  // är 13 tecken, så prefixet ryms med god marginal.
  return `${NYCKEL_PREFIX}${slug}`
}

/** Plockar ut alla omdömen ur en PaymentIntent. */
export function omdomenUrPI(pi) {
  const meta = pi.metadata || {}
  const ut = []

  for (const [nyckel, varde] of Object.entries(meta)) {
    if (!nyckel.startsWith(NYCKEL_PREFIX)) continue
    let d
    try {
      d = JSON.parse(varde)
    } catch {
      continue
    }
    if (!d || typeof d !== "object") continue

    ut.push({
      piId: pi.id,
      orderId: orderIdFor(pi.id),
      slug: nyckel.slice(NYCKEL_PREFIX.length),
      betyg: Number(d.b) || 0,
      text: typeof d.t === "string" ? d.t : "",
      namn: typeof d.n === "string" ? d.n : "",
      datum: Number(d.d) || 0,
      status: d.s || VANTAR,
      // Mejladressen visas aldrig utåt. Den finns här bara så admin ser vem
      // som skrivit, och så kunden kan hitta sitt eget omdöme igen.
      epost: (meta.buyer_email || "").toLowerCase(),
    })
  }

  return ut
}

/**
 * Hämtar omdömen ur Stripe.
 *
 * Läser igenom genomförda betalningar och plockar metadatan. Det finns ingen
 * väg att söka på metadatanycklar med jokertecken hos Stripe, så listan gås
 * igenom i sin helhet. Vid nuvarande ordervolym är det ett API-anrop.
 *
 * Taket är medvetet och loggas när det slår i — en tyst avkortning här skulle
 * betyda att gamla omdömen försvann från produktsidorna utan att någon märkte
 * det.
 */
export async function hamtaAllaOmdomen({ maxSidor = 5 } = {}) {
  const omdomen = []
  let efter = null
  let sidor = 0

  while (sidor < maxSidor) {
    const svar = await stripe.paymentIntents.list({
      limit: 100,
      ...(efter ? { starting_after: efter } : {}),
    })
    for (const pi of svar.data) {
      if (pi.status !== "succeeded") continue
      omdomen.push(...omdomenUrPI(pi))
    }
    sidor += 1
    if (!svar.has_more) return omdomen
    efter = svar.data.at(-1)?.id
    if (!efter) return omdomen
  }

  console.warn(
    `Omdömesläsningen stannade vid ${maxSidor * 100} betalningar. Äldre omdömen kan saknas — höj maxSidor.`
  )
  return omdomen
}

/** Bara godkända, nyast först. Det som får synas utåt. */
export async function godkandaFor(slug) {
  const alla = await hamtaAllaOmdomen()
  return alla
    .filter((o) => o.slug === slug && o.status === GODKANT)
    .sort((a, b) => b.datum - a.datum)
}

/**
 * Snittbetyg och antal.
 *
 * Snittet avrundas till EN decimal och får aldrig rundas uppåt till en jämn
 * femma. Konkurrenten som visar omdömen märker upp ratingValue 5 på en sida som
 * innehåller enstjärniga omdömen — det är den enda punkt där de blir påkomna,
 * och det ska inte hända här.
 */
export function sammanfatta(omdomen) {
  if (!omdomen.length) return null
  const summa = omdomen.reduce((s, o) => s + o.betyg, 0)
  return {
    antal: omdomen.length,
    snitt: Math.round((summa / omdomen.length) * 10) / 10,
  }
}

function rensaText(v) {
  return String(v || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_TEXT)
}

/**
 * Sparar ett omdöme på ordern.
 *
 * Anropande kod MÅSTE redan ha kontrollerat att den inloggade äger ordern och
 * att artikeln finns på den. Den här funktionen litar på sin anropare.
 */
export async function sparaOmdome(piId, slug, { betyg, text, namn }) {
  const b = Number(betyg)
  if (!Number.isInteger(b) || b < MIN_BETYG || b > MAX_BETYG) {
    throw new Error("Ogiltigt betyg")
  }

  const post = {
    b,
    t: rensaText(text),
    n: rensaText(namn).slice(0, 60),
    d: Math.floor(Date.now() / 1000),
    s: VANTAR,
  }

  const varde = JSON.stringify(post)
  if (varde.length > 500) {
    // Ska inte kunna hända med MAX_TEXT 350, men hellre ett tydligt fel än en
    // tyst avkortning mitt i JSON:en.
    throw new Error("Omdömet är för långt")
  }

  await stripe.paymentIntents.update(piId, { metadata: { [nyckelFor(slug)]: varde } })
  return post
}

/** Godkänner eller nekar. Behåller texten så ett nekande går att ångra. */
export async function moderera(piId, slug, status) {
  if (![GODKANT, NEKAT, VANTAR].includes(status)) throw new Error("Ogiltig status")

  const pi = await stripe.paymentIntents.retrieve(piId)
  const rad = (pi.metadata || {})[nyckelFor(slug)]
  if (!rad) throw new Error("Omdömet finns inte")

  const d = JSON.parse(rad)
  d.s = status

  await stripe.paymentIntents.update(piId, {
    metadata: { [nyckelFor(slug)]: JSON.stringify(d) },
  })
  return d
}
