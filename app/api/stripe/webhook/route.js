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
import { unloadingLabel } from "@/lib/checkout"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const runtime = "nodejs"

/** Liten definitionslista — används för företags- och leveransblocken. */
function infoBlock(title, rows) {
  const visible = rows.filter(([, v]) => v)
  if (visible.length === 0) return ""
  return `
    <div style="margin-top:20px;padding:16px 18px;background:#F7F8FA;border-radius:10px;font-size:13px;line-height:1.7;">
      <div style="font-weight:700;margin-bottom:6px;color:#0A1628;">${escape(title)}</div>
      ${visible
        .map(
          ([k, v]) =>
            `<div><span style="color:#6B7280;">${escape(k)}:</span> ${escape(v)}</div>`
        )
        .join("")}
    </div>`
}

function buildOrderBody({ orderId, items, subtotal, shipping, total, customer, meta, intro }) {
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

    ${infoBlock("Företagsuppgifter", [
      ["Företag", meta.company_name],
      ["Organisationsnummer", meta.org_nr],
      ["Momsreg.nr", meta.vat_nr],
      ["Er referens", meta.reference],
      ["Inköpsordernr", meta.po_number],
      ["Faktura skickas till", meta.invoice_email],
      ["Fakturaadress", meta.invoice_address === "samma som leverans" ? "" : meta.invoice_address],
    ])}

    ${
      customer?.address
        ? `<div style="margin-top:20px;padding:16px 18px;background:#F7F8FA;border-radius:10px;font-size:13px;line-height:1.7;">
            <div style="font-weight:700;margin-bottom:6px;color:#0A1628;">Leveransadress</div>
            ${escape(customer.name || "")}<br>
            ${escape(customer.address || "")}<br>
            ${escape(customer.postalCode || "")} ${escape(customer.city || "")}
            ${meta.door_code ? `<br><span style="color:#6B7280;">Portkod ${escape(meta.door_code)}</span>` : ""}
            ${meta.delivery_phone ? `<br><span style="color:#6B7280;">Godsmottagning ${escape(meta.delivery_phone)}</span>` : ""}
          </div>`
        : ""
    }

    ${infoBlock("Leverans", [
      ["Lossning", unloadingLabel(meta.unloading)],
      ["Instruktioner", meta.delivery_note],
      ["Beställare", meta.buyer_name],
      ["Beställarens telefon", meta.buyer_phone],
    ])}

    <p style="margin-top:24px;font-size:14px;line-height:1.6;color:#374151;">
      Vi skickar ordern så snart som möjligt, normalt inom 1–3 arbetsdagar.
      Fakturan skickas separat till ${meta.invoice_email ? escape(meta.invoice_email) : "er fakturaadress"}.
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

  /**
   * Orderbekräftelsen ska gå ut när KUNDEN BETALAR, inte när vi drar pengarna.
   *
   * Med manuell capture är det två skilda ögonblick. Reservationen lyckas direkt
   * i kassan och ger `payment_intent.amount_capturable_updated`. Först när vi
   * skickar batteriet görs dragningen, och då kommer `payment_intent.succeeded`.
   *
   * Lyssnade vi bara på succeeded, som förut, hade kunden inte fått någon
   * orderbekräftelse förrän paketet gick iväg. Lyssnar vi på båda utan att
   * skilja dem åt får hon två.
   *
   * Därför: manuella betalningar hanteras på reservationen, automatiska på
   * dragningen. Exakt en bekräftelse per order, oavsett läge.
   */
  const pi = event.data.object
  const manuell = pi?.capture_method === "manual"

  const rattHandelse = manuell
    ? event.type === "payment_intent.amount_capturable_updated"
    : event.type === "payment_intent.succeeded"

  if (!rattHandelse) {
    return NextResponse.json({ received: true })
  }

  try {
    const items = pi.metadata.items ? JSON.parse(pi.metadata.items) : []
    const subtotal = Number(pi.metadata.subtotal) || 0
    const shipping = Math.round((Number(pi.metadata.shipping) || 0) * 1.25) // visa frakt inkl. moms i kvittot
    const total = pi.amount / 100
    const meta = pi.metadata || {}

    // Leveransadressen ligger på Stripes shipping-fält (satt av /api/order-details).
    // Faller tillbaka på kortets billing_details för ordrar lagda före B2B-kassan.
    const charges = await stripe.charges.list({ payment_intent: pi.id, limit: 1 })
    const billing = charges.data[0]?.billing_details || {}
    const ship = pi.shipping || {}
    const customer = {
      name: ship.name || meta.company_name || billing.name,
      email: meta.buyer_email || billing.email || pi.receipt_email,
      phone: meta.buyer_phone || ship.phone || billing.phone,
      address: ship.address?.line1 || billing.address?.line1,
      postalCode: ship.address?.postal_code || billing.address?.postal_code,
      city: ship.address?.city || billing.address?.city,
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
              meta,
            }),
          }),
        })
      )
    }

    // Admin notification
    const companyLabel = meta.company_name || customer.name || "kund"
    if (ADMIN_EMAIL) {
      sends.push(
        resend.emails.send({
          from: FROM,
          to: ADMIN_EMAIL,
          replyTo: customer.email,
          subject: `Ny order ${formatPriceKr(total)} kr — ${companyLabel}`,
          html: emailLayout({
            title: `Ny order ${orderId}`,
            preheader: `${companyLabel} · ${formatPriceKr(total)} kr`,
            body: buildOrderBody({
              orderId,
              items,
              subtotal,
              shipping,
              total,
              customer,
              meta,
              intro: `Ny order: ${companyLabel}`,
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
          // Beställarens namn, inte företagsnamnet — mejlet inleds med "Hej X"
          fullName: meta.buyer_name || billing.name,
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
