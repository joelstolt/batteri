import { vi, it, expect, beforeEach } from "vitest"
const m = vi.hoisted(() => ({ send: vi.fn() }))
vi.mock("@/lib/emails", () => ({
  resend: { emails: { send: m.send } },
  FROM: "sender@example.invalid",
  ADMIN_EMAIL: "admin@example.invalid",
  escape: (s) => String(s).replaceAll("<", "&lt;"),
  emailLayout: (x) => x.body,
}))
vi.mock("@/lib/rate-limit", () => ({
  rateLimit: () => ({ ok: true }),
  clientIp: () => "fixture",
  isOwnOrigin: () => true,
  ALLOWED_ORIGINS: [],
}))
import { POST } from "../app/api/contact/route"
const request = (extra) =>
  new Request("https://test.invalid/api/contact", {
    method: "POST",
    body: JSON.stringify({
      name: "Test Person",
      email: "test@example.invalid",
      message: "En offert tack",
      ...extra,
    }),
  })
beforeEach(() => {
  vi.clearAllMocks()
  vi.stubEnv("RESEND_API_KEY", "fixture")
  m.send.mockResolvedValue({ data: { id: "mail" } })
})
it("rejects a forged quote before sending mail", async () => {
  expect(
    (await POST(request({ items: [{ slug: "unknown", qty: 1 }] }))).status,
  ).toBe(400)
  expect(m.send).not.toHaveBeenCalled()
})
it("uses current catalogue prices in quote email and escapes customer text", async () => {
  expect(
    (
      await POST(
        request({
          items: [{ slug: "nm125-6et", qty: 2, price: 1 }],
          message: "<script>hello</script>",
        }),
      )
    ).status,
  ).toBe(200)
  expect(m.send.mock.calls[0][0].html).toContain("2 st NM125-6ET")
  expect(m.send.mock.calls[0][0].html).toContain("1 836")
  expect(m.send.mock.calls[0][0].html).not.toContain("<script>")
})
it("does not send a receipt confirmation when the admin mail is rejected", async () => {
  m.send.mockResolvedValue({ error: { message: "Denied" } })
  expect((await POST(request({}))).status).toBe(502)
  expect(m.send).toHaveBeenCalledTimes(1)
})
