import { NextResponse } from "next/server"
import Stripe from "stripe"
import { resend, FROM, ADMIN_EMAIL, escape, emailLayout } from "@/lib/emails"

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
  const token = request.headers.get("x-admin-token")
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const { paymentIntentId, tracking, carrier = "PostNord" } = body || {}

  if (!paymentIntentId || !tracking) {
    return NextResponse.json(
      { error: "paymentIntentId and tracking required" },
      { status: 400 }
    )
  }

  try {
    const pi = await stripe.paymentIntents.retrieve(paymentIntentId)
    const charges = await stripe.charges.list({
      payment_intent: pi.id,
      limit: 1,
    })
    const billing = charges.data[0]?.billing_details || {}
    const customerEmail = billing.email || pi.receipt_email
    const customerName = billing.name || ""

    if (!customerEmail) {
      return NextResponse.json(
        { error: "No customer email on order" },
        { status: 400 }
      )
    }

    const orderId = pi.id.replace("pi_", "BP-").slice(0, 14).toUpperCase()
    const trackingUrl =
      carrier.toLowerCase() === "postnord"
        ? `https://www.postnord.se/vara-verktyg/spara-brev-och-paket?shipmentId=${encodeURIComponent(tracking)}`
        : carrier.toLowerCase() === "dhl"
          ? `https://www.dhl.com/se-sv/home/tracking.html?tracking-id=${encodeURIComponent(tracking)}`
          : null

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
        på det här mejlet eller ring oss.
      </p>
    `

    await resend.emails.send({
      from: FROM,
      to: customerEmail,
      replyTo: ADMIN_EMAIL,
      subject: `Din order är skickad — ${orderId}`,
      html: emailLayout({
        title: `Din order är skickad — ${orderId}`,
        preheader: `${carrier} · ${tracking}`,
        body: emailBody,
      }),
    })

    return NextResponse.json({ ok: true, orderId, tracking, carrier })
  } catch (err) {
    console.error("Ship route error:", err)
    return NextResponse.json(
      { error: err.message || "Något gick fel" },
      { status: 500 }
    )
  }
}
