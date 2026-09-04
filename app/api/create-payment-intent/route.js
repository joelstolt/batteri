import Stripe from "stripe"
import { createHash, randomUUID } from "node:crypto"
import { serializeOrderItems } from "@/lib/order-items"
import { NextResponse } from "next/server"
// Priset slås upp i lib/products.js, aldrig via Sanity. Sanity-datasetet är
// tomt, så varje orderrad kostade ett nätverksanrop som ändå föll tillbaka hit.
// Värre: la någon in en produkt i studion vann Sanity-priset i kassan medan
// produktsidan visade det hårdkodade — kunden ser ett pris och debiteras ett
// annat. getProductBySlug slår mot hela `products`, inte publicProducts, så
// dolda testartiklar går fortfarande att provköpa precis som förut.
import { getProductBySlug } from "@/lib/products"
import {
  rateLimit,
  clientIp,
  isOwnOrigin,
  ALLOWED_ORIGINS,
} from "@/lib/rate-limit"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const SHIPPING_COST = 556
const VAT_RATE = 1.25
const SLUG_RE = /^[a-z0-9-]{1,80}$/i
const MAX_QTY = 99
const MAX_LINE_ITEMS = 50
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

    // Merge repeated slugs before quantity validation so the per-product cap holds.
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

    const counts = new Map()
    for (const row of incoming)
      counts.set(row.slug, (counts.get(row.slug) || 0) + Number(row.qty))
    if ([...counts.values()].some((qty) => qty > MAX_QTY))
      return NextResponse.json(
        { error: "För många av samma artikel" },
        { status: 400 }
      )

    // Priset avgörs på servern. Klientens pris läses aldrig.
    const resolved = [...counts].map(([slug, qty]) => {
      const i = { slug, qty }
      const p = getProductBySlug(i.slug)
      return p ? { product: p, qty: Number(i.qty) } : null
    })

    if (resolved.some((r) => !r)) {
      return NextResponse.json(
        { error: "Produkt hittades inte" },
        { status: 400 }
      )
    }
    if (resolved.some((r) => r.product.inStock === false)) {
      return NextResponse.json(
        { error: "Produkten är slut i lager" },
        { status: 400 }
      )
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
    const shipping = resolved.every(({ product }) => product.freeShipping)
      ? 0
      : SHIPPING_COST
    const totalInclVat = subtotalInclVat + Math.round(shipping * VAT_RATE)
    const amountInOre = Math.round(totalInclVat * 100)

    let itemsMetadata
    try {
      itemsMetadata = serializeOrderItems(itemSummary)
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 422 })
    }
    const attempt =
      typeof body.attemptId === "string" &&
      /^[a-z0-9-]{20,80}$/i.test(body.attemptId)
        ? body.attemptId
        : randomUUID()
    const fingerprint = createHash("sha256")
      .update(JSON.stringify({ attempt, itemSummary, shipping }))
      .digest("hex")

    const paymentIntent = await stripe.paymentIntents.create(
      {
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
          ...itemsMetadata,
          subtotal: String(Math.round(subtotalInclVat / VAT_RATE)),
          shipping: String(shipping),
          total_incl_vat: String(totalInclVat),
        },
      },
      { idempotencyKey: `checkout-${fingerprint}` }
    )

    const currentPayment = await stripe.paymentIntents.retrieve(
      paymentIntent.id
    )
    return NextResponse.json({
      clientSecret: currentPayment.client_secret,
      paymentStatus: currentPayment.status,
      quote: {
        items: resolved.map(({ product, qty }) => ({
          slug: product.slug,
          name: product.name,
          shortName: product.shortName,
          price: product.price,
          images: product.images,
          capacity: product.capacity,
          freeShipping: !!product.freeShipping,
          qty,
        })),
        subtotalInclVat,
        shippingInclVat: Math.round(shipping * VAT_RATE),
        totalInclVat,
      },
    })
  } catch (error) {
    console.error("Stripe PaymentIntent error:", error)
    return NextResponse.json({ error: "Något gick fel" }, { status: 500 })
  }
}
