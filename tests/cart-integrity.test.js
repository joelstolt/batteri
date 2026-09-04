import { it, expect } from "vitest"
import {
  removePurchased,
  validStoredCart,
  quoteHasChanged,
} from "../lib/cart-integrity"
const old = { slug: "a", qty: 2, lineId: "old", price: 100 }
it("clears only the confirmed purchase, retaining additions", () => {
  expect(
    removePurchased(
      [
        { ...old, qty: 3 },
        { slug: "b", qty: 1, lineId: "new" },
      ],
      [old],
      { items: [{ slug: "a", qty: 2 }] }
    )
  ).toEqual([
    { ...old, qty: 1 },
    { slug: "b", qty: 1, lineId: "new" },
  ])
})
it("does not erase a removed-and-readded product or an unassociated old order", () => {
  expect(
    removePurchased([{ ...old, lineId: "new" }], [old], {
      items: [{ slug: "a", qty: 2 }],
    })
  ).toEqual([{ ...old, lineId: "new" }])
  expect(
    removePurchased([old], [], { items: [{ slug: "a", qty: 2 }] })
  ).toEqual([old])
})
it("rejects malformed storage without crashing", () => {
  expect(validStoredCart({})).toEqual([])
  expect(
    validStoredCart([null, { slug: "a", qty: -1 }, { slug: "a", qty: 100 }])
  ).toEqual([])
})
it("detects different prices and shipping before confirmation", () => {
  expect(quoteHasChanged([old], { items: [{ ...old, price: 110 }] })).toBe(true)
  expect(quoteHasChanged([old], { items: [old] })).toBe(false)
})
