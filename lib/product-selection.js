import { publicProducts, getProductChemistry } from "./products"

const number = (s) => Number(String(s).replace(",", "."))
export function productAttributes(product) {
  const specs = product.specs || {}
  const capacity = {}
  for (const basis of ["C5", "C20"]) {
    const explicit = specs[`Kapacitet (${basis})`]?.match(
      /(\d+(?:[.,]\d+)?)\s*Ah/i,
    )
    const labelled = product.capacity?.match(
      new RegExp(`(\\d+(?:[.,]\\d+)?)\\s*Ah\\s*\\(${basis}\\)`, "i"),
    )
    if (explicit || labelled)
      capacity[basis] = number((explicit || labelled)[1])
  }
  const dims = specs.Mått?.match(
    /^(\d+(?:[.,]\d+)?)\s*[×x]\s*(\d+(?:[.,]\d+)?)\s*[×x]\s*(\d+(?:[.,]\d+)?)\s*mm$/i,
  )
  return {
    capacity,
    dimensions:
      dims && !product.totalHeightUnverified ? dims.slice(1).map(number) : null,
    chemistry: getProductChemistry(product),
  }
}

export function filterProducts(products, filters = {}) {
  const basis = filters.basis === "C5" ? "C5" : "C20"
  const minAh = number(filters.ah || 0)
  const maxAh = number(filters.ahmax || 0)
  return products
    .filter((p) => {
      const a = productAttributes(p)
      if (filters.volt && filters.volt !== "all" && p.voltage !== filters.volt)
        return false
      if (filters.kemi && a.chemistry !== filters.kemi) return false
      if (minAh > 0 && !(a.capacity[basis] >= minAh)) return false
      if (maxAh > 0 && !(a.capacity[basis] <= maxAh)) return false
      return ["langd", "bredd", "hojd"].every((key, i) => {
        const max = number(filters[key] || 0)
        return !(max > 0) || (a.dimensions && a.dimensions[i] <= max)
      })
    })
    .sort((a, b) => {
      if (filters.sort === "price-asc") return a.price - b.price
      if (filters.sort === "price-desc") return b.price - a.price
      if (filters.sort === "capacity")
        return (
          (productAttributes(b).capacity[basis] ?? -1) -
          (productAttributes(a).capacity[basis] ?? -1)
        )
      return Number(!!b.badge) - Number(!!a.badge)
    })
}

export function comparisonProducts(value = "") {
  return [...new Set(String(value).split(","))]
    .map((slug) => publicProducts.find((p) => p.slug === slug))
    .filter(Boolean)
    .slice(0, 3)
}

export function relatedProducts(product) {
  const a = productAttributes(product)
  return publicProducts
    .filter(
      (p) =>
        p.slug !== product.slug &&
        p.voltage === product.voltage &&
        getProductChemistry(p) === a.chemistry,
    )
    .sort((p, q) => {
      const distance = (x) => {
        const b = productAttributes(x)
        return a.dimensions && b.dimensions
          ? a.dimensions.reduce(
              (n, d, i) => n + Math.abs(d - b.dimensions[i]),
              0,
            )
          : Infinity
      }
      return distance(p) - distance(q) || p.price - q.price
    })
    .slice(0, 4)
}
