// @vitest-environment jsdom
import { vi, it, expect, beforeEach, afterEach } from "vitest"
import { track } from "@/lib/track"

beforeEach(() => {
  vi.useFakeTimers()
  delete window.umami
})
afterEach(() => {
  vi.useRealTimers()
  delete window.umami
})

it("skickar direkt när Umami redan har laddats", () => {
  window.umami = { track: vi.fn() }
  track("kop", { varde: 100 })
  expect(window.umami.track).toHaveBeenCalledWith("kop", { varde: 100 })
})

it("väntar in Umami när eventet skickas innan skriptet laddats", () => {
  track("omdome-oppnad", { forvalt: 5 })
  const umamiTrack = vi.fn()
  vi.advanceTimersByTime(1000)
  window.umami = { track: umamiTrack }
  vi.advanceTimersByTime(250)
  expect(umamiTrack).toHaveBeenCalledTimes(1)
  expect(umamiTrack).toHaveBeenCalledWith("omdome-oppnad", { forvalt: 5 })
})

it("ger upp efter tio sekunder om Umami aldrig laddas", () => {
  track("omdome-oppnad")
  vi.advanceTimersByTime(10_250)
  expect(vi.getTimerCount()).toBe(0)
  const sent = vi.fn()
  window.umami = { track: sent }
  vi.advanceTimersByTime(1000)
  expect(sent).not.toHaveBeenCalled()
})
