// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"
const state = vi.hoisted(() => ({ inclVat: false }))
vi.mock("@/lib/cart-context", () => ({
  useCart: () => ({
    toast: { shortName: "NM 6V 225Ah", qty: 4, price: 2195, images: ["/test.jpg"] },
    setToast: vi.fn(), setIsOpen: vi.fn(),
  }),
}))
vi.mock("@/lib/vat-context", () => ({
  useVat: () => ({
    displayPrice: (n) => state.inclVat ? n : Math.round(n / 1.25),
    vatLabel: state.inclVat ? "Inkl. moms" : "Exkl. moms",
  }),
}))
vi.mock("next/image", () => ({ default: ({ fill, ...props }) => <img {...props} alt={props.alt || ""} /> }))
import CartToast from "../components/CartToast"
beforeEach(() => { state.inclVat = false })
afterEach(cleanup)
it("matches the selected exclusive VAT amount and labels it explicitly", () => {
  render(<CartToast />)
  expect(screen.getByRole("status").textContent.replace(/\s/g, " ")).toContain("4 st · 7 024 kr exkl. moms")
})
it("shows the inclusive VAT amount when the customer changes mode", () => {
  const view = render(<CartToast />)
  state.inclVat = true
  view.rerender(<CartToast />)
  expect(screen.getByRole("status").textContent.replace(/\s/g, " ")).toContain("4 st · 8 780 kr inkl. moms")
})
