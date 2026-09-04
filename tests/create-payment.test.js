import { vi, it, expect, beforeEach } from "vitest"
import { readOrderItems } from "../lib/order-items"
const mock = vi.hoisted(() => ({
  create: vi.fn(),
  retrieve: vi.fn(),
  get: vi.fn(),
}))
vi.mock("stripe", () => ({
  default: class {
    paymentIntents = { create: mock.create, retrieve: mock.retrieve }
  },
}))
vi.mock("@/lib/products", () => ({ getProductBySlug: mock.get }))
vi.mock("@/lib/rate-limit", () => ({
  rateLimit: () => ({ ok: true }),
  clientIp: () => "",
  isOwnOrigin: () => true,
  ALLOWED_ORIGINS: [],
}))
import { POST } from "../app/api/create-payment-intent/route"
const request = (items) =>
  new Request("https://test.invalid/api/create-payment-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items, attemptId: "fixture-attempt-1234567890" }),
  })
beforeEach(() => {
  vi.clearAllMocks()
  mock.create.mockResolvedValue({ id: "pi_fixture" })
  mock.retrieve.mockResolvedValue({
    client_secret: "secret",
    status: "requires_payment_method",
  })
  mock.get.mockImplementation((slug) => ({
    slug,
    name: "Batteri " + slug,
    shortName: slug,
    price: 2295,
    images: [],
    inStock: true,
  }))
})
it("ignores client prices and returns the exact complete server quote", async () => {
  const res = await POST(request([{ slug: "a", qty: 2, price: 1 }]))
  expect(res.status).toBe(200)
  const data = await res.json()
  expect(data.quote.totalInclVat).toBe(5285)
  expect(mock.create.mock.calls[0][0].amount).toBe(528500)
  expect(mock.create.mock.calls[0][0].capture_method).toBe("manual")
  expect(
    readOrderItems(mock.create.mock.calls[0][0].metadata).rader[0].price
  ).toBe(2295)
})
it("combines repeated products and enforces their total quantity cap", async () => {
  await POST(
    request([
      { slug: "a", qty: 1 },
      { slug: "a", qty: 2 },
    ])
  )
  expect(
    readOrderItems(mock.create.mock.calls[0][0].metadata).rader
  ).toHaveLength(1)
  expect(
    (
      await POST(
        request([
          { slug: "a", qty: 99 },
          { slug: "a", qty: 1 },
        ])
      )
    ).status
  ).toBe(400)
  expect(mock.create).toHaveBeenCalledTimes(1)
})
it("rejects unavailable items before creating a payment", async () => {
  mock.get.mockReturnValue({ slug: "a", price: 100, inStock: false })
  expect((await POST(request([{ slug: "a", qty: 1 }]))).status).toBe(400)
  expect(mock.create).not.toHaveBeenCalled()
})
it("rejects over-capacity metadata before any payment request", async () => {
  const res = await POST(
    request(Array.from({ length: 50 }, (_, i) => ({ slug: "a-" + i, qty: 1 })))
  )
  expect(res.status).toBe(422)
  expect(mock.create).not.toHaveBeenCalled()
})
it("same attempts use the same key; changed orders have separate keys", async () => {
  await Promise.all([
    POST(request([{ slug: "a", qty: 1 }])),
    POST(request([{ slug: "a", qty: 1 }])),
  ])
  expect(mock.create.mock.calls[0][1]).toEqual(mock.create.mock.calls[1][1])
  await POST(request([{ slug: "a", qty: 2 }]))
  expect(mock.create.mock.calls[2][1]).not.toEqual(mock.create.mock.calls[0][1])
})
