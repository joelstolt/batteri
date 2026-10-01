import { vi, it, expect, beforeEach } from "vitest"
const m = vi.hoisted(() => ({ send: vi.fn() }))
vi.mock("@/lib/emails", () => ({
  resend: { emails: { send: m.send } },
  escape: (s) => String(s),
  emailLayout: (x) => x.body,
}))
vi.mock("@/lib/konto-auth", () => ({ skapaOmdomeToken: () => "tok" }))
import { scheduleReviewEmail, sendReviewReminder } from "@/lib/review-email"

const kund = {
  to: "kund@example.invalid",
  fullName: "Kim Kund",
  orderId: "BP-TEST1234567",
  piId: "pi_test123456789",
  replyTo: "admin@example.invalid",
}

beforeEach(() => {
  vi.clearAllMocks()
  m.send.mockResolvedValue({ data: { id: "mail" } })
})

const stjarnlankar = (html) => html.match(/\/omdome\?t=tok&betyg=\d/g)

it("omdömesmejlet köas fem dagar fram med fem stjärnlänkar", async () => {
  await scheduleReviewEmail(kund)
  const [mejl] = m.send.mock.calls[0]
  expect(mejl.scheduledAt).toBe("in 5 days")
  expect(mejl.subject).toBe("Hur gick det med din order, Kim?")
  expect(stjarnlankar(mejl.html)).toHaveLength(5)
})

it("påminnelsen går direkt, en gång per order, med samma stjärnlänkar", async () => {
  await sendReviewReminder(kund)
  const [mejl, alternativ] = m.send.mock.calls[0]
  expect(mejl.scheduledAt).toBeUndefined()
  expect(mejl.to).toBe("kund@example.invalid")
  expect(mejl.replyTo).toBe("admin@example.invalid")
  expect(mejl.subject).toBe("Har du tio sekunder, Kim?")
  expect(mejl.html).toContain("Hej igen Kim!")
  expect(mejl.html).toContain("BP-TEST1234567")
  expect(mejl.html).toContain("sista gången")
  expect(stjarnlankar(mejl.html)).toEqual([1, 2, 3, 4, 5].map((n) => `/omdome?t=tok&betyg=${n}`))
  expect(alternativ).toEqual({ idempotencyKey: "omdome-paminnelse/pi_test123456789" })
})

it("ingen kundtext i omdömesmejlen har långa tankstreck", async () => {
  await scheduleReviewEmail(kund)
  await sendReviewReminder(kund)
  for (const [mejl] of m.send.mock.calls) {
    expect(`${mejl.subject} ${mejl.html}`).not.toMatch(/[—–]/)
  }
})

it("kastar när mejltjänsten nekar, så cron-jobbet kan försöka igen", async () => {
  m.send.mockResolvedValue({ error: { message: "nej" } })
  await expect(sendReviewReminder(kund)).rejects.toThrow("omdömespåminnelsen")
})
