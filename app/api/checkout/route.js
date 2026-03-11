import Stripe from "stripe"
import { NextResponse } from "next/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const SHIPPING_THRESHOLD = 2000
const SHIPPING_COST = 149

export async function POST(request) {
  try {
    const { items } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Varukorgen är tom" }, { status: 400 })
    }

    // Calculate subtotal to determine shipping
    const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0)
    const shippingFree = subtotal >= SHIPPING_THRESHOLD

    // Build line items for Stripe
    const line_items = items.map((item) => ({
      price_data: {
        currency: "sek",
        product_data: {
          name: item.name || item.shortName,
          description: `${item.voltage} · ${item.capacity}`,
          images: item.images?.[0]?.startsWith("http")
            ? [item.images[0]]
            : [],
        },
        unit_amount: Math.round(item.price * 100), // Stripe uses öre (cents)
      },
      quantity: item.qty,
    }))

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: shippingFree ? 0 : SHIPPING_COST * 100,
              currency: "sek",
            },
            display_name: shippingFree
              ? "Fri frakt"
              : "PostNord — Hemleverans (1–3 dagar)",
          },
        },
      ],
      shipping_address_collection: {
        allowed_countries: ["SE"],
      },
      phone_number_collection: {
        enabled: true,
      },
      locale: "sv",
      success_url: `${request.headers.get("origin")}/tack?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get("origin")}/kassa`,
      metadata: {
        order_source: "batteriproffs.se",
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Stripe error:", error)
    return NextResponse.json(
      { error: error.message || "Något gick fel" },
      { status: 500 }
    )
  }
}
