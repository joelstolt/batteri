// @vitest-environment jsdom
import { vi, it, expect, beforeEach, afterEach } from "vitest"
import { render, screen, cleanup, act, fireEvent } from "@testing-library/react"
const state = vi.hoisted(() => ({ items: [], track: vi.fn() }))
vi.mock("@/lib/cart-context", () => ({
  useCart: () => ({ items: state.items }),
}))
vi.mock("@/lib/attribution-context", () => ({
  useAttribution: () => () => ({}),
}))
vi.mock("@/lib/track", () => ({ track: (...a) => state.track(...a) }))
vi.mock("@/components/FadeIn", () => ({
  default: ({ children }) => <div>{children}</div>,
}))
vi.mock("next/image", () => ({
  default: ({ fill, ...p }) => <img alt={p.alt || ""} {...p} />,
}))
vi.mock("next/link", () => ({
  default: ({ children, ...p }) => <a {...p}>{children}</a>,
}))
vi.mock("@stripe/stripe-js", () => ({ loadStripe: () => null }))
vi.mock("@stripe/react-stripe-js", () => ({
  Elements: ({ children, options }) => (
    <div data-testid="payment" data-secret={options?.clientSecret}>
      {children}
    </div>
  ),
  PaymentElement: () => null,
  useStripe: () => null,
  useElements: () => null,
}))
import CheckoutContent from "../components/CheckoutContent"
const item = {
  slug: "a",
  lineId: "one",
  name: "Batteri A",
  shortName: "Batteri A",
  price: 100,
  qty: 1,
  images: ["/a.jpg"],
  freeShipping: false,
}
const quote = (secret, rows) => ({
  ok: true,
  json: async () => ({
    clientSecret: secret,
    paymentStatus: "requires_payment_method",
    quote: {
      items: rows,
      subtotalInclVat: rows.reduce((s, r) => s + r.price * r.qty, 0),
      shippingInclVat: 695,
      totalInclVat: rows.reduce((s, r) => s + r.price * r.qty, 0) + 695,
    },
  }),
})
beforeEach(() => {
  state.items = [item]
  state.track.mockClear()
  sessionStorage.clear()
  vi.stubGlobal("fetch", vi.fn())
})
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})
it("discards old responses arriving after a newer cart response", async () => {
  let first, second
  fetch
    .mockImplementationOnce(
      () =>
        new Promise((r) => {
          first = r
        }),
    )
    .mockImplementationOnce(
      () =>
        new Promise((r) => {
          second = r
        }),
    )
  const view = render(<CheckoutContent />)
  state.items = [{ ...item, qty: 2 }]
  view.rerender(<CheckoutContent />)
  await act(async () => second(quote("new_secret", state.items)))
  expect(screen.getByTestId("payment").dataset.secret).toBe("new_secret")
  await act(async () => first(quote("old_secret", [item])))
  expect(screen.getByTestId("payment").dataset.secret).toBe("new_secret")
})
it("requires explicit acknowledgement of changed prices before rendering payment", async () => {
  fetch.mockResolvedValue(quote("price_secret", [{ ...item, price: 120 }]))
  render(<CheckoutContent />)
  const accept = await screen.findByRole("button", {
    name: "Godkänn aktuellt pris och fortsätt",
  })
  expect(screen.queryByTestId("payment")).toBeNull()
  expect(document.body.textContent).toContain("815")
  fireEvent.click(accept)
  expect(screen.getByTestId("payment")).toBeTruthy()
})
it("uses the buyer email for accounting until the customer chooses another address", async () => {
  fetch.mockResolvedValue(quote("form_secret", [item]))
  render(<CheckoutContent />)
  const email = await screen.findByLabelText(/^E-post \*/)
  fireEvent.change(email, { target: { value: "buyer@example.invalid" } })
  expect(screen.queryByLabelText(/^E-post för betalningsunderlag/)).toBeNull()
  fireEvent.click(
    screen.getByLabelText(
      "Skicka betalningsunderlaget till en annan e-postadress",
    ),
  )
  const accounting = screen.getByLabelText(/^E-post för betalningsunderlag/)
  fireEvent.change(accounting, {
    target: { value: "accounts@example.invalid" },
  })
  fireEvent.change(email, { target: { value: "newbuyer@example.invalid" } })
  expect(accounting.value).toBe("accounts@example.invalid")
  expect(email.id).toBeTruthy()
})
it("preview lets users inspect the form without creating a payment", async () => {
  render(<CheckoutContent reviewPreview />)
  expect(screen.getByText("Granska kassan")).toBeTruthy()
  expect(screen.getByLabelText(/^Företagsnamn/)).toBeTruthy()
  expect(fetch).not.toHaveBeenCalled()
  expect(screen.getByRole("button", { name: /Slutför köp/ }).disabled).toBe(
    true,
  )
})
it("tracks a started checkout once, also when the cart loads after mount", async () => {
  fetch.mockReturnValue(new Promise(() => {}))
  vi.stubGlobal("umami", { track: () => {} })
  state.items = []
  const view = render(<CheckoutContent />)
  expect(state.track).not.toHaveBeenCalled()
  state.items = [item]
  view.rerender(<CheckoutContent />)
  state.items = [{ ...item, qty: 2 }]
  view.rerender(<CheckoutContent />)
  const started = state.track.mock.calls.filter(([n]) => n === "paborjad-kassa")
  expect(started).toEqual([["paborjad-kassa", { rader: 1, varde: 100 }]])
})
it("does not track a started checkout in the review preview", () => {
  vi.stubGlobal("umami", { track: () => {} })
  render(<CheckoutContent reviewPreview />)
  expect(state.track).not.toHaveBeenCalled()
})

