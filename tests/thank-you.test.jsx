// @vitest-environment jsdom
import { vi, it, expect, beforeEach, afterEach } from "vitest"
import {
  render,
  screen,
  waitFor,
  cleanup,
  fireEvent,
} from "@testing-library/react"
const mocks = vi.hoisted(() => ({
  complete: vi.fn(),
  params: new URLSearchParams(),
}))
vi.mock("next/navigation", () => ({ useSearchParams: () => mocks.params }))
vi.mock("next/link", () => ({
  default: ({ children, ...p }) => <a {...p}>{children}</a>,
}))
vi.mock("@/lib/cart-context", () => ({
  useCart: () => ({ completeOrder: mocks.complete }),
}))
import ThankYouContent from "../components/ThankYouContent"
const order = {
  id: "pi_fixture",
  paymentStatus: "requires_capture",
  created: 1,
  items: [{ slug: "old", name: "Historiskt batteri", qty: 2, price: 2295 }],
  subtotal: 3672,
  shipping: 556,
  totalInclVat: 5285,
  customer: {},
}
beforeEach(() => {
  vi.clearAllMocks()
  localStorage.clear()
  mocks.params = new URLSearchParams(
    "payment_intent=pi_fixture&payment_intent_client_secret=fixture"
  )
  window.gtag = vi.fn()
  window.umami = { track: vi.fn() }
  vi.stubGlobal("fetch", vi.fn())
})
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})
it("keeps cart and analytics untouched when API rejects verification", async () => {
  fetch.mockResolvedValue({
    ok: false,
    json: async () => ({ error: "Tillfälligt fel" }),
  })
  render(<ThankYouContent />)
  await screen.findByRole("alert")
  expect(mocks.complete).not.toHaveBeenCalled()
  expect(window.gtag).not.toHaveBeenCalled()
  expect(window.umami.track).not.toHaveBeenCalled()
  expect(screen.queryByText("Tack för din beställning!")).toBeNull()
})
it("does not request or confirm an incomplete return URL", async () => {
  mocks.params = new URLSearchParams()
  render(<ThankYouContent />)
  await screen.findByRole("alert")
  expect(fetch).not.toHaveBeenCalled()
  expect(mocks.complete).not.toHaveBeenCalled()
})
it("retries verification then shows normalized rows and clears only via the association helper", async () => {
  fetch
    .mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Försök igen" }),
    })
    .mockResolvedValueOnce({ ok: true, json: async () => order })
  render(<ThankYouContent />)
  fireEvent.click(
    await screen.findByRole("button", { name: "Försök verifiera igen" })
  )
  await screen.findByText("Tack för din beställning!")
  expect(screen.getByText("Historiskt batteri")).toBeTruthy()
  expect(document.body.textContent).not.toContain("NaN")
  await waitFor(() => expect(mocks.complete).toHaveBeenCalledWith(order))
  expect(window.umami.track).toHaveBeenCalledTimes(1)
})
it.each(["processing", "canceled"])(
  "rejects an unconfirmed %s response even with HTTP 200",
  async (status) => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ ...order, paymentStatus: status }),
    })
    render(<ThankYouContent />)
    await screen.findByRole("alert")
    expect(mocks.complete).not.toHaveBeenCalled()
  }
)
