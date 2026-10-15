// @vitest-environment jsdom
import { vi, it, expect, beforeEach, afterEach } from "vitest"
import { render, screen, cleanup, fireEvent } from "@testing-library/react"
const mocks = vi.hoisted(() => ({ push: vi.fn(), track: vi.fn() }))
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: mocks.push }) }))
vi.mock("next/image", () => ({
  default: ({ alt }) => <img alt={alt} />,
}))
vi.mock("@/lib/vat-context", () => ({
  useVat: () => ({ displayPrice: (n) => n, vatLabel: "Inkl. moms" }),
}))
vi.mock("@/lib/track", () => ({ track: mocks.track }))
import HeroSearch from "../components/HeroSearch"
import SearchModal from "../components/SearchModal"

beforeEach(() => {
  vi.useFakeTimers()
  vi.clearAllMocks()
})
afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

function skriv(fält, text) {
  fireEvent.change(fält, { target: { value: text } })
}

it("hero: delträffar får rubrik och hjälpväg, och Enter öppnar inget oombett", () => {
  const forhandsvisning = vi.fn()
  render(<HeroSearch onForhandsvisning={forhandsvisning} />)
  skriv(screen.getByRole("combobox"), "kärcher br 55/60w")
  expect(screen.getByText(/Ingen exakt träff på/)).toBeTruthy()
  expect(screen.getAllByRole("option").length).toBeGreaterThan(0)
  expect(screen.getByText("Hittar du inte din maskin?")).toBeTruthy()
  expect(forhandsvisning).toHaveBeenLastCalledWith(null)
  fireEvent.keyDown(screen.getByRole("combobox"), { key: "Enter" })
  expect(mocks.push).not.toHaveBeenCalled()
  fireEvent.click(screen.getByText("skicka modellnumret"))
  expect(mocks.push).toHaveBeenCalledWith("/kontakt")
})

it("hero: noll träffar visar hjälpvägen och loggar sok-utan-traff", () => {
  render(<HeroSearch />)
  skriv(screen.getByRole("combobox"), "numatic")
  expect(screen.queryAllByRole("option")).toHaveLength(0)
  expect(screen.getByText("Hittar du inte din maskin?")).toBeTruthy()
  vi.advanceTimersByTime(1300)
  expect(mocks.track).toHaveBeenCalledWith("sok-utan-traff", {
    term: "numatic",
    delvis: 0,
  })
})

it("hero: delträffar loggas fortfarande som sok-utan-traff", () => {
  render(<HeroSearch />)
  skriv(screen.getByRole("combobox"), "kärcher br 55/60w")
  vi.advanceTimersByTime(1300)
  expect(mocks.track).toHaveBeenCalledWith(
    "sok-utan-traff",
    expect.objectContaining({ term: "kärcher br 55/60w" }),
  )
})

it("hero: exakt träff loggas inte som sok-utan-traff och har ingen delträffsrubrik", () => {
  render(<HeroSearch />)
  skriv(screen.getByRole("combobox"), "hako scrubbmaster")
  expect(screen.queryByText(/Ingen exakt träff på/)).toBeNull()
  expect(screen.queryByText("Hittar du inte din maskin?")).toBeNull()
  vi.advanceTimersByTime(1300)
  expect(mocks.track).not.toHaveBeenCalledWith(
    "sok-utan-traff",
    expect.anything(),
  )
})

it("modal: delträffar och noll träffar visar båda hjälpvägen", () => {
  render(<SearchModal isOpen onClose={() => {}} />)
  const fält = screen.getByPlaceholderText(/Sök batteri/)
  skriv(fält, "kärcher br 55/60w")
  expect(screen.getByText(/Ingen exakt träff på/)).toBeTruthy()
  expect(screen.getByText("Hittar du inte din maskin?")).toBeTruthy()
  skriv(fält, "varta")
  expect(screen.getByText(/Ingen träff på/)).toBeTruthy()
  expect(screen.getByText("Hittar du inte din maskin?")).toBeTruthy()
})
