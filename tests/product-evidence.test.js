import { describe, expect, it } from "vitest"
import { getProductBySlug, publicProducts } from "../lib/products"
import { evidenceFor } from "../lib/product-evidence"
import { filterProducts } from "../lib/product-selection"
import { machineBySlug } from "../lib/machines"
import { teknikFor } from "../lib/teknik"

describe("product and machine evidence regressions", () => {
  it("does not mix the NM875 ET article with the DC capacity and dimensions", () => {
    const product = getProductBySlug("nm875-8et")
    expect(product.capacity).toBe("170 Ah (C20)")
    expect(product.specs.Mått).toBe("260 × 180 × 279 mm")
    expect(product.inStock).toBe(false)
    expect(evidenceFor(product).note).toContain("NM875-8DC")
  })
  it("excludes unconfirmed total heights from physical size filters", () => {
    const product = getProductBySlug("ev305a-a-am")
    expect(filterProducts([product], { hojd: "350" })).toEqual([])
    expect(filterProducts([product], { volt: "6V" })).toEqual([product])
  })
  it("keeps the local Discover M8 variant and does not import another generation's weight", () => {
    const product = getProductBySlug("ev31a-a-m8")
    expect(product.specs.Mått).toBe("330 × 172 × 236 mm")
    expect(product.specs.Poltyp).toBe("Invändig gänga M8")
    expect(teknikFor(product).rader.some((r) => r.label === "Vikt")).toBe(false)
  })
  it("uses consistent GF-V weights in specifications and technical information", () => {
    const product = getProductBySlug("gf-12-105v")
    expect(product.specs.Vikt).toContain("38,7 kg")
    expect(teknikFor(product).rader.find((r) => r.label === "Vikt").value).toContain("38,7 kg")
    expect(product.description).not.toContain("40 kg")
  })
  it("does not attribute GF-V cycle life to GF-Y", () => {
    for (const slug of ["gf-12-052y", "gf-12-063y"]) {
      const product = getProductBySlug(slug)
      expect(product.specs.Cykellivslängd).toContain("450")
      expect(product.metaDescription).not.toContain("700 cykler")
    }
  })
  it("has an article-specific evidence entry for every public product", () => {
    for (const product of publicProducts) {
      expect(evidenceFor(product)?.documents.length).toBeGreaterThan(0)
      for (const doc of evidenceFor(product).documents) {
        expect(new URL(doc.url).protocol).toBe("https:")
      }
    }
  })
  it("keeps unconfirmed Nilfisk products out of verified machine results", () => {
    for (const model of ["nilfisk-sc250", "nilfisk-sc401", "nilfisk-sc500"]) {
      const machine = machineBySlug(model)
      expect(machine.products).toEqual([])
      expect(machine.compatibilityVerified).not.toBe(true)
      expect(machine.batteryEvidence.sources.length).toBeGreaterThan(0)
    }
  })
  it("limits the Tennant OEM match to the documented gel configuration and serial range", () => {
    const machine = machineBySlug("tennant-t3-t3-plus")
    expect(machine.products).toEqual(["gf-12-076v"])
    expect(machine.intro).toContain("20000")
    expect(machine.intro).toContain("gelutförandet")
    expect(machine.batteryEvidence.sources[0].url).toContain("9007692.pdf#page=85")
  })
})
