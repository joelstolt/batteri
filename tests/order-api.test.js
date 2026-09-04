import { vi, it, expect, beforeEach } from "vitest"
const mock = vi.hoisted(() => ({ retrieve: vi.fn(), list: vi.fn() }))
vi.mock("stripe", () => ({
  default: class {
    paymentIntents = { retrieve: mock.retrieve }
    charges = { list: mock.list }
  },
}))
vi.mock("next/cache", () => ({ unstable_cache: (fn) => fn }))
import { GET } from "../app/api/order/route"
const pi = {
  id: "pi_fixture",
  client_secret: "fixture",
  amount: 299000,
  created: 1,
  metadata: {
    items: '[{"s":"nm125-6et","q":1,"p":2295}]',
    subtotal: "1836",
    shipping: "556",
    total_incl_vat: "2990",
    buyer_email: "test@example.invalid",
  },
  latest_charge: { billing_details: {} },
}
const req = (secret = "fixture") =>
  new Request(
    "https://test.invalid/api/order?payment_intent=pi_fixture&payment_intent_client_secret=" +
      secret
  )
beforeEach(() => {
  vi.clearAllMocks()
  mock.retrieve.mockResolvedValue({ ...pi, status: "requires_capture" })
  mock.list.mockResolvedValue({ data: [] })
})
it.each(["requires_capture", "succeeded"])(
  "returns complete normalized order for %s",
  async (status) => {
    mock.retrieve.mockResolvedValue({ ...pi, status })
    const response = await GET(req())
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.paymentStatus).toBe(status)
    expect(data.items[0]).toMatchObject({ qty: 1, price: 2295 })
    expect(data.items[0].name).toBeTruthy()
    expect(data.source).toBeUndefined()
  }
)
it.each(["canceled", "requires_payment_method", "processing"])(
  "does not confirm %s",
  async (status) => {
    mock.retrieve.mockResolvedValue({ ...pi, status })
    expect((await GET(req())).status).toBe(409)
  }
)
it("denies invalid secret and missing parameters", async () => {
  expect((await GET(req("wrong"))).status).toBe(403)
  expect(
    (await GET(new Request("https://test.invalid/api/order"))).status
  ).toBe(400)
})
it("returns retryable error on upstream failure", async () => {
  mock.retrieve.mockRejectedValue(new Error("timeout"))
  expect((await GET(req())).status).toBe(503)
})
