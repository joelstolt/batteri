import Stripe from "stripe"
import { NextResponse } from "next/server"
// Priset slås upp i lib/products.js, aldrig via Sanity. Sanity-datasetet är
// tomt, så varje orderrad kostade ett nätverksanrop som ändå föll tillbaka hit.
// Värre: la någon in en produkt i studion vann Sanity-priset i kassan medan
// produktsidan visade det hårdkodade — kunden ser ett pris och debiteras ett
// annat. getProductBySlug slår mot hela `products`, inte publicProducts, så
// dolda testartiklar går fortfarande att provköpa precis som förut.
import { getProductBySlug } from "@/lib/products"
import { rateLimit, clientIp, isOwnOrigin, ALLOWED_ORIGINS } from "@/lib/rate-limit"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const SHIPPING_COST = 556
const VAT_RATE = 1.25
const SLUG_RE = /^[a-z0-9-]{1,80}$/i
const MAX_QTY = 99
const MAX_LINE_ITEMS = 50
const META_TAK = 500

/**
 * Packar så många rader som får plats och lägger till hur många som ströks.
 *
 * Utan den här föll en order med fler än ett tiotal rader tillbaka på en tom
 * lista, alltså ingen orderhistorik alls för den kunden. Nu behålls det som
 * ryms, och {o: N} på slutet gör att vyerna kan säga att det finns fler rader
 * i stället för att låtsas att ordern var mindre än den var. Beloppet räknas
 * ändå ut på hela varukorgen, inte på det här.
 */
function packaRader(rader) {
  for (let n = rader.length - 1; n > 0; n--) {
    const kandidat = JSON.stringify([...rader.slice(0, n), { o: rader.length - n }])
    if (kandidat.length <= META_TAK) return kandidat
  }
  console.warn("Orderrader fick inte plats i metadata:", rader.length, "rader")
  return JSON.stringify([{ o: rader.length }])
}

export const runtime = "nodejs"

export async function POST(request) {
  try {
    if (!isOwnOrigin(request, ALLOWED_ORIGINS)) {
      return NextResponse.json({ error: "Ogiltigt anrop" }, { status: 403 })
    }
    const limit = rateLimit(`pi:${clientIp(request)}`, 20, 10 * 60 * 1000)
    if (!limit.ok) {
      return NextResponse.json(
        { error: "För många försök. Vänta en stund och ladda om sidan." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
      )
    }

    const body = await request.json().catch(() => null)
    if (!body || !Array.isArray(body.items)) {
      return NextResponse.json({ error: "Ogiltigt anrop" }, { status: 400 })
    }

    const incoming = body.items
    if (incoming.length === 0 || incoming.length > MAX_LINE_ITEMS) {
      return NextResponse.json({ error: "Varukorgen är tom" }, { status: 400 })
    }

    // Validate input shape — slug + qty only, never trust client price
    for (const i of incoming) {
      if (!i || typeof i.slug !== "string" || !SLUG_RE.test(i.slug)) {
        return NextResponse.json({ error: "Ogiltig produkt" }, { status: 400 })
      }
      const qty = Number(i.qty)
      if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) {
        return NextResponse.json({ error: "Ogiltigt antal" }, { status: 400 })
      }
    }

    // Priset avgörs på servern. Klientens pris läses aldrig.
    const resolved = incoming.map((i) => {
      const p = getProductBySlug(i.slug)
      return p ? { product: p, qty: Number(i.qty) } : null
    })

    if (resolved.some((r) => !r)) {
      return NextResponse.json({ error: "Produkt hittades inte" }, { status: 400 })
    }
    if (resolved.some((r) => r.product.inStock === false)) {
      return NextResponse.json({ error: "Produkten är slut i lager" }, { status: 400 })
    }

    // Authoritative line items — server-side prices only
    const itemSummary = resolved.map(({ product, qty }) => ({
      slug: product.slug,
      name: product.name || product.shortName,
      qty,
      price: product.price,
    }))

    // Product prices are stored INCL. moms; shipping is stored excl. moms.
    const subtotalInclVat = itemSummary.reduce((s, i) => s + i.price * i.qty, 0)
    // Fraktfritt bara när varenda rad är fraktfri — annars full frakt.
    // Avgörs på servern, aldrig av det klienten skickar in.
    const shipping = resolved.every(({ product }) => product.freeShipping) ? 0 : SHIPPING_COST
    const totalInclVat = subtotalInclVat + Math.round(shipping * VAT_RATE)
    const amountInOre = totalInclVat * 100

    // Stripe kapar varje metadatavärde vid 500 tecken.
    //
    // Raderna sparas därför med korta nycklar: s=slug, n=namn, q=antal, p=pris.
    // Sluggen är det som gör "beställ igen" i kundkontot möjlig, så den ryker
    // aldrig. Blir det ändå för långt faller vi tillbaka på slug utan namn —
    // namnet går att slå upp ur lib/products.js, det gör inte sluggen.
    // lib/orders.js läser både det här och det gamla {name,qty,price}-formatet.
    const kompakt = itemSummary.map((i) => ({ s: i.slug, n: i.name, q: i.qty, p: i.price }))
    let itemsMeta = JSON.stringify(kompakt)
    if (itemsMeta.length > META_TAK) {
      itemsMeta = JSON.stringify(kompakt.map(({ s, q, p }) => ({ s, q, p })))
    }
    if (itemsMeta.length > META_TAK) {
      itemsMeta = packaRader(kompakt.map(({ s, q, p }) => ({ s, q, p })))
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInOre,
      currency: "sek",
      // Endast kortbetalning. Explicit lista slår Dashboard-inställningarna,
      // så Klarna/Link/Amazon Pay kan inte dyka upp i kassan även om de är
      // påslagna på Stripe-kontot.
      payment_method_types: ["card"],
      /*
       * Pengarna reserveras nu och dras när batteriet skickas.
       *
       * Det är vad köpvillkoren alltid har lovat, och det är rimligare mot
       * kunden: hon betalar för en vara som är på väg, inte för ett löfte.
       *
       * VIKTIGT: en kortreservation dör efter sju dygn. Görs ingen capture
       * innan dess släpps pengarna och kunden måste betala om. Dra därför
       * senast dag fem, även om paketet inte hunnit iväg. Adminvyn varnar.
       */
      capture_method: "manual",
      metadata: {
        order_source: "batteriproffs.se",
        items: itemsMeta,
        subtotal: String(Math.round(subtotalInclVat / VAT_RATE)),
        shipping: String(shipping),
        total_incl_vat: String(totalInclVat),
      },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    console.error("Stripe PaymentIntent error:", error)
    return NextResponse.json({ error: "Något gick fel" }, { status: 500 })
  }
}
