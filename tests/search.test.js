import { describe, expect, it } from "vitest"
import { sok, sokbar } from "../lib/search-index"

const titlar = (q, max) => sok(q, max).map((t) => t.titel)

describe("stavfelstolerans", () => {
  it("hittar Hako Scrubmaster trots dubbelt b", () => {
    const traffar = sok("hako scrubbmaster")
    expect(traffar.length).toBeGreaterThanOrEqual(4)
    expect(traffar.every((t) => !t.delvis)).toBe(true)
    expect(titlar("hako scrubbmaster", 20)).toEqual(
      expect.arrayContaining([
        "Hako Scrubmaster B12",
        "Hako Scrubmaster B30",
        "Hako Scrubmaster B45",
        "Hako Scrubmaster B120",
      ]),
    )
  })

  it("ger samma träffar för stavfelet som för rätt stavning", () => {
    expect(sok("scrubbmaster b120")).toEqual(sok("scrubmaster b120"))
    expect(sok("sonnenshein")).toEqual(sok("sonnenschein"))
  })

  it("tål en saknad bokstav i längre ord", () => {
    expect(sok("scrubmster")).toEqual(sok("scrubmaster"))
  })

  it("rättar aldrig modellnummer eller korta ord", () => {
    expect(sok("SC99999")).toEqual([])
    expect(sok("varta")).toEqual([])
    expect(sok("sc40")).toEqual(sok("sc40"))
  })
})

describe("delträffar när inte alla ord matchar", () => {
  it("visar Kärchers BR-maskiner för en modell som saknas", () => {
    const traffar = sok("kärcher br 55/60w", 12)
    expect(traffar.length).toBeGreaterThan(0)
    expect(traffar.every((t) => t.delvis)).toBe(true)
    const maskiner = traffar.filter((t) => t.typ === "maskin")
    expect(maskiner.length).toBeGreaterThan(0)
    // Kärcher + br slår Kärcher ensamt
    const forsta = traffar[0]
    expect(forsta.titel).toMatch(/^Kärcher BR /)
    const forstaBD = traffar.findIndex((t) => /^Kärcher BD /.test(t.titel))
    const sistaBR = traffar.map((t) => /^Kärcher BR /.test(t.titel)).lastIndexOf(true)
    if (forstaBD !== -1) expect(forstaBD).toBeGreaterThan(sistaBR)
  })

  it("rankar exakta träffar före delträffar och blandar inte", () => {
    const exakt = sok("kärcher br 55/40")
    expect(exakt.length).toBeGreaterThan(0)
    expect(exakt.every((t) => !t.delvis)).toBe(true)
    expect(exakt[0].titel).toBe("Kärcher BR 55/40")
  })

  it("ger delträffar på märket när modellen saknas", () => {
    const traffar = sok("nilfisk sc99999")
    expect(traffar.length).toBeGreaterThan(0)
    expect(traffar.every((t) => t.delvis)).toBe(true)
    expect(traffar[0].titel).toMatch(/^Nilfisk /)
  })

  it("låter ett kort ord ensamt inte räcka till en delträff", () => {
    expect(sok("br xyzqq")).toEqual([])
  })

  it("respekterar max", () => {
    expect(sok("kärcher br 55/60w", 2)).toHaveLength(2)
  })
})

describe("noll träffar", () => {
  it.each(["numatic", "varta", "SC99999", "xyzqq"])(
    "ger tom lista för %s",
    (q) => {
      expect(sok(q)).toEqual([])
    },
  )

  it("söker inte på för korta frågor", () => {
    expect(sok("a")).toEqual([])
    expect(sok("  ")).toEqual([])
    expect(sokbar("T-")).toBe(false)
  })
})

describe("befintligt beteende", () => {
  it("hittar maskin på delar av namnet med hopp emellan", () => {
    expect(titlar("hako b120")).toContain("Hako Scrubmaster B120")
  })

  it("exakta träffar saknar delvis-flagga", () => {
    for (const t of sok("nilfisk sc401")) expect(t.delvis).toBeUndefined()
  })
})
