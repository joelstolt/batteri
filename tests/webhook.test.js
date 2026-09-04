import { vi, it, expect, beforeEach } from "vitest"
const mock = vi.hoisted(() => ({
  event: vi.fn(),
  retrieve: vi.fn(),
  send: vi.fn(),
}))
vi.mock("stripe", () => ({
  default: class {
    paymentIntents = { retrieve: mock.retrieve }
    webhooks = { constructEvent: mock.event }
    charges = { list: async () => ({ data: [] }) }
  },
}))
vi.mock("next/cache", () => ({
  revalidateTag: () => {},
  revalidatePath: () => {},
}))
vi.mock("@/lib/orders", () => ({
  readOrderItems: () => ({
    rader: [{ slug: "a", name: "Battery", qty: 1, price: 100 }],
    strukna: 0,
  }),
}))
vi.mock("@/lib/emails", () => ({
  resend: {},
  FROM: "test@example.invalid",
  ADMIN_EMAIL: "admin@example.invalid",
  escape: String,
  formatPriceKr: String,
  emailLayout: JSON.stringify,
}))
vi.mock("@/lib/order-mail", () => ({ sendOrderMail: mock.send }))
import { POST } from "../app/api/stripe/webhook/route"
const pi = {
  id: "pi_fixture",
  capture_method: "manual",
  amount: 10000,
  metadata: {
    buyer_email: "buyer@example.invalid",
    invoice_email: "accounting@example.invalid",
  },
}
const req = () =>
  new Request("https://test.invalid/api/stripe/webhook", {
    method: "POST",
    headers: { "stripe-signature": "fixture" },
    body: "fixture",
  })
beforeEach(() => {
  vi.clearAllMocks()
  process.env.STRIPE_WEBHOOK_SECRET = "fixture"
  mock.event.mockReturnValue({
    type: "payment_intent.amount_capturable_updated",
    data: { object: pi },
  })
  mock.retrieve.mockResolvedValue(pi)
  mock.send.mockResolvedValue("mail_fixture")
})
it("rejects invalid signatures without sending", async () => {
  mock.event.mockImplementation(() => {
    throw new Error("invalid")
  })
  expect((await POST(req())).status).toBe(400)
  expect(mock.send).not.toHaveBeenCalled()
})
it("returns a retryable error for partial delivery", async () => {
  mock.send.mockImplementation(async ({ role }) => {
    if (role === "admin") throw new Error("timeout")
  })
  expect((await POST(req())).status).toBe(500)
  expect(mock.send).toHaveBeenCalledTimes(3)
})
it("acknowledges only after all required recipients are handled", async () => {
  expect((await POST(req())).status).toBe(200)
  expect(mock.send.mock.calls.map((c) => c[0].role).sort()).toEqual([
    "accounting",
    "admin",
    "customer",
  ])
})
it("does not send a second confirmation when manual capture settles", async () => {
  mock.event.mockReturnValue({
    type: "payment_intent.succeeded",
    data: { object: pi },
  })
  expect((await POST(req())).status).toBe(200)
  expect(mock.send).not.toHaveBeenCalled()
})
