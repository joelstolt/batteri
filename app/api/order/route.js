import Stripe from "stripe"
import { NextResponse } from "next/server"
import { normaliseraOrder } from "@/lib/orders"
import { isConfirmedPayment } from "@/lib/payment-status"
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
export async function GET(request) {
  const params = new URL(request.url).searchParams
  const id = params.get("payment_intent"),
    secret = params.get("payment_intent_client_secret")
  if (!id || !secret)
    return NextResponse.json(
      { error: "Ingen betalning hittades" },
      { status: 400 }
    )
  try {
    const pi = await stripe.paymentIntents.retrieve(id, {
      expand: ["latest_charge"],
    })
    if (pi.client_secret !== secret)
      return NextResponse.json(
        { error: "Ingen betalning hittades" },
        { status: 403 }
      )
    if (!isConfirmedPayment(pi.status))
      return NextResponse.json(
        {
          error:
            "Ordern är inte bekräftad. Kontrollera betalningen innan du försöker igen.",
          paymentStatus: pi.status,
        },
        { status: 409 }
      )
    const order = normaliseraOrder(pi)
    return NextResponse.json(
      {
        id: order.id,
        orderId: order.orderId,
        paymentStatus: pi.status,
        amount: order.amount,
        items: order.items,
        incompleteItems: order.incompleteItems,
        struknaRader: order.struknaRader,
        subtotal: order.subtotal,
        shipping: order.shipping,
        totalInclVat: order.totalInclVat,
        company: order.company,
        delivery: order.delivery,
        customer: order.customer,
        cardBrand: order.card.brand,
        cardLast4: order.card.last4,
        created: order.created,
      },
      { headers: { "Cache-Control": "private, no-store" } }
    )
  } catch (error) {
    if (error?.code === "resource_missing")
      return NextResponse.json(
        { error: "Ingen betalning hittades" },
        { status: 404 }
      )
    console.error("Order lookup failed:", error?.type || "upstream_error")
    return NextResponse.json(
      { error: "Kunde inte verifiera ordern just nu. Försök igen." },
      { status: 503 }
    )
  }
}
