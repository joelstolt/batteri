import Stripe from "stripe"
import { unstable_cache } from "next/cache"
/**
 * Ordrarna bor i Stripe.
 *
 * Det finns ingen egen databas och behövs ingen: varje PaymentIntent bär redan
 * köparens uppgifter, raderna och frakten i sin metadata, satt av
 * /api/order-details direkt efter betalningen. Det här är den enda platsen som
 * översätter en PaymentIntent till en order, så admin, kundkontot och
 * leveransmejlet aldrig kan börja tolka samma fält på olika sätt.
 */

import { lasKallaUrMetadata } from "./attribution"

/**
 * Kundens ordernummer.
 *
 * Formeln får INTE ändras. Numret står redan i orderbekräftelser och
 * leveransmejl som är utskickade, och ändras den slutar kunden hitta sin order.
 */
export function orderIdFor(paymentIntentId) {
  return paymentIntentId.replace("pi_", "BP-").slice(0, 14).toUpperCase()
}

/**
 * Läser orderraderna ur metadatan.
 *
 * Två format förekommer och båda måste fungera för all framtid, eftersom
 * gamla ordrar ligger kvar oförändrade i Stripe:
 *
 *   {name, qty, price}   före 2026-07-29. Saknar slug, så "beställ igen"
 *                        får matcha på namn i stället.
 *   {s, n, q, p}         efter. Korta nycklar för att få plats med sluggen
 *                        inom Stripes 500 tecken.
 */
export function parsaItems(raw) {
  if (!raw) return { rader: [], strukna: 0 }
  let items
  try {
    items = JSON.parse(raw)
  } catch {
    // Äldre ordrar kunde kapas mitt i JSON:en. Hellre en order utan rader än
    // en vy som kraschar — hela ordern finns kvar i Stripe.
    return { rader: [], strukna: 0 }
  }
  if (!Array.isArray(items)) return { rader: [], strukna: 0 }

  // {o: N} är ingen rad utan en notering om att N rader inte fick plats.
  const strukna = items.reduce((n, i) => n + (Number(i?.o) || 0), 0)

  const rader = items
    .filter((i) => i && i.o === undefined)
    .map((i) => ({
      slug: i.s || i.slug || null,
      name: i.n || i.name || "",
      qty: Number(i.q ?? i.qty) || 0,
      price: Number(i.p ?? i.price) || 0,
    }))

  return { rader, strukna }
}

/**
 * @param {import("stripe").Stripe.PaymentIntent} pi  med latest_charge expanderad
 */
export function normaliseraOrder(pi) {
  const meta = pi.metadata || {}
  const charge = typeof pi.latest_charge === "object" ? pi.latest_charge : null
  const billing = charge?.billing_details || {}
  const ship = pi.shipping || {}
  const { rader, strukna } = parsaItems(meta.items)

  return {
    id: pi.id,
    orderId: orderIdFor(pi.id),
    created: pi.created,
    amount: pi.amount / 100,
    /*
     * Tre lägen, inte två.
     *
     * "reserverad" betyder att pengarna är öronmärkta på kundens kort men inte
     * dragna. Dragningen sker när spårningsnumret matas in. Reservationen dör
     * efter sju dygn, så den skillnaden måste synas i adminvyn.
     */
    status: meta.shipped_at
      ? "skickad"
      : pi.status === "requires_capture"
        ? "reserverad"
        : "betald",
    /** Dygn sedan reservationen gjordes. Null när pengarna redan är dragna. */
    reservationsalder:
      pi.status === "requires_capture"
        ? Math.floor((Date.now() / 1000 - pi.created) / 86400)
        : null,
    items: rader,
    // Antal rader som inte fick plats i metadatan. Nästan alltid 0 — bara
    // ordrar med väldigt många olika artiklar slår i taket.
    struknaRader: strukna,
    subtotal: Number(meta.subtotal) || 0,
    shipping: Number(meta.shipping) || 0,
    totalInclVat: Number(meta.total_incl_vat) || pi.amount / 100,
    company: {
      name: meta.company_name || "",
      orgNr: meta.org_nr || "",
      vatNr: meta.vat_nr || "",
      reference: meta.reference || "",
      poNumber: meta.po_number || "",
      invoiceEmail: meta.invoice_email || "",
    },
    customer: {
      name: meta.buyer_name || billing.name || "",
      email: meta.buyer_email || billing.email || pi.receipt_email || "",
      phone: meta.buyer_phone || billing.phone || "",
    },
    delivery: {
      name: ship.name || "",
      line1: ship.address?.line1 || billing.address?.line1 || "",
      postalCode: ship.address?.postal_code || billing.address?.postal_code || "",
      city: ship.address?.city || billing.address?.city || "",
      phone: meta.delivery_phone || ship.phone || "",
      unloading: meta.unloading || "",
    },
    tracking: meta.shipped_at
      ? {
          number: meta.tracking || "",
          carrier: meta.carrier || "",
          shippedAt: Number(meta.shipped_at) || null,
        }
      : null,
    card: {
      brand: charge?.payment_method_details?.card?.brand || null,
      last4: charge?.payment_method_details?.card?.last4 || null,
    },
    /** Varifrån köpet kom. Se lib/attribution.js. */
    source: lasKallaUrMetadata(meta),
  }
}

