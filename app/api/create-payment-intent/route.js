import Stripe from "stripe"
import { NextResponse } from "next/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const SHIPPING_THRESHOLD = 2000
const SHIPPING_COST = 149
const VAT_RATE = 1.25

export async function POST(request) {
  try {
    const { items } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Varukorgen är tom" }, { status: 400 })
    }

    // Calculate subtotal (excl. VAT)
    const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0)
    const shippingCost = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST

    // Total including 25% VAT — this is what Stripe charges
    const totalInclVat = Math.round((subtotal + shippingCost) * VAT_RATE)

    // Amount in öre (smallest currency unit)
    const amountInOre = totalInclVat * 100

    const itemSummary = items.map((item) => ({
      name: item.name || item.shortName,
      qty: item.qty,
      price: item.price,
    }))

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInOre,
      currency: "sek",
      automatic_payment_methods: { enabled: true },
      metadata: {
        order_source: "batteriproffs.se",
        items: JSON.stringify(itemSummary),
        subtotal: String(subtotal),
        shipping: String(shippingCost),
        total_incl_vat: String(totalInclVat),
      },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    console.error("Stripe PaymentIntent error:", error)
    return NextResponse.json(
      { error: error.message || "Något gick fel" },
      { status: 500 }
    )
  }
}
