import { NextResponse } from "next/server"
import Stripe from "stripe"
import { Resend } from "resend"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const resend = new Resend(process.env.RESEND_API_KEY)

const FROM =
  process.env.ORDER_FROM_EMAIL || "Batteriproffs <noreply@batteriproffs.se>"
const ADMIN_TO = process.env.CONTACT_TO_EMAIL

export const runtime = "nodejs"

function escape(s = "") {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

function formatPrice(öre) {
  return new Intl.NumberFormat("sv-SE").format(Math.round(öre / 100))
}

function buildOrderHtml({ orderId, items, subtotal, shipping, total, customer }) {
  const rows = items
    .map(
      (i) => `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #EEE;">
            <div style="font-weight:600;">${escape(i.name)}</div>
            ${i.qty > 1 ? `<div style="color:#666;font-size:12px;">${i.qty} st</div>` : ""}
          </td>
          <td style="padding:8px 12px;border-bottom:1px solid #EEE;text-align:right;white-space:nowrap;">
            ${formatPrice(i.price * i.qty * 100)} kr
          </td>
        </tr>`
    )
    .join("")

  return `
    <div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#0A1628;">
      <h2 style="margin:0 0 8px;">Tack för din beställning!</h2>
      <p style="margin:0 0 24px;color:#666;">Ordernr: <strong>${escape(orderId)}</strong></p>

      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        ${rows}
        <tr><td style="padding:8px 12px;color:#666;">Frakt</td><td style="padding:8px 12px;text-align:right;">${shipping === 0 ? "Fri" : `${formatPrice(shipping * 100)} kr`}</td></tr>
        <tr><td style="padding:12px;font-weight:700;border-top:2px solid #0A1628;">Totalt (inkl. moms)</td><td style="padding:12px;text-align:right;font-weight:700;border-top:2px solid #0A1628;">${formatPrice(total)} kr</td></tr>
      </table>

      ${
        customer
          ? `<div style="margin-top:24px;padding:16px;background:#F7F8FA;border-radius:8px;font-size:13px;line-height:1.5;">
              <div style="font-weight:600;margin-bottom:6px;">Leveransadress</div>
              ${escape(customer.name || "")}<br/>
              ${escape(customer.address || "")}<br/>
              ${escape(customer.postalCode || "")} ${escape(customer.city || "")}<br/>
              ${escape(customer.email || "")}
            </div>`
          : ""
      }

      <p style="margin-top:24px;font-size:13px;color:#666;">
        Vi packar din order inom 1–3 arbetsdagar. Frågor? Svara på det här mejlet eller ring oss.
      </p>
    </div>
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
    const shipping = Number(pi.metadata.shipping) || 0
    const customerEmail =
      pi.receipt_email ||
      pi.charges?.data?.[0]?.billing_details?.email ||
      pi.metadata.email
    const customer = {
      name: pi.metadata.customerName,
      address: pi.metadata.address,
      postalCode: pi.metadata.postalCode,
      city: pi.metadata.city,
      email: customerEmail,
    }

    const html = buildOrderHtml({
      orderId: pi.id,
      items,
      subtotal,
      shipping,
      total: pi.amount,
      customer,
    })

    const sends = []

    if (customerEmail) {
      sends.push(
        resend.emails.send({
          from: FROM,
          to: customerEmail,
          subject: `Orderbekräftelse — Batteriproffs (#${pi.id.slice(-8)})`,
          html,
        })
      )
    }

    if (ADMIN_TO) {
      sends.push(
        resend.emails.send({
          from: FROM,
          to: ADMIN_TO,
          subject: `Ny order ${formatPrice(pi.amount)} kr — ${customer.name || "okänd"}`,
          html,
        })
      )
    }

    await Promise.all(sends)
  } catch (err) {
    console.error("Order email failed:", err)
  }

  return NextResponse.json({ received: true })
}
