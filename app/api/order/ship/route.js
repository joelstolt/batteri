import { createHash } from "node:crypto"
import { trackingUrl as trackingUrlFor } from "@/lib/customer-tools"
import { NextResponse } from "next/server"
import Stripe from "stripe"
import { resend, FROM, ADMIN_EMAIL, escape, emailLayout } from "@/lib/emails"
import { kravAdmin } from "@/lib/admin-auth"
import { orderIdFor } from "@/lib/orders"
import { scheduleReviewEmail } from "@/lib/review-email"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const runtime = "nodejs"

/**
 * Admin-only endpoint for manually triggering "Order shipped" email.
 * Auth is a shared secret via header `x-admin-token`.
 *
 * Body:
 *   {
 *     "paymentIntentId": "pi_...",
 *     "tracking": "AB1234567890SE",
 *     "carrier": "PostNord"   (optional, default PostNord)
 *   }
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

  // tyst: true drar betalningen och registrerar leveransen, men skickar inget
  // systemmejl. Används när kunden får ett personligt mejl i stället, så att
  // hon inte får två utskick om samma leverans.
  const {
    paymentIntentId,
    tracking,
    carrier = "PostNord",
    tyst = false,
  } = body || {}

  if (
    typeof paymentIntentId !== "string" ||
    !/^pi_[A-Za-z0-9]+$/.test(paymentIntentId) ||
    typeof tracking !== "string" ||
    !tracking.trim() ||
    tracking.length > 200 ||
    typeof carrier !== "string" ||
    !carrier.trim() ||
    carrier.length > 80 ||
    typeof tyst !== "boolean"
  ) {
    return NextResponse.json(
      { error: "paymentIntentId and tracking required" },
      { status: 400 },
    )
  }

  try {
    let pi = await stripe.paymentIntents.retrieve(paymentIntentId)

    /*
     * Dragningen sker här, i samma ögonblick som spårningsnumret matas in.
     * Kunden betalar alltså när batteriet går iväg, precis som villkoren säger.
     *
     * Går dragningen inte igenom skickas INGET leveransmejl. Ett spårningsmejl
     * på en order som aldrig betalades är svårare att reda ut än ett fel här.
     */
    if (pi.status === "requires_capture") {
      try {
        pi = await stripe.paymentIntents.capture(paymentIntentId)
      } catch (err) {
        console.error("Kunde inte dra betalningen:", err)
        return NextResponse.json(
          {
            error:
              "Betalningen kunde inte dras. Reservationen kan ha gått ut eller kortet spärrats. Kontakta kunden innan du skickar.",
          },
          { status: 402 },
        )
      }
    }

    if (pi.status !== "succeeded") {
      return NextResponse.json(
        {
          error:
            "Ordern har ingen bekräftad debitering. Registrera inte leverans innan betalningen är klar.",
        },
        { status: 409 },
      )
    }
    const alreadyShipped =
      !!pi.metadata?.shipped_at &&
      pi.metadata.tracking === tracking &&
      pi.metadata.carrier === carrier
    const charges = await stripe.charges.list({
      payment_intent: pi.id,
      limit: 1,
    })
    const billing = charges.data[0]?.billing_details || {}
    const customerEmail =
      pi.metadata?.buyer_email || billing.email || pi.receipt_email
    const customerName = billing.name || ""

    if (!customerEmail) {
      return NextResponse.json(
        { error: "No customer email on order" },
        { status: 400 },
      )
    }

    const orderId = orderIdFor(pi.id)
    // PostNord flyttade spårningen till tracking.postnord.com. Den gamla
    // adressen (postnord.se/vara-verktyg/spara-brev-och-paket?shipmentId=)
    // ger 404, och den låg i det här mejlet fram till 2026-08-04. Verifierad
    // mot en skarp försändelse innan bytet.
    const trackingUrl = trackingUrlFor(carrier, tracking)

    const emailBody = `
      <h1 style="margin:0 0 6px;font-size:22px;font-weight:800;letter-spacing:-0.01em;">
        Din order är på väg, ${escape(customerName.split(" ")[0] || "kund")}!
      </h1>
      <p style="margin:0 0 24px;font-size:14px;color:#6B7280;">
        Ordernr: <strong style="color:#0A1628;">${escape(orderId)}</strong>
      </p>

      <div style="margin:0 0 20px;padding:18px;background:linear-gradient(135deg,#FED66B,#FDB813);border-radius:12px;color:#0A1628;">
        <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;opacity:0.7;margin-bottom:6px;">
          ${escape(carrier)} · Spårningsnummer
        </div>
        <div style="font-family:ui-monospace,monospace;font-size:18px;font-weight:700;letter-spacing:0.5px;">
          ${escape(tracking)}
        </div>
      </div>

      ${
        trackingUrl
          ? `<a href="${trackingUrl}" style="display:inline-block;background:#0B1D3A;color:#fff;text-decoration:none;padding:12px 22px;border-radius:10px;font-weight:700;font-size:14px;">
              Spåra paketet
            </a>`
          : ""
      }

      <p style="margin-top:24px;font-size:14px;line-height:1.6;color:#374151;">
        Leveranstid är normalt 1–3 arbetsdagar. Frågor om leveransen? Svara
        på det här mejlet.
      </p>
    `

    if (!tyst && !alreadyShipped) {
      const sent = await resend.emails.send(
        {
          from: FROM,
          to: customerEmail,
          replyTo: ADMIN_EMAIL,
          subject: `Din order är skickad — ${orderId}`,
          html: emailLayout({
            title: `Din order är skickad — ${orderId}`,
            preheader: `${carrier} · ${tracking}`,
            body: emailBody,
          }),
        },
        {
          idempotencyKey: `shipment-${createHash("sha256")
            .update(JSON.stringify([pi.id, customerEmail, carrier, tracking]))
            .digest("hex")}`,
        },
      )
      if (sent?.error || !sent?.data?.id) {
        console.error("Leveransmejl nekades av mejltjänsten:", sent?.error)
        return NextResponse.json(
          {
            error:
              "Betalningen är dragen, men leveransmejlet kunde inte skickas. Leveransen har inte registrerats. Kontrollera mejltjänsten före nytt försök.",
          },
          { status: 502 },
        )
      }
    }

    // Omdömesmejlet köas när ordern skickas — då räknar fördröjningen från
    // leveransen och inte från orderläggningen. Skickas även i tyst läge:
    // tyst gäller LEVERANSbeskedet, omdömesfrågan är ett eget ärende.
    // review_email_at spärrar dubbletter om ship körs om på samma order.
    let reviewKoad = false
    if (!pi.metadata?.review_email_at) {
      try {
        await scheduleReviewEmail({
          to: customerEmail,
          // Beställarens namn, inte företagsnamnet — mejlet inleds med "Hej X"
          fullName: pi.metadata?.buyer_name || customerName,
          orderId,
          piId: pi.id,
          replyTo: ADMIN_EMAIL,
        })
        reviewKoad = true
      } catch (err) {
        // Ett trasigt omdömesmejl får aldrig stoppa leveransregistreringen.
        console.error("Omdömesmejl kunde inte schemaläggas:", err)
      }
    }

    // Leveransen skrivs tillbaka på ordern FÖRST efter att mejlet gått iväg, så
    // en order aldrig kan stå som skickad utan att kunden fått veta det.
    // I tyst läge gäller inte den invarianten här utan hos den som skickar det
    // personliga mejlet. Betalningen är redan dragen, så ordern får inte lämnas
    // omärkt heller då.
    // Stripe slår ihop metadata per nyckel, så köparens uppgifter rörs inte.
    try {
      await stripe.paymentIntents.update(pi.id, {
        metadata: {
          tracking,
          carrier,
          shipped_at:
            pi.metadata?.shipped_at || String(Math.floor(Date.now() / 1000)),
          ...(reviewKoad
            ? { review_email_at: String(Math.floor(Date.now() / 1000)) }
            : {}),
        },
      })
    } catch (err) {
      // Betalningen är dragen och mejlet eventuellt skickat. Sväljer vi det här
      // står ordern kvar som obetjänad i adminvyn och nästa person skickar
      // spårningsmejlet en gång till.
      console.error("Kunde inte märka ordern som skickad:", err)
      return NextResponse.json({
        ok: true,
        orderId,
        tracking,
        carrier,
        tyst,
        varning: tyst
          ? "Betalningen är dragen, men ordern kunde inte märkas som skickad i Stripe. Sätt spårningsnumret i Stripe för hand."
          : "Mejlet är skickat, men ordern kunde inte märkas som skickad i Stripe. Skicka inte om — sätt spårningsnumret i Stripe för hand.",
      })
    }

    return NextResponse.json({ ok: true, orderId, tracking, carrier, tyst })
  } catch (err) {
    console.error("Ship route error:", err)
    return NextResponse.json(
      { error: err.message || "Något gick fel" },
      { status: 500 },
    )
  }
}
