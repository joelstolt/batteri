// @vitest-environment jsdom
import { vi, it, expect, beforeEach, afterEach } from "vitest"
import { render, screen, cleanup, act, fireEvent } from "@testing-library/react"
const state = vi.hoisted(() => ({ items: [] }))
vi.mock("@/lib/cart-context", () => ({
  useCart: () => ({ items: state.items }),
}))
vi.mock("@/lib/attribution-context", () => ({
  useAttribution: () => () => ({}),
}))
vi.mock("@/lib/track", () => ({ track: () => {} }))
vi.mock("@/components/FadeIn", () => ({
  default: ({ children }) => <div>{children}</div>,
}))
vi.mock("next/image", () => ({ default: ({ fill, ...p }) => <img alt={p.alt || ""} {...p} /> }))
vi.mock("next/link", () => ({
  default: ({ children, ...p }) => <a {...p}>{children}</a>,
}))
vi.mock("@stripe/stripe-js", () => ({ loadStripe: () => null }))
vi.mock("@stripe/react-stripe-js", () => ({
  Elements: ({ children, options }) => (
    <div data-testid="payment" data-secret={options.clientSecret}>
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
        })
    )
    .mockImplementationOnce(
      () =>
        new Promise((r) => {
          second = r
        })
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
