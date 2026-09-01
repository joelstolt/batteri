import Stripe from "stripe"
import { NextResponse } from "next/server"
import { lasOmdomeToken } from "@/lib/konto-auth"
import { normaliseraOrder } from "@/lib/orders"
import { omdomenUrPI, sparaOmdome, MAX_TEXT, MIN_BETYG, MAX_BETYG } from "@/lib/omdomen"
import { skickaOmdomeNotis } from "@/lib/omdome-notis"
import { rateLimit, clientIp, isOwnOrigin, ALLOWED_ORIGINS } from "@/lib/rate-limit"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/**
 * Omdöme via direktlänken i mejlet.
 *
 * Skiljer sig från /api/konto/omdome på EN punkt: rätten att skriva kommer ur
 * den signerade token i stället för en inloggad session. Token pekar ut exakt
 * en order, så ägarkontrollen ligger i signaturen — resten av reglerna är
 * samma: artikeln måste finnas på ordern, ett omdöme per artikel, allt
 * modereras.
 */
export async function POST(request) {
  if (!isOwnOrigin(request, ALLOWED_ORIGINS)) {
    return NextResponse.json({ error: "Ogiltigt anrop" }, { status: 403 })
  }

  const limit = rateLimit(`omdome:${clientIp(request)}`, 10, 60 * 60 * 1000)
  if (!limit.ok) {
    return NextResponse.json(
      { error: "För många omdömen på kort tid." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    )
  }

  const body = await request.json().catch(() => null)
  const { token, slug, betyg, text, anonym } = body || {}

  const paymentIntentId = lasOmdomeToken(token)
  if (!paymentIntentId || !slug) {
    return NextResponse.json({ error: "Länken är ogiltig eller har gått ut" }, { status: 401 })
  }

  const b = Number(betyg)
  if (!Number.isInteger(b) || b < MIN_BETYG || b > MAX_BETYG) {
    return NextResponse.json({ error: "Välj ett betyg mellan 1 och 5" }, { status: 400 })
  }
  if (String(text || "").length > MAX_TEXT) {
    return NextResponse.json({ error: `Texten får vara max ${MAX_TEXT} tecken` }, { status: 400 })
  }

  try {
    const pi = await stripe.paymentIntents.retrieve(paymentIntentId, {
      expand: ["latest_charge"],
    })
    const order = normaliseraOrder(pi)

    if (pi.status !== "succeeded") {
      return NextResponse.json({ error: "Ordern hittades inte" }, { status: 404 })
    }

    if (!order.items.some((r) => r.slug === slug)) {
      return NextResponse.json(
        { error: "Den artikeln finns inte på den ordern" },
        { status: 400 }
      )
    }

    if (omdomenUrPI(pi).some((o) => o.slug === slug)) {
      return NextResponse.json(
        { error: "Du har redan lämnat ett omdöme på den artikeln. Mejla info@batteriproffs.se om du vill ändra det." },
        { status: 409 }
      )
    }

    const visatNamn = anonym ? "" : String(order.customer.name || "").trim()
    await sparaOmdome(paymentIntentId, slug, { betyg: b, text, namn: visatNamn })

    // Notisen får aldrig fälla själva omdömet.
    try {
      await skickaOmdomeNotis({
        betyg: b,
        text: String(text || ""),
        namn: visatNamn,
        slug,
        orderId: order.orderId,
        epost: order.customer.email,
      })
    } catch (err) {
      console.error("Omdömesnotis kunde inte skickas:", err)
    }

    return NextResponse.json({
      ok: true,
      meddelande: "Tack! Ditt omdöme granskas innan det publiceras.",
    })
  } catch (err) {
    console.error("Omdöme kunde inte sparas:", err)
    return NextResponse.json({ error: "Kunde inte spara omdömet" }, { status: 500 })
  }
}
