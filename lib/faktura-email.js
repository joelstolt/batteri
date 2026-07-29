import { resend, FROM, ADMIN_EMAIL, escape, formatPriceKr, emailLayout } from "./emails"
import { BANKGIRO } from "./fakturor"
import { ADDRESS, SITE_NAME } from "./constants"

/**
 * Fakturaunderlaget som mejlas till kunden.
 *
 * Skickas i sajtens egen mall och inte via Stripes fakturautskick. Stripes mall
 * visar Stripes betalalternativ, och det är precis fel här: betalningen ska gå
 * till bankgiro, annars stämmer inte bokföringen.
 *
 * Fakturanumret är betalningsreferensen. Utan den går inbetalningen inte att
 * matcha mot rätt order när den dyker upp på kontot.
 */
function rad(text, belopp, fet = false) {
  const vikt = fet ? "700" : "400"
  const farg = fet ? "#0A1628" : "#374151"
  return `
    <tr>
      <td style="padding:7px 0;font-size:14px;color:${farg};font-weight:${vikt};">${escape(text)}</td>
      <td align="right" style="padding:7px 0;font-size:14px;color:${farg};font-weight:${vikt};white-space:nowrap;">${escape(formatPriceKr(belopp))} kr</td>
    </tr>`
}

export async function skickaFakturaMejl({ faktura, berakning, epost, foretag, referens }) {
  const forfaller = faktura.due_date
    ? new Date(faktura.due_date * 1000).toLocaleDateString("sv-SE", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : ""

  const body = `
    <h1 style="margin:0 0 6px;font-size:22px;font-weight:800;letter-spacing:-0.01em;">
      Fakturaunderlag ${escape(faktura.number || "")}
    </h1>
    <p style="margin:0 0 20px;font-size:14px;color:#6B7280;">
      ${escape(foretag || "")}${referens ? ` · Er referens: ${escape(referens)}` : ""}
    </p>

    <table role="presentation" width="100%" style="border-collapse:collapse;margin:0 0 6px;">
      ${berakning.poster.map((r) => rad(`${r.antal} × ${r.namn}`, r.radExkl)).join("")}
      ${berakning.fraktExkl > 0 ? rad("Frakt", berakning.fraktExkl) : ""}
    </table>
    <table role="presentation" width="100%" style="border-collapse:collapse;border-top:1px solid #E5E7EB;margin:0 0 24px;">
      ${rad("Netto exkl. moms", berakning.nettoExkl)}
      ${rad("Moms 25 %", berakning.moms)}
      ${rad("Att betala", berakning.totalInkl, true)}
    </table>

    <div style="margin:0 0 22px;padding:18px;background:linear-gradient(135deg,#FED66B,#FDB813);border-radius:12px;color:#0A1628;">
      <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;opacity:0.7;margin-bottom:8px;">
        Betala till bankgiro
      </div>
      <div style="font-family:ui-monospace,monospace;font-size:22px;font-weight:700;letter-spacing:0.5px;">
        ${escape(BANKGIRO)}
      </div>
      <div style="margin-top:10px;font-size:14px;">
        Belopp: <strong>${escape(formatPriceKr(berakning.totalInkl))} kr</strong><br>
        Ange <strong>${escape(faktura.number || "")}</strong> som meddelande${forfaller ? `<br>Betalas senast <strong>${escape(forfaller)}</strong>` : ""}
      </div>
    </div>

    <p style="margin:0 0 14px;font-size:14px;line-height:1.6;color:#374151;">
      <strong>Batteriet skickas när betalningen kommit in hos oss.</strong> Vi hör av
      oss med spårningsnummer så fort det är på väg. Normal leveranstid räknas från
      den dag betalningen registrerats, inte från beställningsdagen.
    </p>
    <p style="margin:0 0 14px;font-size:14px;line-height:1.6;color:#374151;">
      Kommer ingen betalning innan förfallodagen förfaller underlaget och ordern
      läggs ned. Inget debiteras och ingen påminnelse skickas.
    </p>

    <p style="margin:22px 0 0;font-size:13px;line-height:1.6;color:#6B7280;">
      ${escape(SITE_NAME)} · ${escape(ADDRESS.rad)}<br>
      Frågor om underlaget? Svara på det här mejlet.
    </p>
  `

  return resend.emails.send({
    from: FROM,
    to: epost,
    replyTo: ADMIN_EMAIL,
    subject: `Fakturaunderlag ${faktura.number || ""} — Batteriproffs`,
    html: emailLayout({
      title: `Fakturaunderlag ${faktura.number || ""}`,
      preheader: `Att betala: ${formatPriceKr(berakning.totalInkl)} kr till bankgiro ${BANKGIRO}`,
      body,
    }),
  })
}
