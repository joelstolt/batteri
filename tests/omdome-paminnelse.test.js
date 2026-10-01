import { vi, it, expect, beforeEach } from "vitest"
const m = vi.hoisted(() => ({ send: vi.fn() }))
vi.mock("@/lib/review-email", () => ({ sendReviewReminder: m.send, DELAY_DAYS: 5 }))
vi.mock("@/lib/emails", () => ({ ADMIN_EMAIL: "admin@example.invalid" }))
vi.mock("next/cache", () => ({ unstable_cache: (fn) => fn }))
vi.mock("stripe", () => ({ default: class { paymentIntents = {} } }))
import {
  arMogen,
  hittaOmdomesPaminnelser,
  skickaOmdomesPaminnelse,
  PAMINN_EFTER_DAGAR,
} from "@/lib/omdome-paminnelse"

const DAG = 86400
const NU = 1_800_000_000
const koad = (dagarSedan) => String(NU - dagarSedan * DAG)
const pi = (meta = {}, extra = {}) => ({
  id: "pi_test123456789",
  status: "succeeded",
  receipt_email: null,
  metadata: {
    buyer_email: "kund@example.invalid",
    buyer_name: "Kim Kund",
    review_email_at: koad(12),
    ...meta,
  },
  ...extra,
})

beforeEach(() => {
  vi.clearAllMocks()
  vi.useRealTimers()
  m.send.mockResolvedValue({ data: { id: "mail" } })
})

it("påminner tolv dagar efter köningen, alltså en vecka efter omdömesmejlet", () => {
  expect(PAMINN_EFTER_DAGAR).toBe(12)
  expect(arMogen(pi(), NU)).toBe(true)
  expect(arMogen(pi({ review_email_at: koad(11.9) }), NU)).toBe(false)
})

it("släpper ordrar som passerat veckofönstret, så gamla kunder aldrig mejlas", () => {
  expect(arMogen(pi({ review_email_at: koad(18.9) }), NU)).toBe(true)
  expect(arMogen(pi({ review_email_at: koad(19) }), NU)).toBe(false)
  expect(arMogen(pi({ review_email_at: koad(30) }), NU)).toBe(false)
})

it.each([
  ["redan påmind", { review_reminder_at: "1799000000" }],
  ["har lämnat omdöme", { "omd_nm125-6et": JSON.stringify({ b: 5, s: "v" }) }],
  ["har fått omdömet nekat", { "omd_nm125-6et": JSON.stringify({ b: 1, s: "n" }) }],
  ["dold order", { dold: "1" }],
  ["inget omdömesmejl köat", { review_email_at: "" }],
  ["ingen mejladress", { buyer_email: "" }],
])("hoppar över: %s", (_, meta) => {
  expect(arMogen(pi(meta), NU)).toBe(false)
})

it("hoppar över betalningar som inte är genomförda", () => {
  expect(arMogen(pi({}, { status: "requires_capture" }), NU)).toBe(false)
})

it("letar bland de senaste 60 dagarnas betalningar och tar bara de mogna", async () => {
  const list = vi.fn(() =>
    (async function* () {
      yield pi()
      yield pi({ review_reminder_at: "1799000000" })
      yield pi({ review_email_at: koad(40) })
    })(),
  )
  const mogna = await hittaOmdomesPaminnelser({ paymentIntents: { list } }, NU)
  expect(list).toHaveBeenCalledWith({ limit: 100, created: { gte: NU - 60 * DAG } })
  expect(mogna).toHaveLength(1)
})

it("markerar ordern innan mejlet går, så en krasch aldrig ger två påminnelser", async () => {
  const ordning = []
  const update = vi.fn(async (_id, { metadata }) => {
    ordning.push(`markera:${metadata.review_reminder_at}`)
  })
  m.send.mockImplementation(async () => {
    ordning.push("skicka")
    return { data: { id: "mail" } }
  })
  const svar = await skickaOmdomesPaminnelse(pi(), { paymentIntents: { update } }, NU)
  expect(ordning).toEqual([`markera:${NU}`, "skicka"])
  expect(m.send).toHaveBeenCalledWith({
    to: "kund@example.invalid",
    fullName: "Kim Kund",
    orderId: "BP-TEST1234567",
    piId: "pi_test123456789",
    replyTo: "admin@example.invalid",
  })
  expect(svar).toEqual({ ok: true, order: "BP-TEST1234567", epost: "kund@example.invalid" })
})

it("försöker en gång till och tar bort markeringen om mejlet ändå inte gick", async () => {
  vi.useFakeTimers()
  const update = vi.fn(async () => {})
  m.send.mockRejectedValue(new Error("Resend 500"))
  const forsok = skickaOmdomesPaminnelse(pi(), { paymentIntents: { update } }, NU)
  const vantat = expect(forsok).rejects.toThrow("Resend 500")
  await vi.advanceTimersByTimeAsync(2000)
  await vantat
  expect(m.send).toHaveBeenCalledTimes(2)
  expect(update).toHaveBeenLastCalledWith("pi_test123456789", {
    metadata: { review_reminder_at: "" },
  })
})
