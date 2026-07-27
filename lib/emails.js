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

export function emailLayout({ title, body, preheader = "" }) {
  return `<!doctype html>
<html lang="sv">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escape(title)}</title>
</head>
<body style="margin:0;padding:0;background:#F7F8FA;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#0A1628;">
<div style="display:none;max-height:0;overflow:hidden;">${escape(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F7F8FA;padding:24px 12px;">
  <tr><td align="center">
    <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#fff;border-radius:14px;overflow:hidden;border:1px solid #E5E7EB;">
      <tr><td style="background:#0B1D3A;padding:20px 24px;">
        <table role="presentation" width="100%"><tr>
          <td style="font-family:system-ui,sans-serif;font-size:18px;font-weight:800;color:#fff;letter-spacing:-0.01em;">
            <span style="display:inline-block;width:26px;height:26px;background:linear-gradient(135deg,#FED66B,#FDB813);border-radius:6px;text-align:center;line-height:26px;color:#0A1628;font-size:14px;vertical-align:-7px;margin-right:8px;">⚡</span>
            Batteri<span style="color:#FDB813;">proffs</span>
          </td>
          <td align="right" style="font-size:12px;color:rgba(255,255,255,0.5);">www.batteriproffs.se</td>
        </tr></table>
      </td></tr>
      <tr><td style="padding:28px 28px 8px;">${body}</td></tr>
      <tr><td style="padding:24px 28px 28px;border-top:1px solid #F0F1F4;color:#9AA0A6;font-size:12px;line-height:1.6;">
        Frågor? Svara på det här mejlet eller ring oss på <a href="tel:+46735546968" style="color:#0B1D3A;text-decoration:none;">073-554 69 68</a>.<br>
        Batteriproffs · info@batteriproffs.se · Mån–Fre 08:00–17:00
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`
}
