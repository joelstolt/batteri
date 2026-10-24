import { vi, it, expect, beforeEach } from "vitest"
const m = vi.hoisted(() => ({ list: vi.fn() }))
vi.mock("stripe", () => ({
  default: class {
    paymentIntents = { list: m.list }
  },
}))
vi.mock("@/lib/emails", () => ({
  resend: { emails: { send: vi.fn() } },
  FROM: "sender@example.invalid",
  ADMIN_EMAIL: "admin@example.invalid",
  escape: (s) => String(s),
  emailLayout: (x) => x.body,
  formatPriceKr: (a) => new Intl.NumberFormat("sv-SE").format(Math.round(a)),
}))
vi.mock("@/lib/konto-auth", () => ({
  skapaAterstallToken: () => "tok",
  skapaAvregToken: () => "avreg",
}))
vi.mock("next/cache", () => ({ unstable_cache: (fn) => fn }))
import { hittaOvergivna, byggPaminnelse } from "../lib/kassa-paminnelse"

const TIMME = 3600
const NU = 1_790_000_000
const items = JSON.stringify([
  { s: "nm125-6et", n: "Nordmax NM125-6ET", q: 4, p: 2295 },
])

function kassa({ id, sedan, extra = {}, ...rest }) {
  return {
    id,
    status: "requires_payment_method",
    amount: 987500,
    created: NU - sedan,
    latest_charge: null,
    metadata: {
      items,
      kontakt_epost: "kund@example.invalid",
      kontakt_epost_at: String(NU - sedan),
      ...extra,
    },
    ...rest,
  }
}

beforeEach(() => m.list.mockReset())

it("ger påminnelse 1 en timme efter kassan", async () => {
  m.list.mockResolvedValue({ data: [kassa({ id: "pi_a", sedan: 2 * TIMME })] })
  const svar = await hittaOvergivna(NU)
  expect(svar.map((k) => [k.pi.id, k.steg])).toEqual([["pi_a", 1]])
})

it("skickar inte påminnelse 1 igen när kunden öppnar kassan på nytt", async () => {
  // Nyast först, som Stripe listar dem.
  m.list.mockResolvedValue({
    data: [
      kassa({ id: "pi_ny", sedan: 2 * TIMME }),
      kassa({
        id: "pi_gammal",
        sedan: 5 * TIMME,
        extra: { paminnelse_1_at: String(NU - 4 * TIMME) },
      }),
    ],
  })
  expect(await hittaOvergivna(NU)).toEqual([])
})

it("skickar påminnelse 2 en gång per adress, på den senaste kassan", async () => {
  m.list.mockResolvedValue({
    data: [
      kassa({
        id: "pi_3",
        sedan: 23 * TIMME,
        extra: { paminnelse_1_at: String(NU - 22 * TIMME) },
      }),
      kassa({
        id: "pi_2",
        sedan: 25 * TIMME,
        extra: { paminnelse_1_at: String(NU - 24 * TIMME) },
      }),
      kassa({
        id: "pi_1",
        sedan: 28 * TIMME,
        extra: { paminnelse_1_at: String(NU - 27 * TIMME) },
      }),
    ],
  })
  const svar = await hittaOvergivna(NU)
  expect(svar.map((k) => [k.pi.id, k.steg])).toEqual([["pi_3", 2]])
})

it("påminner aldrig efter ett nekat kort", async () => {
  m.list.mockResolvedValue({
    data: [
      kassa({ id: "pi_nekad", sedan: 2 * TIMME, latest_charge: "ch_nekad" }),
      kassa({ id: "pi_tidig", sedan: 3 * TIMME }),
    ],
  })
  expect(await hittaOvergivna(NU)).toEqual([])
})

it("visar frakt och totalsumma inkl. moms", () => {
  const { html } = byggPaminnelse({
    pi: kassa({ id: "pi_a", sedan: 2 * TIMME }),
    steg: 1,
    epost: "kund@example.invalid",
  })
  expect(html).toMatch(/Frakt<\/td>\s*<td[^>]*>\s*695 kr/)
  expect(html).toMatch(/Totalt inkl\. moms<\/td>\s*<td[^>]*>\s*9\s875 kr/)
  expect(html).toContain("Frakt är 695 kr oavsett antal batterier")
})

it("skriver fri frakt när summan bara är varorna", () => {
  const { html } = byggPaminnelse({
    pi: { ...kassa({ id: "pi_b", sedan: 2 * TIMME }), amount: 918000 },
    steg: 1,
    epost: "kund@example.invalid",
  })
  expect(html).toContain("Fri frakt")
  expect(html).toContain("Frakten är fri på den här varukorgen")
})
