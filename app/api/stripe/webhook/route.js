import { NextResponse } from "next/server"
import { revalidateTag, revalidatePath } from "next/cache"
import Stripe from "stripe"
import {
  resend,
  FROM,
  ADMIN_EMAIL,
  escape,
  formatPriceKr,
  emailLayout,
} from "@/lib/emails"
import { readOrderItems } from "@/lib/orders"
import { unloadingLabel } from "@/lib/checkout"
import { sendOrderMail } from "@/lib/order-mail"
import { SELJARE } from "@/lib/constants"

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

function buildOrderBody({
  orderId,
  items,
  shipping,
  total,
  customer,
  meta,
  intro,
  reserved = false,
  strukna = 0,
  incomplete = false,
}) {
  // Antal och artikelnummer visas ALLTID. Kvittot är det enda dokument som
  // följer med ordern, och utan dem går det inte att se vad som ska plockas.
  const rows = items
    .map(
      (i) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #F0F1F4;">
            <div style="font-weight:600;font-size:14px;">${escape(i.name)}</div>
            <div style="color:#6B7280;font-size:12px;">
              ${i.qty} st × ${formatPriceKr(i.price)} kr${i.slug ? ` · Art.nr ${escape(i.slug)}` : ""}
            </div>
          </td>
          <td style="padding:10px 0;border-bottom:1px solid #F0F1F4;text-align:right;font-weight:600;font-size:14px;white-space:nowrap;">
            ${formatPriceKr(i.price * i.qty)} kr
          </td>
        </tr>`
    )
    .join("")

  // Ryms inte alla rader i Stripes metadata lagras en {o:N}-markör. Säg det
  // rakt ut i stället för att tyst skicka ett kvitto som saknar rader.
  const struknaRad =
    strukna > 0 || incomplete
      ? `<tr><td colspan="2" style="padding:10px 0;border-bottom:1px solid #F0F1F4;font-size:13px;color:#B45309;">
           Orderunderlaget är ofullständigt. Kontakta oss så bekräftar vi alla artiklar i beställningen.
         </td></tr>`
      : ""

  return `
    <h1 style="margin:0 0 6px;font-size:22px;line-height:1.2;font-weight:800;letter-spacing:-0.01em;">
      ${intro || "Tack för din beställning!"}
    </h1>
    <p style="margin:0 0 24px;font-size:14px;color:#6B7280;">
      Ordernr: <strong style="color:#0A1628;">${escape(orderId)}</strong>
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${rows}
      ${struknaRad}
      <tr>
        <td style="padding:10px 0;color:#6B7280;font-size:13px;">Frakt</td>
        <td style="padding:10px 0;text-align:right;font-size:13px;">${shipping === 0 ? "Fri" : `${formatPriceKr(shipping)} kr`}</td>
      </tr>
      <tr>
        <td style="padding:12px 0 4px;color:#6B7280;font-size:13px;border-top:1px solid #E5E7EB;">Beskattningsunderlag</td>
        <td style="padding:12px 0 4px;text-align:right;font-size:13px;border-top:1px solid #E5E7EB;">${formatPriceKr(total / 1.25)} kr</td>
      </tr>
      <tr>
        <td style="padding:4px 0;color:#6B7280;font-size:13px;">Moms 25 %</td>
        <td style="padding:4px 0;text-align:right;font-size:13px;">${formatPriceKr(total - total / 1.25)} kr</td>
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
      // Ingen faktura skickas, betalningen är gjord med kort. Etiketten hette
      // "Faktura skickas till" och motsade därmed stycket längst ner i samma mejl.
      ["Kvitto till bokföringen", meta.invoice_email],
      [
        "Fakturaadress",
        meta.invoice_address === "samma som leverans"
          ? ""
          : meta.invoice_address,
      ],
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

    <div style="margin-top:20px;padding:16px 18px;background:#F7F8FA;border-radius:10px;font-size:13px;line-height:1.7;">
      <div style="font-weight:700;margin-bottom:6px;color:#0A1628;">Säljare</div>
      ${escape(SELJARE.namn)} (${escape(SELJARE.form)})<br>
      ${escape(SELJARE.adress)}<br>
      Org.nr ${escape(SELJARE.orgnr)}${SELJARE.momsnr ? ` · Momsreg.nr ${escape(SELJARE.momsnr)}` : ""}<br>
      <span style="color:#6B7280;">Godkänd för F-skatt</span>
    </div>

    <p style="margin-top:24px;font-size:14px;line-height:1.6;color:#374151;">
      ${reserved ? "Beloppet är reserverat på ditt kort och dras när ordern skickas. Det här mejlet bekräftar din beställning." : "Betalningen är genomförd. Det här mejlet är ditt kvitto."}
      Normal leveranstid är 1-3 arbetsdagar.
    </p>
  `
}

export async function POST(request) {
  const sig = request.headers.get("stripe-signature")
  const secret = process.env.STRIPE_WEBHOOK_SECRET

  if (!sig || !secret) {
    return NextResponse.json(
      { error: "Missing signature or secret" },
      { status: 400 }
    )
  }

  const rawBody = await request.text()

  let event
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, secret)
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  // Use the reservation event for manual capture and payment for automatic capture.
  const eventPi = event.data.object
  const manuell = eventPi?.capture_method === "manual"

  const rattHandelse = manuell
    ? event.type === "payment_intent.amount_capturable_updated"
    : event.type === "payment_intent.succeeded"

  if (!rattHandelse) {
    return NextResponse.json({ received: true })
  }

  try {
    const pi = await stripe.paymentIntents.retrieve(eventPi.id)
    // Metadatan lagrar raderna kompakt ({s,n,q,p}) för att rymmas i Stripes
    // teckengräns. readOrderItems är enda översättningen och används av /konto och
    // /admin. Läs ALDRIG i.name/i.qty/i.price rakt ur metadatan, de heter
    // n/q/p där och ger tomma rader i kvittot.
    const { rader: items, strukna, incomplete } = readOrderItems(pi.metadata)
    const shipping = Math.round((Number(pi.metadata.shipping) || 0) * 1.25) // visa frakt inkl. moms i kvittot
    const total = pi.amount / 100
    const meta = pi.metadata || {}

    // Leveransadressen ligger på Stripes shipping-fält (satt av /api/order-details).
    // Faller tillbaka på kortets billing_details för ordrar lagda före B2B-kassan.
    const charges = await stripe.charges.list({
      payment_intent: pi.id,
      limit: 1,
    })
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
    const reserved = manuell

    /*
     * Kvittot går till beställaren, med kundens ekonomiadress som kopia.
     *
     * invoice_email är obligatoriskt i kassan just för att bokföringen ska få
     * underlaget, men fram till 2026-08-04 skickades ingenting dit. Kunden
     * fyllde alltså i en adress som aldrig användes, och beställaren fick
     * vidarebefordra kvittot för hand.
     *
     * Bara när adressen skiljer sig från beställarens, annars får hon dubbelt.
     */
    const ekonomiKopia =
      meta.invoice_email &&
      meta.invoice_email.trim().toLowerCase() !==
        (customer.email || "").trim().toLowerCase()
        ? [meta.invoice_email.trim()]
        : undefined

    // Customer confirmation
    if (customer.email) {
      sends.push(() =>
        sendOrderMail({
          stripe,
          resend,
          paymentId: pi.id,
          role: "customer",
          message: {
            from: FROM,
            to: customer.email,
            replyTo: ADMIN_EMAIL,
            subject: `Orderbekräftelse - Batteriproffs (${orderId})`,
            html: emailLayout({
              title: `Orderbekräftelse ${orderId}`,
              preheader: `Ordernr ${orderId} · ${formatPriceKr(total)} kr`,
              body: buildOrderBody({
                orderId,
                items,
                strukna,
                reserved,
                incomplete,
                shipping,
                total,
                customer,
                meta,
              }),
            }),
          },
        })
      )
      if (ekonomiKopia)
        sends.push(() =>
          sendOrderMail({
            stripe,
            resend,
            paymentId: pi.id,
            role: "accounting",
            message: {
              from: FROM,
              to: ekonomiKopia[0],
              replyTo: ADMIN_EMAIL,
              subject: `Orderbekräftelse - Batteriproffs (${orderId})`,
              html: emailLayout({
                title: `Orderbekräftelse ${orderId}`,
                preheader: `Ordernr ${orderId}`,
                body: buildOrderBody({
                  orderId,
                  items,
                  strukna,
                  incomplete,
                  shipping,
                  total,
                  customer,
                  meta,
                  reserved,
                }),
              }),
            },
          })
        )
    } else {
      throw new Error("Order lacks customer email; reconcile before retry")
    }

    // Admin notification
    const companyLabel = meta.company_name || customer.name || "kund"
    if (ADMIN_EMAIL) {
      sends.push(() =>
        sendOrderMail({
          stripe,
          resend,
          paymentId: pi.id,
          role: "admin",
          message: {
            from: FROM,
            to: ADMIN_EMAIL,
            replyTo: customer.email,
            subject: `Ny order ${formatPriceKr(total)} kr - ${companyLabel}`,
            html: emailLayout({
              title: `Ny order ${orderId}`,
              preheader: `${companyLabel} · ${formatPriceKr(total)} kr`,
              body: buildOrderBody({
                orderId,
                items,
                strukna,
                reserved,
                incomplete,
                shipping,
                total,
                customer,
                meta,
                intro: `Ny order: ${companyLabel}`,
              }),
            }),
          },
        })
      )
    }

    // Startsidans "Senaste köp" läser en taggad cache — töm den så den nya
    // ordern syns direkt. Får aldrig fälla ordermejlen.
    try {
      revalidateTag("kop")
      revalidatePath("/")
      for (const rad of items)
        if (rad.slug) revalidatePath(`/produkt/${rad.slug}`)
    } catch (err) {
      console.error("Kunde inte revalidera senaste köp:", err)
    }

    // Omdömesmejlet schemaläggs INTE här längre. Det köas i /api/order/ship
    // när ordern faktiskt skickas — annars räknar det sju dygn från
    // orderläggningen och landar hos kunden innan pallgodset gjort det.

    const results = await Promise.allSettled(sends.map((send) => send()))
    const failure = results.find((r) => r.status === "rejected")
    if (failure) throw failure.reason
  } catch (err) {
    console.error("Order email failed:", err.message)
    return NextResponse.json(
      { error: "Order confirmation pending; retry required" },
      { status: 500 }
    )
  }

  return NextResponse.json({ received: true })
}
