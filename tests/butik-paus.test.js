import { it, expect } from "vitest"
import { pausBeslut, BUTIKEN_PAUSAD } from "@/lib/butik-paus"
import { proxy } from "../proxy"

const req = (path) => ({ nextUrl: new URL("https://www.batteriproffs.se" + path) })

it("butiken är pausad", () => {
  expect(BUTIKEN_PAUSAD).toBe(true)
})

it("butikssidor visar pausidan", () => {
  for (const p of ["/", "/kassa", "/tack", "/produkt/ev31a-a-m8", "/kategori/traktion", "/kontakt", "/google-feed.xml", "/sitemap.xml", "/llms.txt"]) {
    expect(pausBeslut(p), p).toBe("sida")
  }
})

it("köp- och kontakt-API:er stängs", () => {
  for (const p of ["/api/create-payment-intent", "/api/kassa-kontakt", "/api/contact", "/api/order-details"]) {
    expect(pausBeslut(p), p).toBe("api")
  }
})

it("admin, webhook, konto och redan skickade mejllänkar är öppna", () => {
  for (const p of ["/admin", "/api/admin/fakturor", "/api/order/capture", "/api/order/ship", "/api/stripe/webhook", "/api/cron/veckorapport", "/konto", "/api/konto/ordrar", "/aterstall/abc", "/omdome", "/api/omdome", "/kassa-avreg/abc", "/villkor", "/integritet", "/robots.txt", "/icon.svg", "/produkter/x.webp", "/_next/data/x.json"]) {
    expect(pausBeslut(p), p).toBe("oppen")
  }
})

it("prefix matchar bara hela sökvägssteg", () => {
  expect(pausBeslut("/adminx")).toBe("sida")
  expect(pausBeslut("/api/orderx")).toBe("api")
})

it("av-läget släpper igenom allt", () => {
  expect(pausBeslut("/kassa", false)).toBe("oppen")
  expect(pausBeslut("/api/create-payment-intent", false)).toBe("oppen")
})

it("proxy svarar 503 med Retry-After på sidor och API", async () => {
  const sida = proxy(req("/kassa"))
  expect(sida.status).toBe(503)
  expect(sida.headers.get("retry-after")).toBe("86400")
  expect(sida.headers.get("content-type")).toContain("text/html")
  expect(await sida.text()).toContain("Under konstruktion")

  const api = proxy(req("/api/create-payment-intent"))
  expect(api.status).toBe(503)
  expect((await api.json()).error).toContain("tillfälligt stängd")

  expect(proxy(req("/api/stripe/webhook")).status).toBe(200)
})
