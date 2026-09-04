import { readOrderItems } from "./order-items"

export function orderHealth(pi, now = Date.now()) {
  const warnings = []
  const meta = pi.metadata || {}
  const items = readOrderItems(meta)
  if (items.incomplete || items.strukna > 0 || items.rader.length === 0)
    warnings.push(
      "Ordern saknar kompletta artikelrader. Stäm av före leverans.",
    )
  if (!meta.buyer_email || !meta.company_name || !pi.shipping?.address?.line1)
    warnings.push(
      "Kontrollera köparens företags-, kontakt- och leveransuppgifter.",
    )
  // Legacy mail did not store receipts. Missing legacy receipts do not prove failure.
  if (meta.items_version === "2" && now / 1000 - pi.created > 300) {
    for (const [role, label] of [
      ["customer", "kund"],
      ["admin", "intern ordermottagare"],
    ]) {
      let receipt
      try {
        receipt = JSON.parse(meta[`order_mail_${role}`] || "null")
      } catch {}
      if (!receipt?.sent)
        warnings.push(
          `Mejlkvittens saknas för ${label}. Kontrollera Resend innan ett nytt utskick.`,
        )
    }
    if (
      meta.invoice_email &&
      meta.invoice_email.toLowerCase() !== meta.buyer_email?.toLowerCase()
    ) {
      let receipt
      try {
        receipt = JSON.parse(meta.order_mail_accounting || "null")
      } catch {}
      if (!receipt?.sent)
        warnings.push(
          "Mejlkvittens saknas för bokföringsadressen. Kontrollera Resend.",
        )
    }
  }
  if (pi.status === "requires_capture") {
    const deadline =
      typeof pi.latest_charge === "object"
        ? pi.latest_charge?.payment_method_details?.card?.capture_before
        : null
    if (deadline && deadline * 1000 - now <= 48 * 60 * 60 * 1000)
      warnings.push(
        `Kortreservationens sista debiteringstid: ${new Date(deadline * 1000).toLocaleString("sv-SE", { timeZone: "Europe/Stockholm" })}. Stäm av leveransen.`,
      )
    else if (!deadline && now / 1000 - pi.created > 4 * 86400)
      warnings.push(
        "Reservationen är äldre än fyra dygn och exakt sluttid saknas i svaret. Kontrollera den i Stripe.",
      )
  }
  return warnings
}
