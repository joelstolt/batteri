export function trackingUrl(carrier, tracking) {
  if (!tracking || typeof tracking !== "string" || tracking.length > 200)
    return null
  switch (String(carrier).trim().toLowerCase()) {
    case "postnord":
      return `https://tracking.postnord.com/se/tracking?id=${encodeURIComponent(tracking)}`
    case "dhl":
      return `https://www.dhl.com/se-sv/home/tracking.html?tracking-id=${encodeURIComponent(tracking)}`
    default:
      return null
  }
}
export function detailsFromOrder(order) {
  const name = String(order.customer?.name || "")
    .trim()
    .split(/\s+/)
  return {
    companyName: order.company?.name || "",
    orgNr: order.company?.orgNr || "",
    vatNr: order.company?.vatNr || "",
    firstName: name.shift() || "",
    lastName: name.join(" "),
    email: order.customer?.email || "",
    phone: order.customer?.phone || "",
    invoiceEmail: order.company?.invoiceEmail || order.customer?.email || "",
    address: order.delivery?.line1 || "",
    postalCode: order.delivery?.postalCode || "",
    city: order.delivery?.city || "",
    deliveryPhone: order.delivery?.phone || "",
    unloading: order.delivery?.unloading || "",
    // Order-specific instructions and invoice addresses must be chosen again.
    reference: "",
    poNumber: "",
    goodsRecipient: "",
    doorCode: "",
    deliveryNote: "",
    invoiceSameAsDelivery: true,
    invoiceAddress: "",
    invoicePostalCode: "",
    invoiceCity: "",
  }
}
