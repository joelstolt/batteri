import { productAttributes } from "./product-selection"
import { evidenceFor } from "./product-evidence"

// SKU är butikens eget ID. Det får aldrig användas som påhittat MPN.
export function productIdentifiers(product) {
  return {
    brand: product.specs?.Varumärke?.trim() || null,
    mpn: product.specs?.Artikelnummer?.trim() || null,
  }
}

const number = (value) => Number(value.replace(",", "."))
const quantity = (value, unitCode) => ({
  "@type": "QuantitativeValue",
  value,
  unitCode,
})

export function productTechnicalJsonLd(product) {
  const specs = product.specs || {}
  const { dimensions } = productAttributes(product)
  const evidence = evidenceFor(product)
  const exactWeight = specs.Vikt?.match(/^(\d+(?:[.,]\d+)?)\s*kg$/i)
  const properties = Object.entries(specs)
    .filter(([name, value]) => value && !["Varumärke", "Artikelnummer"].includes(name))
    .flatMap(([name, value]) => {
      // Obekräftad totalhöjd ska inte bli ett maskinläsbart passformslöfte.
      // Källans förklaring publiceras i stället nedan, precis som på sidan.
      if (name === "Mått" && product.totalHeightUnverified) return []
      if (name === "Mått" && dimensions) return []
      if (name === "Vikt" && exactWeight) return []
      const unit = name === "Spänning" ? "V" : /^Kapacitet/.test(name) ? "Ah" : null
      const numeric = unit && String(value).match(new RegExp(`^(\\d+(?:[.,]\\d+)?)\\s*${unit}$`, "i"))
      return [{
        "@type": "PropertyValue",
        name,
        value: numeric ? number(numeric[1]) : value,
        ...(numeric ? { unitText: unit } : {}),
      }]
    })

  if (evidence?.note) {
    properties.push({ "@type": "PropertyValue", name: "Kontroll av utförande", value: evidence.note })
  }

  return {
    additionalProperty: properties,
    ...(dimensions ? {
      depth: quantity(dimensions[0], "MMT"),
      width: quantity(dimensions[1], "MMT"),
      height: quantity(dimensions[2], "MMT"),
    } : {}),
    ...(exactWeight ? { weight: quantity(number(exactWeight[1]), "KGM") } : {}),
  }
}
