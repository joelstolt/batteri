import Stripe from "stripe"
import { NextResponse } from "next/server"
import { giltigEpost } from "@/lib/konto-auth"
import { rateLimit, clientIp, isOwnOrigin, ALLOWED_ORIGINS } from "@/lib/rate-limit"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const runtime = "nodejs"

/**
 * Fäster beställarens mejladress på betalningen SÅ FORT den är ifylld i
 * kassan, långt före bekräftelsen. Utan det här är en övergiven kassa helt
 * anonym — augusti 2026 lämnades ~35 000 kr i påbörjade kassor som aldrig
 * gick att följa upp.
 *
 * Nyckeln heter kontakt_epost, INTE buyer_email. buyer_email är markören för
 * en genomförd order: kundkontot söker på den och adminvyn litar på den.
 * Skrevs den här skulle varje övergiven kassa dyka upp som en order i kundens
 * konto.
 */
export async function POST(request) {
  try {
    if (!isOwnOrigin(request, ALLOWED_ORIGINS)) {
      return NextResponse.json({ error: "Ogiltigt anrop" }, { status: 403 })
    }
    const limit = rateLimit(`kontakt:${clientIp(request)}`, 20, 10 * 60 * 1000)
    if (!limit.ok) {
      return NextResponse.json(
        { error: "För många försök" },
        { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
      )
    }

    const body = await request.json().catch(() => null)
    const { paymentIntentId, clientSecret, epost } = body || {}

    if (!paymentIntentId || !clientSecret || !giltigEpost(epost)) {
      return NextResponse.json({ error: "Ogiltigt anrop" }, { status: 400 })
    }

    const pi = await stripe.paymentIntents.retrieve(paymentIntentId)

    // Bara den som har betalningens client_secret får ändra på den
    if (pi.client_secret !== clientSecret) {
      return NextResponse.json({ error: "Ogiltigt anrop" }, { status: 403 })
    }

    // En redan betald order får inte skrivas om i efterhand
    if (pi.status !== "requires_payment_method" && pi.status !== "requires_confirmation") {
      return NextResponse.json({ error: "Betalningen kan inte ändras" }, { status: 409 })
    }

    await stripe.paymentIntents.update(paymentIntentId, {
      metadata: {
        kontakt_epost: String(epost).trim().toLowerCase(),
        kontakt_epost_at: String(Math.floor(Date.now() / 1000)),
      },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Kassa-kontakt kunde inte sparas:", error)
    return NextResponse.json({ error: "Kunde inte spara" }, { status: 500 })
  }
}
