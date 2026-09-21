import { describe, expect, it } from "vitest"
import { JSDOM } from "jsdom"
import { publicProducts, getProductBySlug } from "../lib/products"
import { productIdentifiers, productTechnicalJsonLd } from "../lib/product-discovery"
import { buildProductJsonLd } from "../lib/product-schema"
import { GET as feed } from "../app/google-feed.xml/route"
import { GET as llms } from "../app/llms.txt/route"

describe("public product discovery", () => {
  it("keeps XML offers and page schema aligned for every published product", async () => {
    const xml = new JSDOM(await (await feed()).text(), { contentType: "text/xml" })
    const items = [...xml.window.document.querySelectorAll("item")]
    expect(items).toHaveLength(publicProducts.length)
    for (const item of items) {
      const field = (name, root = item) => root.getElementsByTagNameNS("http://base.google.com/ns/1.0", name)[0]?.textContent
      const product = getProductBySlug(field("id"))
      expect(product.hidden).not.toBe(true)
      const schema = buildProductJsonLd(product)
      expect(field("identifier_exists")).toBe("yes")
      expect(field("mpn")).toBe(schema.mpn)
      expect(field("brand")).toBe(schema.brand.name)
      expect(field("link")).toBe(schema.url)
      expect(field("image_link")).toBe(schema.image)
      expect(field("price")).toBe(`${schema.offers.price.toFixed(2)} SEK`)
      expect(field("availability")).toBe(schema.offers.availability.endsWith("/InStock") ? "in_stock" : "out_of_stock")
      expect(field("price", item.getElementsByTagNameNS("http://base.google.com/ns/1.0", "shipping")[0]))
        .toBe(`${schema.offers.shippingDetails.shippingRate.value.toFixed(2)} SEK`)
    }
    xml.window.close()
  })

  it("preserves the unavailable variant instead of declaring the entire catalogue in stock", () => {
    expect(buildProductJsonLd(getProductBySlug("nm875-8et")).offers.availability)
      .toBe("https://schema.org/OutOfStock")
  })

  it("keeps C5 and C20 capacities separate and preserves terminal suffixes", () => {
    const gel = buildProductJsonLd(getProductBySlug("gf-12-076v"))
    expect(gel.additionalProperty).toEqual(expect.arrayContaining([
      expect.objectContaining({ name: "Kapacitet (C5)", value: 76, unitText: "Ah" }),
      expect.objectContaining({ name: "Kapacitet (C20)", value: 86, unitText: "Ah" }),
      expect.objectContaining({ name: "Spänning", value: 12, unitText: "V" }),
      expect.objectContaining({ name: "Poltyp", value: "A-pol" }),
    ]))
    expect(buildProductJsonLd(getProductBySlug("ev31a-a-m8")).mpn).toBe("EV31A-A-M8")
  })

  it("does not invent a discharge basis for an unlabelled capacity", () => {
    const schema = productTechnicalJsonLd({ specs: { Kapacitet: "52 Ah" } })
    expect(schema.additionalProperty).toEqual([{ "@type": "PropertyValue", name: "Kapacitet", value: 52, unitText: "Ah" }])
  })

  it("preserves orientation of verified dimensions and omits unconfirmed total height", () => {
    const known = buildProductJsonLd(getProductBySlug("nm125-6et"))
    expect([known.depth.value, known.width.value, known.height.value]).toEqual([260, 180, 279])
    expect(known.height.unitCode).toBe("MMT")
    const uncertain = buildProductJsonLd(getProductBySlug("ev305a-a-am"))
    expect(uncertain.height).toBeUndefined()
    expect(uncertain.additionalProperty.some((p) => p.name === "Mått")).toBe(false)
    expect(uncertain.additionalProperty.find((p) => p.name === "Kontroll av utförande").value)
      .toContain("Totalhöjden behöver bekräftas")
  })

  it("does not turn approximate weights into exact values", () => {
    const schema = buildProductJsonLd(getProductBySlug("nm125-6et"))
    expect(schema.weight).toBeUndefined()
    expect(schema.additionalProperty).toContainEqual({ "@type": "PropertyValue", name: "Vikt", value: "ca 30 kg" })
  })

  it("never manufactures brand or MPN from a slug", () => {
    expect(productIdentifiers({ slug: "test-sku", specs: {} })).toEqual({ brand: null, mpn: null })
    const schema = buildProductJsonLd({ slug: "test-sku", price: 123, specs: {} })
    expect(schema.mpn).toBeUndefined()
    expect(schema.brand).toBeUndefined()
  })

  it("omits hidden products and never fabricates review ratings", () => {
    const product = publicProducts[0]
    expect(buildProductJsonLd({ ...product, hidden: true })).toBeNull()
    expect(buildProductJsonLd(product).aggregateRating).toBeUndefined()
    expect(buildProductJsonLd(product, { snitt: 4.3, antal: 3 }).aggregateRating)
      .toMatchObject({ ratingValue: 4.3, reviewCount: 3 })
  })

  it("publishes current return conditions and links to every public product", async () => {
    const response = llms()
    expect(response.headers.get("Content-Type")).toContain("text/plain")
    const text = await response.text()
    expect(text).not.toMatch(/öppet köp|retur.{0,10}30 dagar/i)
    expect(text).toContain("inom 14 dagar från leveransen och invänta skriftligt godkännande")
    expect(text).toContain("30 procent returavdrag")
    expect(text).toContain("695 kr inklusive moms")
    for (const product of publicProducts) {
      expect(text).toContain(`/produkt/${product.slug})`)
      expect(buildProductJsonLd(product).offers.hasMerchantReturnPolicy)
        .toMatchObject({ merchantReturnDays: 14, restockingFee: 30 })
    }
  })
})
