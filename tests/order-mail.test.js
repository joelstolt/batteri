import { it, expect, vi, beforeEach } from "vitest"
import { sendOrderMail } from "../lib/order-mail"
let metadata, stripe, resend
const message = {
  to: "buyer@example.invalid",
  from: "orders@example.invalid",
  subject: "Test fixture",
  html: "Fixture",
}
const call = (extra = {}) =>
  sendOrderMail({
    stripe,
    resend,
    paymentId: "pi_fixture",
    role: "customer",
    message,
    now: 1000,
    ...extra,
  })
beforeEach(() => {
  metadata = {}
  stripe = {
    paymentIntents: {
      retrieve: vi.fn(async () => ({ metadata: { ...metadata } })),
      update: vi.fn(async (id, data) => {
        Object.assign(metadata, data.metadata)
      }),
    },
  }
  resend = {
    emails: {
      send: vi.fn(async () => ({ data: { id: "mail_fixture" }, error: null })),
    },
  }
})
it("persists a receipt and skips later retries even after the provider window", async () => {
  await call()
  await call({ now: 1000 + 48 * 3600000 })
  expect(resend.emails.send).toHaveBeenCalledTimes(1)
  expect(JSON.parse(metadata.order_mail_customer).sent).toBe("mail_fixture")
})
it("retries SDK error responses with the same provider idempotency key", async () => {
  resend.emails.send.mockResolvedValueOnce({
    error: { name: "rate_limit_exceeded" },
  })
  await expect(call()).rejects.toThrow()
  await call()
  expect(resend.emails.send.mock.calls[0][1]).toEqual(
    resend.emails.send.mock.calls[1][1]
  )
})
it("does not send if the durable pre-send write fails", async () => {
  stripe.paymentIntents.update.mockRejectedValueOnce(new Error("Stripe down"))
  await expect(call()).rejects.toThrow()
  expect(resend.emails.send).not.toHaveBeenCalled()
})
it("reuses the send key when saving the successful receipt fails", async () => {
  stripe.paymentIntents.update
    .mockImplementationOnce(async (id, data) =>
      Object.assign(metadata, data.metadata)
    )
    .mockRejectedValueOnce(new Error("timeout"))
  await expect(call()).rejects.toThrow()
  await call()
  expect(resend.emails.send.mock.calls[0][1]).toEqual(
    resend.emails.send.mock.calls[1][1]
  )
})
it("stops uncertain sends outside the retry window", async () => {
  resend.emails.send.mockRejectedValueOnce(new Error("timeout"))
  await expect(call()).rejects.toThrow()
  await expect(call({ now: 1000 + 24 * 3600000 })).rejects.toThrow("Reconcile")
  expect(resend.emails.send).toHaveBeenCalledTimes(1)
})
it("stops changed payloads on an uncertain retry", async () => {
  resend.emails.send.mockRejectedValueOnce(new Error("timeout"))
  await expect(call()).rejects.toThrow()
  await expect(
    call({ message: { ...message, to: "other@example.invalid" } })
  ).rejects.toThrow("Reconcile")
})
it("tracks recipients independently after partial delivery", async () => {
  await call()
  resend.emails.send.mockRejectedValueOnce(new Error("timeout"))
  await expect(call({ role: "admin" })).rejects.toThrow()
  await call()
  await call({ role: "admin" })
  expect(resend.emails.send).toHaveBeenCalledTimes(3)
})
it("uses identical provider keys for concurrent deliveries", async () => {
  await Promise.all([call(), call()])
  expect(
    resend.emails.send.mock.calls.every(
      (c) => c[1].idempotencyKey === "order-confirmation-v2/pi_fixture/customer"
    )
  ).toBe(true)
})
