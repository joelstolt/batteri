import Stripe from "stripe"
import { NextResponse } from "next/server"
import {
  validateCheckout,
  buildOrderMetadata,
  normalizePostalCode,
} from "@/lib/checkout"
import { rateLimit, clientIp, isOwnOrigin, ALLOWED_ORIGINS } from "@/lib/rate-limit"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const runtime = "nodejs"

/**
 * Fäster företags- och leveransuppgifterna på betalningen precis innan kunden
 * bekräftar den. Betalningen skapas när kassan öppnas, långt innan formuläret
 * är ifyllt — därför sker det i två steg.
 */
export async function POST(request) {
  try {
    if (!isOwnOrigin(request, ALLOWED_ORIGINS)) {
      return NextResponse.json({ error: "Ogiltigt anrop" }, { status: 403 })
    }
    const limit = rateLimit(`details:${clientIp(request)}`, 30, 10 * 60 * 1000)
    if (!limit.ok) {
      return NextResponse.json(
        { error: "För många försök. Vänta en stund." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
      )
    }

    const body = await request.json().catch(() => null)
    const paymentIntentId = body?.paymentIntentId
    const clientSecret = body?.clientSecret
    const form = body?.form

    if (!paymentIntentId || !clientSecret || !form) {
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

    // Servern validerar om — klientens kontroll är bara för användarens skull
    const errors = validateCheckout(form)
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ error: "Ofullständiga uppgifter", errors }, { status: 400 })
    }

    const meta = buildOrderMetadata(form)
    const company = meta.company_name

    // Leveransuppgifterna läggs på Stripes shipping-fält så att de syns i
    // Stripe-dashboarden, inte bara i metadata.
    const attention = String(form.goodsRecipient || "").trim()

    await stripe.paymentIntents.update(paymentIntentId, {
      description: `Order — ${company}`,
      shipping: {
        name: attention ? `${company} — att: ${attention}` : company,
        phone: String(form.deliveryPhone || form.phone || "").trim() || undefined,
        address: {
          line1: String(form.address || "").trim(),
          line2: String(form.doorCode || "").trim() ? `Portkod ${String(form.doorCode).trim()}` : undefined,
          postal_code: normalizePostalCode(form.postalCode),
          city: String(form.city || "").trim(),
          country: "SE",
        },
      },
      metadata: {
        // Behåll radartiklarna och prisuppdelningen som skapades server-side
        ...pi.metadata,
        ...meta,
      },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Order details update failed:", error)
    return NextResponse.json({ error: "Kunde inte spara uppgifterna" }, { status: 500 })
  }
}
