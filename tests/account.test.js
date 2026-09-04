import { vi, it, expect, beforeEach } from "vitest"
const m = vi.hoisted(() => ({ search: vi.fn(), identity: vi.fn() }))
vi.mock("stripe", () => ({
  default: class {
    paymentIntents = { search: m.search }
  },
}))
vi.mock("next/cache", () => ({ unstable_cache: (fn) => fn }))
vi.mock("@/lib/konto-auth", () => ({ inloggadEpost: m.identity }))
import { GET } from "../app/api/konto/ordrar/route"
const pi = (id, status, email) => ({
  id,
  status,
  amount: 299000,
  created: 1,
  metadata: { buyer_email: email, total_incl_vat: "2990" },
})
beforeEach(() => {
  vi.clearAllMocks()
  m.identity.mockReturnValue("buyer@example.invalid")
})
it("includes reserved orders but excludes unconfirmed and other customers even if search overmatches", async () => {
  m.search.mockResolvedValue({
    data: [
      pi("pi_paid", "succeeded", "buyer@example.invalid"),
      pi("pi_reserved", "requires_capture", "buyer@example.invalid"),
      pi("pi_foreign", "succeeded", "someone@example.invalid"),
      pi("pi_canceled", "canceled", "buyer@example.invalid"),
    ],
  })
  const response = await GET(
    new Request("https://test.invalid/api/konto/ordrar"),
  )
  const data = await response.json()
  expect(data.ordrar.map((o) => o.id)).toEqual(["pi_paid", "pi_reserved"])
  expect(data.ordrar[1].status).toBe("reserverad")
  expect(data.ordrar[0].source).toBeUndefined()
  expect(response.headers.get("cache-control")).toContain("no-store")
})
it("does not query order data without a signed session", async () => {
  m.identity.mockReturnValue(null)
  expect((await GET(new Request("https://test.invalid"))).status).toBe(401)
  expect(m.search).not.toHaveBeenCalled()
})
