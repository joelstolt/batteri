// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
const state = vi.hoisted(() => ({ inclVat: false, items: [], addItem: vi.fn() }))
vi.mock("@/lib/cart-context", () => ({ useCart: () => ({ items: state.items, addItem: state.addItem }) }))
vi.mock("@/lib/vat-context", () => ({ useVat: () => ({
  displayPrice: (n) => state.inclVat ? n : Math.round(n / 1.25),
  vatLabel: state.inclVat ? "Inkl. moms" : "Exkl. moms",
}) }))
import ProductPurchase from "../components/ProductPurchase"
import VerifiedBatteryPackage from "../components/VerifiedBatteryPackage"
import { normalizeQuantity, purchaseTotals, productSeoType, verifiedBatteryPackage } from "../lib/product-purchase"
import { getProductBySlug } from "../lib/products"
import { machineBySlug } from "../lib/machines"
const nm = getProductBySlug("nm105-6et")
const gf = getProductBySlug("gf-12-076v")
const machine = machineBySlug("tennant-t3-t3-plus")
const text = (node) => node.textContent.replace(/\s/g, " ")
beforeEach(() => { state.inclVat = false; state.items = []; state.addItem.mockClear() })
afterEach(cleanup)

describe("purchase selection", () => {
  it("matches checkout totals for real multi-battery selections and free shipping", () => {
    expect(purchaseTotals(nm, 4)).toEqual({ quantity: 4, subtotal: 8780, shipping: 695, total: 9475 })
    expect(purchaseTotals(gf, 2).total).toBe(7085)
    expect(purchaseTotals({ ...nm, freeShipping: true }, 4).total).toBe(8780)
    for (const [value, expected] of [[0,1],[-3,1],[100,99],[4.8,4],["6",6],["",1],[Infinity,1]]) {
      expect(normalizeQuantity(value)).toBe(expected)
    }
  })
  it("shows selected quantity and freight totals in the customer's VAT mode", () => {
    const view = render(<ProductPurchase product={nm} />)
    fireEvent.click(screen.getByRole("button", { name: "4 st", exact: true }))
    expect(screen.getByRole("spinbutton", { name: "Antal" }).value).toBe("4")
    expect(text(screen.getByRole("region", { name: "Välj antal och köp" }))).toContain("7 580 kr exkl. moms")
    state.inclVat = true
    view.rerender(<ProductPurchase product={nm} />)
    expect(text(screen.getByRole("region", { name: "Välj antal och köp" }))).toContain("9 475 kr inkl. moms")
    fireEvent.click(screen.getByRole("button", { name: "Lägg i varukorg", exact: true }))
    expect(state.addItem).toHaveBeenCalledWith(nm, 4)
  })
  it("allows replacing the quantity and normalizes boundaries before adding", () => {
    render(<ProductPurchase product={nm} />)
    const input = screen.getByRole("spinbutton", { name: "Antal" })
    fireEvent.change(input, { target: { value: "" } })
    expect(input.value).toBe("")
    fireEvent.change(input, { target: { value: "6" } })
    fireEvent.click(screen.getByRole("button", { name: "Lägg i varukorg", exact: true }))
    expect(state.addItem).toHaveBeenLastCalledWith(nm, 6)
    fireEvent.change(input, { target: { value: "100" } })
    expect(input.value).toBe("99")
    fireEvent.change(input, { target: { value: "" } })
    fireEvent.blur(input)
    expect(input.value).toBe("1")
  })
  it("prevents a misleading add when the basket would exceed 99", () => {
    state.items = [{ slug: nm.slug, qty: 98 }]
    render(<ProductPurchase product={nm} />)
    fireEvent.click(screen.getByRole("button", { name: "2 st", exact: true }))
    const buy = screen.getByRole("button", { name: "Lägg i varukorg", exact: true })
    expect(buy.disabled).toBe(true)
    expect(screen.getByRole("status").textContent).toContain("redan 98 st")
    fireEvent.click(buy)
    expect(state.addItem).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole("button", { name: "1 st", exact: true }))
    expect(buy.disabled).toBe(false)
  })
  it("keeps the paused product unavailable", () => {
    const paused = getProductBySlug("nm875-8et")
    render(<ProductPurchase product={paused} />)
    const buy = screen.getByRole("button", { name: "Ej beställningsbar", exact: true })
    expect(buy.disabled).toBe(true)
    fireEvent.click(buy)
    expect(state.addItem).not.toHaveBeenCalled()
  })
  it("does not call open lead batteries gel in SEO labels", () => {
    expect(productSeoType(nm)).toContain("Öppet blybatteri")
    expect(productSeoType(nm)).not.toContain("Gel")
    expect(productSeoType(gf)).toContain("Gelbatteri")
  })
})

describe("documented Tennant package", () => {
  it("is limited to the documented machine/product and adds exactly two", () => {
    expect(verifiedBatteryPackage(machine, gf)?.quantity).toBe(2)
    expect(verifiedBatteryPackage({ ...machine, compatibilityVerified: false }, gf)).toBeNull()
    expect(verifiedBatteryPackage({ ...machine, slug: "nilfisk-sc401" }, gf)).toBeNull()
    expect(verifiedBatteryPackage(machine, nm)).toBeNull()
    render(<VerifiedBatteryPackage machine={machine} product={gf} />)
    expect(text(screen.getByRole("region", { name: "Batteripaket till Tennant T3 och T3+" }))).toContain("5 668 kr")
    expect(screen.getByText(/Endast gelutförandet/).textContent).toContain("serienummer 20000")
    expect(screen.getByRole("link", { name: /Tennant manual/ }).getAttribute("href")).toContain("9007692.pdf#page=85")
    fireEvent.click(screen.getByRole("button", { name: "Lägg 2 batterier i varukorgen" }))
    expect(state.addItem).toHaveBeenCalledWith(gf, 2)
  })
  it("does not silently reduce a two-battery package to one at the cart limit", () => {
    state.items = [{ slug: gf.slug, qty: 98 }]
    render(<VerifiedBatteryPackage machine={machine} product={gf} />)
    const buy = screen.getByRole("button", { name: "Lägg 2 batterier i varukorgen" })
    expect(buy.disabled).toBe(true)
    fireEvent.click(buy)
    expect(state.addItem).not.toHaveBeenCalled()
  })
})
