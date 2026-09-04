import { it, expect } from "vitest"
import {
  serializeOrderItems,
  assertMetadataFits,
  readOrderItems,
} from "../lib/order-items"
import { buildOrderMetadata, EMPTY_FORM } from "../lib/checkout"
import { buildSourceMetadata } from "../lib/attribution"
it("reserves space for buyer, tracking, attribution, reminder and per-product review fields", () => {
  const rows = Array.from({ length: 6 }, (_, i) => ({
    slug: "a-" + i,
    name: "Traktionsbatteri " + i + " x".repeat(20),
    qty: 1,
    price: 2295,
  }))
  const metadata = {
    ...serializeOrderItems(rows),
    order_source: "batteriproffs.se",
    subtotal: "1",
    shipping: "1",
    total_incl_vat: "1",
    ...buildOrderMetadata(EMPTY_FORM),
    ...buildSourceMetadata({
      referrer: "example.com",
      landing: "/",
      gclid: "fixture",
      utmCampaign: "fixture",
    }),
    kontakt_epost: "1",
    kontakt_epost_at: "1",
    kontakt_namn: "1",
    kontakt_foretag: "1",
    paminnelse_1_at: "1",
    paminnelse_2_at: "1",
    paminnelse_avreg: "1",
    order_mail_customer: "1",
    order_mail_accounting: "1",
    order_mail_admin: "1",
    tracking: "1",
    carrier: "1",
    shipped_at: "1",
    review_email_at: "1",
    dold: "1",
    ...Object.fromEntries(rows.map((r) => ["review_" + r.slug, "fixture"])),
  }
  expect(() => assertMetadataFits(metadata)).not.toThrow()
  expect(Object.keys(metadata).length).toBeLessThanOrEqual(50)
})
it("handles corrupt legacy metadata types without breaking the order page", () => {
  expect(readOrderItems(null).incomplete).toBe(true)
  expect(readOrderItems({ items: '[{"n":{},"q":1,"p":2}]' }).incomplete).toBe(
    true
  )
})