/** Mejladressen en order ska kunna hittas på. Alltid gemener, alltid trimmad. */
export function orderEpost(order) {
  return String(order.customer.email || "").trim().toLowerCase()
}

/**
 * De senaste riktiga ordrarna, för startsidans "Senaste köp".
 *
 * Bara produkt och datum visas — inga företagsnamn, inga belopp. Det är sant
 * (Stripe är källan), det är inte personuppgifter, och det svarar på frågan
 * "handlar någon här på riktigt?" utan att räkna högt. Reserverade ordrar
 * (requires_capture) är lagda ordrar och räknas. Testköp (dold=1, småbelopp)
 * räknas inte. Webhooken revaliderar taggen "kop" så en ny order syns direkt.
 */
export const hamtaSenasteKopCachat = unstable_cache(
  async () => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { maxNetworkRetries: 4 })
    const svar = await stripe.paymentIntents.list({ limit: 40 })
    return svar.data
      .filter(
        (pi) =>
          (pi.status === "succeeded" || pi.status === "requires_capture") &&
          pi.metadata?.buyer_email &&
          pi.metadata?.dold !== "1" &&
          pi.amount >= 100000
      )
      .map((pi) => {
        const rad = parsaItems(pi.metadata?.items).rader[0]
        return rad ? { datum: pi.created, slug: rad.slug, namn: rad.name, antal: rad.qty } : null
      })
      .filter(Boolean)
      .slice(0, 3)
  },
  ["senaste-kop"],
  { revalidate: 3600, tags: ["kop"] }
)

/**
 * Senaste köp per produkt, för produktsidans "Senast köpt"-rad.
 * { slug: { datum, antal, ordrar } } — datum/antal från senaste ordern,
 * ordrar = antal ordrar med produkten i det lästa fönstret (senaste 100).
 */
export const hamtaKopPerProduktCachat = unstable_cache(
  async () => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { maxNetworkRetries: 4 })
    const svar = await stripe.paymentIntents.list({ limit: 100 })
    const per = {}
    for (const pi of svar.data) {
      const riktig =
        (pi.status === "succeeded" || pi.status === "requires_capture") &&
        pi.metadata?.buyer_email &&
        pi.metadata?.dold !== "1" &&
        pi.amount >= 100000
      if (!riktig) continue
      for (const rad of parsaItems(pi.metadata?.items).rader) {
        if (!rad.slug) continue
        const f = per[rad.slug]
        if (!f) per[rad.slug] = { datum: pi.created, antal: rad.qty, ordrar: 1 }
        else {
          f.ordrar += 1
          if (pi.created > f.datum) {
            f.datum = pi.created
            f.antal = rad.qty
          }
        }
      }
    }
    return per
  },
  ["kop-per-produkt"],
  { revalidate: 3600, tags: ["kop"] }
)
