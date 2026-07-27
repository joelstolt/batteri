import Stripe from "stripe"
import { NextResponse } from "next/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const paymentIntentId = searchParams.get("payment_intent")
    const clientSecret = searchParams.get("payment_intent_client_secret")

    if (!paymentIntentId || !clientSecret) {
      return NextResponse.json({ error: "Ingen betalning hittades" }, { status: 400 })
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    // Bara den som faktiskt genomförde köpet har client_secret — utan den här
    // kontrollen kan vem som helst med ett pi-id läsa kundens namn och adress.
    if (paymentIntent.client_secret !== clientSecret) {
      return NextResponse.json({ error: "Ingen betalning hittades" }, { status: 403 })
    }

    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json({ error: "Betalningen har inte genomförts" }, { status: 400 })
    }

    // Parse metadata
    const items = paymentIntent.metadata.items
      ? JSON.parse(paymentIntent.metadata.items)
      : []
    const subtotal = Number(paymentIntent.metadata.subtotal) || 0
    const shipping = Number(paymentIntent.metadata.shipping) || 0
    const totalInclVat = Number(paymentIntent.metadata.total_incl_vat) || paymentIntent.amount / 100

    // Get billing details from the charge
    const charges = await stripe.charges.list({ payment_intent: paymentIntentId, limit: 1 })
    const charge = charges.data[0]
    const billingDetails = charge?.billing_details || {}

    return NextResponse.json({
      id: paymentIntent.id,
      amount: paymentIntent.amount / 100,
      items,
      subtotal,
      shipping,
      totalInclVat,
      customer: {
        name: billingDetails.name || "",
        email: billingDetails.email || "",
        phone: billingDetails.phone || "",
        address: billingDetails.address || {},
      },
      cardBrand: charge?.payment_method_details?.card?.brand || null,
      cardLast4: charge?.payment_method_details?.card?.last4 || null,
      created: paymentIntent.created,
    })
  } catch (error) {
    console.error("Order fetch error:", error)
    return NextResponse.json(
      { error: "Kunde inte hämta orderinformation" },
      { status: 500 }
    )
  }
}
