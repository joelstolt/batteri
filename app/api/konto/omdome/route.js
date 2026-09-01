import Stripe from "stripe"
import { NextResponse } from "next/server"
import { inloggadEpost } from "@/lib/konto-auth"
import { normaliseraOrder, orderEpost } from "@/lib/orders"
import { omdomenUrPI, sparaOmdome, MAX_TEXT, MIN_BETYG, MAX_BETYG } from "@/lib/omdomen"
import { skickaOmdomeNotis } from "@/lib/omdome-notis"
import { rateLimit, clientIp, isOwnOrigin, ALLOWED_ORIGINS } from "@/lib/rate-limit"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/**
 * Kunden lämnar ett omdöme.
 *
 * Tre saker måste stämma innan något sparas: sessionen är giltig, ordern
 * tillhör den inloggade adressen, och artikeln finns faktiskt på just den
 * ordern. Det är det som gör "verifierat köp" till ett påstående vi kan stå
 * för och inte bara en etikett.
 */
export async function POST(request) {
  if (!isOwnOrigin(request, ALLOWED_ORIGINS)) {
    return NextResponse.json({ error: "Ogiltigt anrop" }, { status: 403 })
  }

  const epost = inloggadEpost(request)
  if (!epost) return NextResponse.json({ error: "Inte inloggad" }, { status: 401 })

  const limit = rateLimit(`omdome:${clientIp(request)}`, 10, 60 * 60 * 1000)
  if (!limit.ok) {
    return NextResponse.json(
      { error: "För många omdömen på kort tid." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    )
  }

  const body = await request.json().catch(() => null)
  const { paymentIntentId, slug, betyg, text, namn, anonym } = body || {}

  if (!paymentIntentId || !slug) {
    return NextResponse.json({ error: "Ofullständigt anrop" }, { status: 400 })
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

    // Ordern måste tillhöra den inloggade. Utan den här kontrollen räcker det
    // att gissa ett pi-id för att skriva omdömen på någon annans köp.
    if (pi.status !== "succeeded" || orderEpost(order) !== epost) {
      return NextResponse.json({ error: "Ordern hittades inte" }, { status: 404 })
    }

    // Artikeln måste finnas på ordern.
    if (!order.items.some((r) => r.slug === slug)) {
      return NextResponse.json(
        { error: "Den artikeln finns inte på den ordern" },
        { status: 400 }
      )
    }

    // Ett omdöme per artikel och order. Annars går det att skriva om sitt
    // omdöme hur många gånger som helst efter att det godkänts.
    if (omdomenUrPI(pi).some((o) => o.slug === slug)) {
      return NextResponse.json(
        { error: "Du har redan lämnat ett omdöme på den artikeln. Mejla info@batteriproffs.se om du vill ändra det." },
        { status: 409 }
      )
    }

    const visatNamn = anonym ? "" : String(namn || order.customer.name || "").trim()
    await sparaOmdome(paymentIntentId, slug, { betyg: b, text, namn: visatNamn })

    // Notisen får aldrig fälla själva omdömet. Sparningen är klar här, och ett
    // trasigt mejlutskick ska inte ge kunden ett felmeddelande på något hon
    // redan gjort rätt.
    try {
      await skickaOmdomeNotis({
        betyg: b,
        text: String(text || ""),
        namn: visatNamn,
        slug,
        orderId: order.orderId,
        epost,
      })
    } catch (err) {
      console.error("Omdömesnotis kunde inte skickas:", err)
    }

    return NextResponse.json({
      ok: true,
      // Ingenting publiceras oberett. Säg det rakt ut så kunden inte undrar
      // varför omdömet inte syns på produktsidan.
      meddelande: "Tack! Ditt omdöme granskas innan det publiceras.",
    })
  } catch (err) {
    console.error("Omdöme kunde inte sparas:", err)
    return NextResponse.json({ error: "Kunde inte spara omdömet" }, { status: 500 })
  }
}
