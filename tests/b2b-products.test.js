import { it, expect } from "vitest"
import {
  filterProducts,
  productAttributes,
  comparisonProducts,
  relatedProducts,
} from "../lib/product-selection"
import { publicProducts, products } from "../lib/products"
import { quoteItems, quoteText } from "../lib/quote"
import { detailsFromOrder, trackingUrl } from "../lib/customer-tools"
const p = {
  slug: "a",
  voltage: "12V",
  capacity: "76 Ah (C5) / 83 Ah (C20)",
  specs: { Mått: "260 × 180 × 279 mm", Typ: "Gel" },
}
it("keeps C5 and C20 separate and excludes unknown capacities from numeric filters", () => {
  expect(productAttributes(p).capacity).toEqual({ C5: 76, C20: 83 })
  expect(filterProducts([p], { ah: "80", basis: "C5" })).toHaveLength(0)
  expect(filterProducts([p], { ah: "80", basis: "C20" })).toHaveLength(1)
  expect(
    filterProducts([{ ...p, capacity: "90 Ah" }], { ah: "80" }),
  ).toHaveLength(0)
})
it("requires all specified dimensions and never silently rotates a battery", () => {
  expect(
    filterProducts([p], { langd: "260", bredd: "180", hojd: "279" }),
  ).toHaveLength(1)
  expect(filterProducts([p], { langd: "180", bredd: "260" })).toHaveLength(0)
  expect(filterProducts([{ ...p, specs: {} }], { hojd: "1000" })).toHaveLength(
    0,
  )
})
it("limits comparison to three unique public catalogue products", () => {
  const hidden = products.find((p) => p.hidden)?.slug || "hidden"
  expect(
    comparisonProducts(
      [
        hidden,
        "missing",
        ...publicProducts.slice(0, 5).map((p) => p.slug),
        publicProducts[0].slug,
      ].join(","),
    ),
  ).toEqual(publicProducts.slice(0, 3))
})
it("related products retain chemistry and voltage without claiming compatibility", () => {
  for (const p of publicProducts)
    for (const q of relatedProducts(p)) {
      expect(q.slug).not.toBe(p.slug)
      expect(q.voltage).toBe(p.voltage)
      expect(productAttributes(q).chemistry).toBe(
        productAttributes(p).chemistry,
      )
    }
})
it.each([
  [],
  null,
  [{ slug: "missing", qty: 1 }],
  [{ slug: publicProducts[0].slug, qty: -1 }],
  [{ slug: publicProducts[0].slug, qty: 1.2 }],
  [{ slug: publicProducts[0].slug, qty: 1000 }],
  [
    { slug: publicProducts[0].slug, qty: 1 },
    { slug: publicProducts[0].slug, qty: 1 },
  ],
])("rejects invalid quote contents: %j", (rows) => {
  expect(() => quoteItems(rows)).toThrow()
})
it("quote ignores browser-supplied names and prices", () => {
  const rows = [
    { slug: publicProducts[0].slug, qty: 3, price: 1, name: "Injected item" },
  ]
  expect(quoteItems(rows)[0].price).toBe(publicProducts[0].price)
  expect(quoteText(rows)).not.toContain("Injected item")
  expect(quoteText(rows)).toContain("3 st")
})
it("prefills own order details without recycling purchase references or access codes", () => {
  const details = detailsFromOrder({
    customer: { name: "Anna Maria Svensson", email: "anna@example.invalid" },
    company: { name: "Bolag AB", poNumber: "OLD-PO" },
    delivery: { city: "Lund" },
  })
  expect(details).toMatchObject({
    firstName: "Anna",
    lastName: "Maria Svensson",
    city: "Lund",
    invoiceEmail: "anna@example.invalid",
    poNumber: "",
    doorCode: "",
  })
})
it("tracking accepts known carriers only and escapes arbitrary tracking text", () => {
  expect(trackingUrl("PostNord", "a&redirect=https://evil.invalid")).toContain(
    "a%26redirect%3Dhttps%3A%2F%2Fevil.invalid",
  )
  expect(trackingUrl("javascript:alert(1)", "a")).toBeNull()
})
it("respects capacity upper limits on the selected basis", () => {
  expect(
    filterProducts([p], { ah: "70", ahmax: "80", basis: "C5" }),
  ).toHaveLength(1)
  expect(
    filterProducts([p], { ah: "70", ahmax: "80", basis: "C20" }),
  ).toHaveLength(0)
})
