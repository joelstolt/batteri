import { vi, it, expect, beforeEach } from "vitest"
const m = vi.hoisted(() => ({
  retrieve: vi.fn(),
  capture: vi.fn(),
  update: vi.fn(),
  list: vi.fn(),
  send: vi.fn(),
  review: vi.fn(),
  admin: vi.fn(),
}))
vi.mock("stripe", () => ({
  default: class {
    paymentIntents = {
      retrieve: m.retrieve,
      capture: m.capture,
      update: m.update,
    }
    charges = { list: m.list }
  },
}))
vi.mock("@/lib/emails", () => ({
  resend: { emails: { send: m.send } },
  FROM: "sender@example.invalid",
  ADMIN_EMAIL: "admin@example.invalid",
  escape: (s) => String(s),
  emailLayout: (x) => x.body,
}))
vi.mock("@/lib/admin-auth", () => ({ kravAdmin: m.admin }))
vi.mock("@/lib/review-email", () => ({ scheduleReviewEmail: m.review }))
vi.mock("next/cache", () => ({ unstable_cache: (fn) => fn }))
import { POST } from "../app/api/order/ship/route"
const pi = {
  id: "pi_fixture",
  status: "succeeded",
  metadata: { buyer_email: "buyer@example.invalid" },
}
const request = (extra = {}) =>
  new Request("https://test.invalid/api/order/ship", {
    method: "POST",
    body: JSON.stringify({
      paymentIntentId: pi.id,
      tracking: "TRACK123",
      ...extra,
    }),
  })
beforeEach(() => {
  vi.clearAllMocks()
  m.admin.mockReturnValue(null)
  m.retrieve.mockResolvedValue(structuredClone(pi))
  m.capture.mockResolvedValue(structuredClone(pi))
  m.update.mockResolvedValue(pi)
  m.list.mockResolvedValue({
    data: [{ billing_details: { email: "accounting@example.invalid" } }],
  })
  m.send.mockResolvedValue({ data: { id: "mail" } })
  m.review.mockResolvedValue({ data: { id: "review" } })
})
it.each([
  "canceled",
  "requires_payment_method",
  "processing",
  "requires_action",
])("rejects shipment for %s", async (status) => {
  m.retrieve.mockResolvedValue({ ...pi, status })
  expect((await POST(request())).status).toBe(409)
  expect(m.send).not.toHaveBeenCalled()
  expect(m.update).not.toHaveBeenCalled()
})
it("requires confirmed capture before shipment", async () => {
  m.retrieve.mockResolvedValue({ ...pi, status: "requires_capture" })
  m.capture.mockResolvedValue({ ...pi, status: "processing" })
  expect((await POST(request())).status).toBe(409)
  expect(m.send).not.toHaveBeenCalled()
})
it("does not mark a rejected mail as shipped", async () => {
  m.send.mockResolvedValue({ data: null, error: { message: "Rejected" } })
  expect((await POST(request())).status).toBe(502)
  expect(m.update).not.toHaveBeenCalled()
})
it("does not mark a failed review scheduling as queued", async () => {
  m.review.mockRejectedValue(new Error("Rejected"))
  expect((await POST(request())).status).toBe(200)
  expect(m.update.mock.calls[0][1].metadata.review_email_at).toBeUndefined()
})
it("sends to the buyer and reuses delivery idempotency key after a failed metadata write", async () => {
  m.update.mockRejectedValueOnce(new Error("Temporary"))
  await POST(request())
  await POST(request())
  expect(m.send.mock.calls[0][0].to).toBe("buyer@example.invalid")
  expect(m.send.mock.calls[1][1]).toEqual(m.send.mock.calls[0][1])
})
it("does not resend the same recorded shipment or move its timestamp", async () => {
  m.retrieve.mockResolvedValue({
    ...pi,
    metadata: {
      ...pi.metadata,
      shipped_at: "123",
      tracking: "TRACK123",
      carrier: "PostNord",
      review_email_at: "123",
    },
  })
  expect((await POST(request())).status).toBe(200)
  expect(m.send).not.toHaveBeenCalled()
  expect(m.review).not.toHaveBeenCalled()
  expect(m.update.mock.calls[0][1].metadata.shipped_at).toBe("123")
})
it("requires admin before reading a payment", async () => {
  m.admin.mockReturnValue(new Response(null, { status: 401 }))
  expect((await POST(request())).status).toBe(401)
  expect(m.retrieve).not.toHaveBeenCalled()
})
