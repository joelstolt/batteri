import { describe, it, expect } from "vitest"
import { serializeOrderItems, readOrderItems } from "../lib/order-items"
const rows = (n) =>
  Array.from({ length: n }, (_, i) => ({
    slug: `battery-${i}`,
    name: `Traktionsbatteri ${i} ` + "Ö".repeat(35),
    qty: 2,
    price: 2295,
  }))
describe("complete immutable orders", () => {
  it("round-trips multiple chunks without losing names, quantities or historic prices", () => {
    const input = rows(6)
    const meta = serializeOrderItems(input)
    expect(Number(meta.items_parts)).toBeGreaterThan(1)
    expect(Object.values(meta).every((v) => v.length <= 500)).toBe(true)
    expect(readOrderItems(meta).rader).toEqual(input)
    expect(readOrderItems(meta).incomplete).toBe(false)
  })
  it("rejects an order before charging if future metadata and rows cannot fit", () =>
    expect(() => serializeOrderItems(rows(50))).toThrow())
  it("detects a missing or corrupted chunk instead of treating it as a smaller order", () => {
    const meta = serializeOrderItems(rows(6))
    delete meta.items_2
    expect(readOrderItems(meta).incomplete).toBe(true)
    meta.items_2 = "bad"
    expect(readOrderItems(meta).incomplete).toBe(true)
  })
  it.each([
    [[{ name: "Historic", qty: 2, price: 123 }], null],
    [[{ s: "old", n: "Historic", q: 2, p: 123 }], "old"],
    [[{ s: "old", q: 2, p: 123 }], "old"],
  ])("reads legacy formats %j", (items, slug) => {
    const parsed = readOrderItems({ items: JSON.stringify(items) })
    expect(parsed.rader[0]).toMatchObject({ slug, qty: 2, price: 123 })
    expect(parsed.incomplete).toBe(false)
  })
  it("retains legacy omission information", () => {
    const r = readOrderItems({
      items: JSON.stringify([{ s: "old", q: 1, p: 20 }, { o: 3 }]),
    })
    expect(r.strukna).toBe(3)
    expect(r.incomplete).toBe(true)
  })
  it.each(["null", "{}", "[null]", "oops"])(
    "does not crash on corrupt old data %s",
    (raw) => expect(readOrderItems({ items: raw }).incomplete).toBe(true)
  )
  it("rejects new invalid quantities and non-integer ore amounts", () => {
    expect(() => serializeOrderItems([{ ...rows(1)[0], qty: 0 }])).toThrow()
    expect(() =>
      serializeOrderItems([{ ...rows(1)[0], price: 1.001 }])
    ).toThrow()
  })
})
