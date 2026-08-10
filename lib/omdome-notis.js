import { resend, FROM, ADMIN_EMAIL, escape, emailLayout } from "./emails"
import { SITE_URL } from "./constants"
import { publicProducts } from "./products"

/**
 * Notis till oss när en kund lämnat ett omdöme.
 *
 * Utan den här låg omdömet i status "väntar" tills någon råkade öppna
 * adminvyn. Eftersom ingenting publiceras oberett betyder det att ett omdöme
 * kunde bli osynligt hur länge som helst — kunden fick "tack, det granskas"
 * och sedan hände ingenting.
 *
 * Notisen är avsiktligt en återvändsgränd åt kunden till: den går bara till
 * oss, innehåller ingen åtgärdslänk som publicerar något, och adressen finns
 * med så vi kan ringa upp direkt när betyget är lågt.
 */

const NOTIS_TILL = process.env.REVIEW_NOTIFY_EMAIL || ADMIN_EMAIL

/**
 * Artikelnumret, inte det generiska namnet.
 *
 * `shortName` ger "Dry Cell 12V 120Ah", vilket flera artiklar i sortimentet
 * kan heta. `name` inleds med varumärke och artikelnummer ("Discover EV31A-A
 * – Dry Cell ...") och det är den delen som identifierar produkten entydigt
 * i en ämnesrad.
 */
function produktnamn(slug) {
  const p = publicProducts.find((x) => x.slug === slug)
  if (!p) return slug
  return p.name?.split("–")[0].trim() || p.shortName || slug
}

function stjarnor(betyg) {
  return "★".repeat(betyg) + "☆".repeat(Math.max(0, 5 - betyg))
}

export async function skickaOmdomeNotis({ betyg, text, namn, slug, orderId, epost }) {
  if (!NOTIS_TILL) return null

  const produkt = produktnamn(slug)
  // Ett lågt betyg är ett kundärende, inte en notis i mängden. Ämnesraden
  // säger det rakt ut så det syns i inkorgslistan utan att mejlet öppnas.
  const lagt = betyg <= 2
  const amne = lagt
    ? `Lågt omdöme: ${betyg} av 5 på ${produkt} - ring kunden`
    : `Nytt omdöme: ${betyg} av 5 på ${produkt}`

  const body = `
    <h1 style="margin:0 0 4px;font-size:22px;line-height:1.2;font-weight:800;letter-spacing:-0.01em;">
      ${escape(stjarnor(betyg))} ${betyg} av 5
    </h1>
    <p style="margin:0 0 20px;font-size:14px;color:#6B7280;">
      ${escape(produkt)} &middot; order ${escape(orderId || "-")}
    </p>
    ${
      text
        ? `<blockquote style="margin:0 0 20px;padding:14px 16px;background:#F7F8FA;border-left:3px solid #0B1D3A;border-radius:0 8px 8px 0;font-size:14px;line-height:1.6;color:#374151;">${escape(
            text
          )}</blockquote>`
        : `<p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#6B7280;">Kunden satte betyg utan att skriva någon text.</p>`
    }
    <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#374151;">
      Skrivet av: <strong style="color:#0A1628;">${escape(namn || "anonymt")}</strong><br>
      ${
        epost
          ? `Kontakt: <a href="mailto:${escape(epost)}" style="color:#0B1D3A;font-weight:600;text-decoration:none;">${escape(epost)}</a>`
          : ""
      }
    </p>
    ${
      lagt
        ? `<p style="margin:0 0 24px;padding:14px 16px;background:#FEF2F2;border-radius:8px;font-size:14px;line-height:1.6;color:#991B1B;">
             Ring kunden innan du beslutar om publicering. Ett löst problem får ofta
             ett uppdaterat omdöme, och ditt svar syns för alla som läser efteråt.
           </p>`
        : ""
    }
    <p style="margin:0 0 8px;text-align:center;">
      <a href="${SITE_URL}/admin" style="display:inline-block;background:#0B1D3A;color:#fff;text-decoration:none;padding:14px 28px;border-radius:10px;font-weight:700;font-size:14px;">
        Granska i admin &rarr;
      </a>
    </p>
    <p style="margin:0;font-size:13px;line-height:1.6;color:#6B7280;text-align:center;">
      Omdömet syns inte på sajten förrän du godkänt det.
    </p>
  `

  return resend.emails.send({
    from: FROM,
    to: NOTIS_TILL,
    replyTo: epost || undefined,
    subject: amne,
    html: emailLayout({
      title: amne,
      preheader: text ? String(text).slice(0, 90) : `${betyg} av 5 på ${produkt}`,
      body,
      internt: true,
    }),
  })
}
