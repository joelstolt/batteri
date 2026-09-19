import { getProductChemistry } from "./products"

export function normalizeQuantity(value) {
  const number = Number(value)
  return Number.isFinite(number) ? Math.max(1, Math.min(99, Math.trunc(number))) : 1
}

// The quote is for the selected product and quantity, not the existing cart.
export function purchaseTotals(product, value) {
  const quantity = normalizeQuantity(value)
  const subtotal = product.price * quantity
  const shipping = product.freeShipping ? 0 : 695
  return { quantity, subtotal, shipping, total: subtotal + shipping }
}

export function productSeoType(product) {
  const chemistry = getProductChemistry(product)
  const application = {
    "traktion-industri": "traktion",
    stadmaskiner: "städmaskin",
    stationara: "UPS",
    "fritid-solenergi": "fritid",
  }[product.category]
  return [chemistry, application].filter(Boolean).join(" ")
}

// Tennant 9007692, PDF page 85, row 1: 994200 (20000-),
// Battery, Gel, 12vdc 0076ah [Gf12076v], Qty 2. Checked 2026-09-19.
const TENNANT_GEL_PACKAGE = {
  machineSlug: "tennant-t3-t3-plus",
  productSlug: "gf-12-076v",
  quantity: 2,
  serialFrom: 20000,
  variant: "gel-12v-76ah",
  checkedAt: "2026-09-19",
  source: "https://www.tennantco.com/content/dam/tennant/tennantco/products/machines/scrubber%20walk-behinds/T3/operator-parts-manual/9007692.pdf#page=85",
}

export function verifiedBatteryPackage(machine, product) {
  if (
    machine?.slug !== TENNANT_GEL_PACKAGE.machineSlug ||
    machine.compatibilityVerified !== true ||
    product?.slug !== TENNANT_GEL_PACKAGE.productSlug ||
    !machine.products?.includes(product.slug)
  ) return null
  return TENNANT_GEL_PACKAGE
}
