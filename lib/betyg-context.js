"use client"

import { createContext, useContext } from "react"

/**
 * Betyg per produkt-slug, matat från root-layouten. Produktkorten renderas i
 * klientkomponenter som importerar produktdatan direkt och kan inte läsa
 * Stripe själva — contexten är vägen dit utan att röra fem olika grids.
 */
const BetygContext = createContext({ betyg: {}, kop: {} })

export function BetygProvider({ betyg, kop, children }) {
  return (
    <BetygContext.Provider value={{ betyg: betyg || {}, kop: kop || {} }}>{children}</BetygContext.Provider>
  )
}

/** { antal, snitt } eller null. */
export function useBetyg(slug) {
  return useContext(BetygContext).betyg[slug] || null
}

/** Senaste riktiga köpet av produkten: { datum, antal, ordrar } eller null. */
export function useSenasteKop(slug) {
  return useContext(BetygContext).kop[slug] || null
}
