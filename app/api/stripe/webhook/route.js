import { NextResponse } from "next/server"
import Stripe from "stripe"
import {
  resend,
  FROM,
  ADMIN_EMAIL,
  escape,
  formatPriceKr,
  emailLayout,
} from "@/lib/emails"
import { scheduleReviewEmail } from "@/lib/review-email"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const runtime = "nodejs"

function buildOrderBody({ orderId, items, subtotal, shipping, total, customer, intro }) {
  const rows = items
    .map(
      (i) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #F0F1F4;">
            <div style="font-weight:600;font-size:14px;">${escape(i.name)}</div>
            ${i.qty > 1 ? `<div style="color:#6B7280;font-size:12px;">${i.qty} st × ${formatPriceKr(i.price)} kr</div>` : ""}
          </td>
          <td style="padding:10px 0;border-bottom:1px solid #F0F1F4;text-align:right;font-weight:600;font-size:14px;white-space:nowrap;">
            ${formatPriceKr(i.price * i.qty)} kr
          </td>
        </tr>`
    )
    .join("")

  return `
    <h1 style="margin:0 0 6px;font-size:22px;line-height:1.2;font-weight:800;letter-spacing:-0.01em;">
      ${intro || "Tack för din beställning!"}
    </h1>
    <p style="margin:0 0 24px;font-size:14px;color:#6B7280;">
      Ordernr: <strong style="color:#0A1628;">${escape(orderId)}</strong>
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${rows}
      <tr>
        <td style="padding:10px 0;color:#6B7280;font-size:13px;">Frakt</td>
        <td style="padding:10px 0;text-align:right;font-size:13px;">${shipping === 0 ? "Fri" : `${formatPriceKr(shipping)} kr`}</td>
      </tr>
      <tr>
        <td style="padding:14px 0 0;font-weight:800;font-size:16px;border-top:2px solid #0A1628;">Totalt (inkl. moms)</td>
        <td style="padding:14px 0 0;text-align:right;font-weight:800;font-size:16px;border-top:2px solid #0A1628;">${formatPriceKr(total)} kr</td>
      </tr>
    </table>

    ${
      customer?.address
        ? `<div style="margin-top:24px;padding:16px 18px;background:#F7F8FA;border-radius:10px;font-size:13px;line-height:1.6;">
            <div style="font-weight:700;margin-bottom:4px;color:#0A1628;">Leveransadress</div>
            ${escape(customer.name || "")}<br>
            ${escape(customer.address || "")}<br>
            ${escape(customer.postalCode || "")} ${escape(customer.city || "")}<br>
            ${customer.email ? `<span style="color:#6B7280;">${escape(customer.email)}</span>` : ""}
          </div>`
        : ""
    }

    <p style="margin-top:24px;font-size:14px;line-height:1.6;color:#374151;">
      Vi packar din order inom 1–3 arbetsdagar och skickar den till dig
      så snart som möjligt.
    </p>
  `
}

export async function POST(request) {
  const sig = request.headers.get("stripe-signature")
  const secret = process.env.STRIPE_WEBHOOK_SECRET

  if (!sig || !secret) {
    return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 })
  }

  const rawBody = await request.text()

  let event
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, secret)
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  if (event.type !== "payment_intent.succeeded") {
    return NextResponse.json({ received: true })
  }

  const pi = event.data.object

  try {
    const items = pi.metadata.items ? JSON.parse(pi.metadata.items) : []
    const subtotal = Number(pi.metadata.subtotal) || 0
    const shipping = Math.round((Number(pi.metadata.shipping) || 0) * 1.25) // visa frakt inkl. moms i kvittot
    const total = pi.amount / 100

    // Pull customer from charge billing_details (set by Stripe Elements)
    const charges = await stripe.charges.list({ payment_intent: pi.id, limit: 1 })
    const billing = charges.data[0]?.billing_details || {}
    const customer = {
      name: billing.name,
      email: billing.email || pi.receipt_email,
      phone: billing.phone,
      address: billing.address?.line1,
      postalCode: billing.address?.postal_code,
      city: billing.address?.city,
    }

    const orderId = pi.id.replace("pi_", "BP-").slice(0, 14).toUpperCase()
    const sends = []

    // Customer confirmation
    if (customer.email) {
      sends.push(
        resend.emails.send({
          from: FROM,
          to: customer.email,
          replyTo: ADMIN_EMAIL,
          subject: `Orderbekräftelse — Batteriproffs (${orderId})`,
          html: emailLayout({
            title: `Orderbekräftelse ${orderId}`,
            preheader: `Ordernr ${orderId} · ${formatPriceKr(total)} kr`,
            body: buildOrderBody({
              orderId,
              items,
              subtotal,
              shipping,
              total,
              customer,
            }),
          }),
        })
      )
    }

    // Admin notification
    if (ADMIN_EMAIL) {
      sends.push(
        resend.emails.send({
          from: FROM,
          to: ADMIN_EMAIL,
          replyTo: customer.email,
          subject: `Ny order ${formatPriceKr(total)} kr — ${customer.name || "kund"}`,
          html: emailLayout({
            title: `Ny order ${orderId}`,
            preheader: `${customer.name || "kund"} · ${formatPriceKr(total)} kr`,
            body: buildOrderBody({
              orderId,
              items,
              subtotal,
              shipping,
              total,
              customer,
              intro: `Ny order: ${customer.name || "kund"}`,
            }),
          }),
        })
      )
    }

    // Schedule review request (no-op if GOOGLE_REVIEW_URL inte är satt)
    if (customer.email) {
      sends.push(
        scheduleReviewEmail({
          to: customer.email,
          fullName: customer.name,
          orderId,
          replyTo: ADMIN_EMAIL,
        })
      )
    }

    await Promise.allSettled(sends)
  } catch (err) {
    console.error("Order email failed:", err)
  }

  return NextResponse.json({ received: true })
}
