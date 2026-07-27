import Stripe from "stripe"
import { NextResponse } from "next/server"
import { fetchProductBySlug } from "@/lib/queries"
import { rateLimit, clientIp, isOwnOrigin, ALLOWED_ORIGINS } from "@/lib/rate-limit"

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

    // Resolve products server-side (Sanity → hardcoded fallback)
    const resolved = await Promise.all(
      incoming.map(async (i) => {
        const p = await fetchProductBySlug(i.slug)
        return p ? { product: p, qty: Number(i.qty) } : null
      })
    )

    if (resolved.some((r) => !r)) {
      return NextResponse.json({ error: "Produkt hittades inte" }, { status: 400 })
    }
    if (resolved.some((r) => r.product.inStock === false)) {
      return NextResponse.json({ error: "Produkten är slut i lager" }, { status: 400 })
    }

    // Authoritative line items — server-side prices only
    const itemSummary = resolved.map(({ product, qty }) => ({
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

    // Stripe metadata caps each value at 500 chars — truncate names if needed
    let itemsMeta = JSON.stringify(itemSummary)
    if (itemsMeta.length > 500) {
      itemsMeta = JSON.stringify(
        itemSummary.map((i) => ({ name: i.name.slice(0, 40), qty: i.qty, price: i.price }))
      ).slice(0, 500)
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInOre,
      currency: "sek",
      // Endast kortbetalning. Explicit lista slår Dashboard-inställningarna,
      // så Klarna/Link/Amazon Pay kan inte dyka upp i kassan även om de är
      // påslagna på Stripe-kontot.
      payment_method_types: ["card"],
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
