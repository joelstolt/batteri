import { publicProducts } from "./products"

export function quoteItems(raw) {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > 20)
    throw new Error("Välj mellan 1 och 20 artiklar för offerten.")
  const seen = new Set()
  return raw.map((row) => {
    const product = publicProducts.find((p) => p.slug === row?.slug)
    if (
      !product ||
      seen.has(product.slug) ||
      !Number.isInteger(row.qty) ||
      row.qty < 1 ||
      row.qty > 999
    )
      throw new Error(
        "Offerten innehåller en ogiltig artikel eller ett ogiltigt antal.",
      )
    seen.add(product.slug)
    return {
      slug: product.slug,
      name: product.name,
      article: product.specs.Artikelnummer || product.slug,
      qty: row.qty,
      price: product.price,
    }
  })
}
export function quoteText(raw) {
  const rows = quoteItems(raw)
  const total = rows.reduce((sum, row) => sum + row.qty * row.price, 0)
  return [
    "Offertförfrågan",
    ...rows.map(
      (row) =>
        `${row.qty} st ${row.article}: ${row.name} (${(row.price / 1.25).toLocaleString("sv-SE")} kr/st exkl. moms enligt aktuell prislista)`,
    ),
    `Summa enligt aktuell prislista: ${(total / 1.25).toLocaleString("sv-SE")} kr exkl. moms.`,
    "Frakt tillkommer. Detta är en förfrågan, inte en beställning eller en godkänd offert.",
  ].join("\n")
}
