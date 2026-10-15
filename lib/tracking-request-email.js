import { escape } from "./emails"
import { EMAIL } from "./constants"

export function trackingRequestEmail(orderId) {
  const subject = `Spårningsnummer för order ${orderId}`
  const body = `Hej!\n\nJag vill få spårningsnumret för order ${orderId} när leverantören har skickat den.\n\nTack!`
  const href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  return `
    <div style="margin-top:24px;padding:18px;background:#F7F8FA;border-radius:10px;">
      <h2 style="margin:0 0 8px;font-size:17px;color:#0A1628;">Vill du ha spårningsnumret?</h2>
      <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#374151;">
        Begär det via knappen nedan. Vi återkommer med numret från leverantören när din order har skickats.
      </p>
      <a href="${escape(href)}" style="display:inline-block;padding:12px 18px;background:#FDB813;color:#0A1628;text-decoration:none;font-weight:700;border-radius:8px;">Begär spårningsnummer</a>
      <p style="margin:12px 0 0;font-size:13px;line-height:1.6;color:#6B7280;">
        Knappen öppnar ett färdigt mejl med ditt ordernummer. Skicka mejlet för att begära spårningsnumret.
        Du kan också svara på det här mejlet och be om det.
      </p>
    </div>`
}