it("keeps nine primary fields visible and provides address autofill", async () => {
  fetch.mockResolvedValue(quote("ux_secret", [{ ...item, qty: 4 }]))
  state.items = [{ ...item, qty: 4 }]
  render(<CheckoutContent />)
  await screen.findByLabelText(/^Förnamn/)
  const accounting = screen.getByText("Fler bokföringsuppgifter").closest("details")
  const delivery = screen.getByText("Lägg till leveransinstruktioner").closest("details")
  expect(accounting.open).toBe(false)
  expect(delivery.open).toBe(false)
  const visible = [...document.querySelectorAll("form input:not([type=checkbox]):not([type=radio]), form textarea")]
    .filter((input) => !input.closest("details") || input.closest("details").open)
  expect(visible).toHaveLength(9)
  expect(screen.getByLabelText(/^Gatuadress/).autocomplete).toBe("shipping street-address")
  expect(screen.getByLabelText(/^Postnummer \*/).autocomplete).toBe("shipping postal-code")
  const summary = screen.getByRole("button", { name: /4 batterier/ })
  expect(summary.getAttribute("aria-expanded")).toBe("false")
  fireEvent.click(summary)
  expect(summary.getAttribute("aria-expanded")).toBe("true")
  expect(document.getElementById(summary.getAttribute("aria-controls"))).toBeTruthy()
})

it("opens a collapsed optional group and focuses the invalid field after submit", async () => {
  vi.stubGlobal("requestAnimationFrame", (callback) => { callback(); return 1 })
  vi.stubGlobal("cancelAnimationFrame", vi.fn())
  fetch.mockResolvedValue(quote("validation_secret", [item]))
  render(<CheckoutContent />)
  await screen.findByLabelText(/^Förnamn/)
  const fields = [
    [/^Förnamn/, "Anna"], [/^Efternamn/, "Andersson"],
    [/^E-post \*/, "buyer@example.invalid"], [/^Telefon \*/, "0701234567"],
    [/^Företagsnamn/, "Exempel AB"], [/^Organisationsnummer/, "556016-0680"],
    [/^Gatuadress/, "Testgatan 1"], [/^Postnummer \*/, "12345"], [/^Ort \*/, "Lund"],
  ]
  for (const [label, value] of fields) fireEvent.change(screen.getByLabelText(label), { target: { value } })
  const reference = screen.getByLabelText(/^Er referens/)
  fireEvent.change(reference, { target: { value: "x".repeat(81) } })
  const group = reference.closest("details")
  group.open = false
  fireEvent.submit(reference.closest("form"))
  expect(group.open).toBe(true)
  expect(reference.getAttribute("aria-invalid")).toBe("true")
  expect(document.activeElement).toBe(reference)
  expect(screen.getByText("Max 80 tecken")).toBeTruthy()
  expect(fetch.mock.calls.filter(([url]) => url === "/api/order-details")).toHaveLength(0)

  fireEvent.change(reference, { target: { value: "Giltig referens" } })
  fireEvent.click(screen.getByLabelText("Skicka betalningsunderlaget till en annan e-postadress"))
  const invoiceEmail = screen.getByLabelText(/^E-post för betalningsunderlag/)
  fireEvent.change(invoiceEmail, { target: { value: "ogiltig-adress" } })
  group.open = false
  // Native requestSubmit would reject a hidden type=email before our handler
  // without noValidate. The custom validator must open and focus it instead.
  act(() => invoiceEmail.closest("form").requestSubmit())
  expect(group.open).toBe(true)
  expect(invoiceEmail.getAttribute("aria-invalid")).toBe("true")
  expect(document.activeElement).toBe(invoiceEmail)
  expect(fetch.mock.calls.filter(([url]) => url === "/api/order-details")).toHaveLength(0)
})

it("reveals extra recipient details restored from a previous order", async () => {
  fetch.mockResolvedValueOnce(quote("returning_secret", [item]))
  render(<CheckoutContent />)
  await screen.findByLabelText(/^Förnamn/)
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      ordrar: [{
        id: "pi_previous",
        orderId: "BP-UX-EXAMPLE",
        customer: { name: "Anna Andersson", email: "buyer@example.invalid", phone: "0701234567" },
        company: { name: "Exempel AB", orgNr: "556016-0680", vatNr: "SE556016068001", invoiceEmail: "accounts@example.invalid" },
        delivery: { line1: "Testgatan 1", postalCode: "12345", city: "Lund", phone: "0709876543" },
      }],
    }),
  })
  fireEvent.click(screen.getByRole("button", { name: /Hämta företags- och leveransuppgifter/ }))
  fireEvent.click(await screen.findByRole("button", { name: /BP-UX-EXAMPLE/ }))
  const accounting = screen.getByLabelText(/^E-post för betalningsunderlag/)
  const delivery = screen.getByLabelText(/^Telefon till godsmottagningen/)
  expect(accounting.value).toBe("accounts@example.invalid")
  expect(accounting.closest("details").open).toBe(true)
  expect(delivery.value).toBe("0709876543")
  expect(delivery.closest("details").open).toBe(true)
})
