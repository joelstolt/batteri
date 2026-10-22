import { describe, expect, it } from "vitest"
import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"

/**
 * Klientkomponenter renderas först på servern (UTC hos Vercel) och sedan i
 * webbläsaren. Ett datum utan fast tidszon kan bli olika dag på de två
 * ställena. Då spricker hydreringen, React renderar om hela sidan och lämnar
 * serverns JSON-LD kvar, så Google ser produkten två gånger ("Dubblett av
 * fältet brand", Search Console 2026-10-22).
 */
function klientfiler(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name)
    if (e.isDirectory()) return klientfiler(p)
    if (!/\.(js|jsx)$/.test(e.name)) return []
    const kod = readFileSync(p, "utf8")
    return /^\s*["']use client["']/.test(kod) ? [[p, kod]] : []
  })
}

const DATUMFORMAT = /new Date\((?:[^()]|\([^()]*\))*\)\.toLocale(?:Date|Time)?String\(([^)]*)\)/g

describe("datum i klientkomponenter", () => {
  it("har alltid timeZone: Europe/Stockholm", () => {
    const utanZon = []
    for (const [fil, kod] of [...klientfiler("components"), ...klientfiler("app")]) {
      for (const m of kod.matchAll(DATUMFORMAT)) {
        if (!m[1].includes('timeZone: "Europe/Stockholm"')) utanZon.push(`${fil}: ${m[0].slice(0, 80)}`)
      }
    }
    expect(utanZon).toEqual([])
  })

  it("hittar formateringen den ska vakta", () => {
    const kod = readFileSync("components/ProductPageContent.jsx", "utf8")
    expect([...kod.matchAll(DATUMFORMAT)].length).toBeGreaterThan(0)
  })
})
