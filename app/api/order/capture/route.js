import { NextResponse } from "next/server"
import Stripe from "stripe"
import { kravAdmin } from "@/lib/admin-auth"
import { orderIdFor } from "@/lib/orders"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const runtime = "nodejs"

/**
 * Admin-only: drar en reserverad betalning UTAN att skicka något mejl.
 *
 * Finns eftersom /api/order/ship kräver spårningsnummer för att dra pengarna,
 * men leverantören lämnar ofta numret ett par dygn efter att godset gått.
 * Två saker krockar då: reservationen dör efter sju dygn, och köpvillkoren
 * lovar att dragningen sker när varan skickas. Utan den här vägen måste
 * dragningen antingen vänta på fraktbolaget eller göras för hand i Stripe.
 *
 * Kör /api/order/ship som vanligt när spårningsnumret dyker upp. Dess
 * capture-block är villkorat på `requires_capture` och hoppas över när
 * betalningen redan är dragen, så någon dubbeldragning kan inte ske.
 *
 * Body: { "paymentIntentId": "pi_..." }
 */
export async function POST(request) {
  const avvisad = kravAdmin(request)
  if (avvisad) return avvisad

  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const { paymentIntentId } = body || {}
  if (!paymentIntentId) {
    return NextResponse.json({ error: "paymentIntentId required" }, { status: 400 })
  }

  try {
    const pi = await stripe.paymentIntents.retrieve(paymentIntentId)

    // Redan dragen. Svara ok, annars ser en dubbelklick ut som ett fel.
    if (pi.status === "succeeded") {
      return NextResponse.json({
        ok: true,
        redanDragen: true,
        orderId: orderIdFor(paymentIntentId),
      })
    }

    if (pi.status !== "requires_capture") {
      return NextResponse.json(
        {
          error: `Betalningen går inte att dra. Status är "${pi.status}", inte "requires_capture".`,
        },
        { status: 409 }
      )
    }

    const dragen = await stripe.paymentIntents.capture(paymentIntentId)

    return NextResponse.json({
      ok: true,
      orderId: orderIdFor(paymentIntentId),
      belopp: dragen.amount / 100,
    })
  } catch (err) {
    console.error("Kunde inte dra betalningen:", err)
    return NextResponse.json(
      {
        error:
          "Betalningen kunde inte dras. Reservationen kan ha gått ut (de gäller sju dygn) eller kortet spärrats. Kontakta kunden innan du skickar.",
      },
      { status: 402 }
    )
  }
}
