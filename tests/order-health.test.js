import { it, expect, vi } from "vitest"
import { orderHealth } from "../lib/order-health"
import { sok } from "../lib/search-index"
const now = Date.UTC(2026, 8, 5)
const pi = {
  created: now / 1000 - 600,
  status: "requires_capture",
  shipping: { address: { line1: "Gatan 1" } },
  metadata: {
    items_version: "2",
    items_parts: "1",
    items: '[{"s":"a","q":1,"p":10}]',
    buyer_email: "buyer@example.invalid",
    company_name: "Bolag AB",
  },
}
it("flags missing new mail receipts and actual reservation deadlines", () => {
  const warnings = orderHealth(
    {
      ...pi,
      latest_charge: {
        payment_method_details: { card: { capture_before: now / 1000 + 3600 } },
      },
    },
    now,
  )
  expect(warnings.some((w) => w.includes("kund"))).toBe(true)
  expect(warnings.some((w) => w.includes("sista debiteringstid"))).toBe(true)
})
it("does not assume old emails failed just because historic receipts are absent", () => {
  expect(
    orderHealth(
      {
        ...pi,
        status: "succeeded",
        metadata: { ...pi.metadata, items_version: undefined },
      },
      now,
    ).some((w) => w.includes("Mejlkvittens")),
  ).toBe(false)
})
it("recognizes common brand misspellings without fuzzy-matching machine numbers", () => {
  expect(sok("sonnenshein")).toEqual(sok("sonnenschein"))
  expect(sok("SC99999")).toEqual([])
})
it("withdraws the disputed Nilfisk recommendations from search prices", () => {
  for (const model of ["SC250", "SC401", "SC500"]) {
    const match = sok(model).find((p) => p.typ === "maskin")
    expect(match).toBeTruthy()
    expect(match.pris).toBeNull()
  }
})
