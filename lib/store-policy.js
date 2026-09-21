// Publicerade uppgifter enligt /villkor. Belopp är inklusive moms.
// Detta styr presentation och produktdata, inte betalningsberäkningen.
export const STANDARD_SHIPPING_INCL_VAT = 695
export const RETURN_WINDOW_DAYS = 14
export const RETURN_RESTOCKING_FEE_PERCENT = 30
export const DELIVERY_ESTIMATE = "1-3 arbetsdagar"

export function productShippingInclVat(product) {
  return product.freeShipping ? 0 : STANDARD_SHIPPING_INCL_VAT
}
