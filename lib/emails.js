import { Resend } from "resend"

export const resend = new Resend(process.env.RESEND_API_KEY)

export const FROM =
  process.env.EMAIL_FROM || "Batteriproffs <noreply@batteriproffs.se>"
export const ADMIN_EMAIL = process.env.CONTACT_TO_EMAIL

export function escape(s = "") {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    // Citattecken måste med — värdet används inuti attribut som href="mailto:…",
    // och utan de här kan inskickad text bryta sig ur attributet.
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

export function formatPriceKr(amount) {
  return new Intl.NumberFormat("sv-SE").format(Math.round(amount))
}

/**
 * `internt: true` tar bort kundfooterns "ring oss"-block. Interna notiser går
 * till oss själva, och en uppmaning att ringa vårt eget nummer läser som att
 * mejlet skickats till fel mottagare.
 */
export function emailLayout({ title, body, preheader = "", internt = false }) {
  return `<!doctype html>
<html lang="sv">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>${escape(title)}</title>
<style>
  /*
   * Mörkt läge i Gmail och Outlook.
   *
   * Utan de här raderna inverterar Gmail på mobilen headern åt oss: den
   * marinblå listen blev ljuslila och den vita loggan blev mörkblå, uppmätt
   * 2026-09-03. Två saker behövs. color-scheme-taggarna säger att mejlet
   * sköter mörkt läge själv, vilket stoppar tvångsinverteringen i Apple Mail
   * och nyare Gmail. Media-frågan sätter tillbaka färgerna i de klienter som
   * inverterar ändå, och [data-ogsc] är Outlooks motsvarighet.
   *
   * Headern är redan mörk, så i mörkt läge ska den stå still. Det är
   * inverteringen som är felet, inte färgvalet.
   */
  :root { color-scheme: light dark; supported-color-schemes: light dark; }
  @media (prefers-color-scheme: dark) {
    .bp-header { background: #0B1D3A !important; }
    .bp-logo, .bp-logo * { color: #ffffff !important; }
    .bp-logo .bp-accent { color: #FDB813 !important; }
    .bp-domain { color: #8A93A6 !important; }
    .bp-kort { background: #14203A !important; border-color: #24314F !important; }
    .bp-body, .bp-body * { color: #E8EAEE !important; }
    .bp-body a { color: #FDB813 !important; }
    .bp-ram { background: #0A1220 !important; }
    .bp-fot, .bp-fot * { color: #9AA0A6 !important; border-color: #24314F !important; }
  }
  [data-ogsc] .bp-header { background: #0B1D3A !important; }
  [data-ogsc] .bp-logo, [data-ogsc] .bp-logo * { color: #ffffff !important; }
  [data-ogsc] .bp-logo .bp-accent { color: #FDB813 !important; }
</style>
</head>
<body style="margin:0;padding:0;background:#F7F8FA;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#0A1628;">
<div style="display:none;max-height:0;overflow:hidden;">${escape(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="bp-ram" style="background:#F7F8FA;padding:24px 12px;">
  <tr><td align="center">
    <table role="presentation" width="560" cellpadding="0" cellspacing="0" class="bp-kort" style="max-width:560px;width:100%;background:#fff;border-radius:14px;overflow:hidden;border:1px solid #E5E7EB;">
      <tr><td class="bp-header" style="background:#0B1D3A;padding:20px 24px;">
        <table role="presentation" width="100%"><tr>
          <td class="bp-logo" style="font-family:system-ui,sans-serif;font-size:18px;font-weight:800;color:#ffffff;letter-spacing:-0.01em;">
            <span style="display:inline-block;width:26px;height:26px;background:#FDB813;border-radius:6px;text-align:center;line-height:26px;color:#0A1628;font-size:14px;vertical-align:-7px;margin-right:8px;">&#9889;</span>
            Batteri<span class="bp-accent" style="color:#FDB813;">proffs</span>
          </td>
          <td align="right" class="bp-domain" style="font-size:12px;color:#8A93A6;">www.batteriproffs.se</td>
        </tr></table>
      </td></tr>
      <tr><td class="bp-body" style="padding:28px 28px 8px;">${body}</td></tr>
      ${
        internt
          ? ""
          : `<tr><td class="bp-fot" style="padding:24px 28px 28px;border-top:1px solid #F0F1F4;color:#9AA0A6;font-size:12px;line-height:1.6;">
        Frågor? Svara på det här mejlet, eller chatta med oss på <a href="https://www.batteriproffs.se" style="color:#0B1D3A;text-decoration:none;">batteriproffs.se</a>.<br>
        Batteriproffs · info@batteriproffs.se · Mån till fre 08:00 till 17:00
      </td></tr>`
      }
    </table>
  </td></tr>
</table>
</body></html>`
}
