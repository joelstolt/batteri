"use client"

import { createContext, useContext } from "react"

/**
 * Betyg per produkt-slug, matat från root-layouten. Produktkorten renderas i
 * klientkomponenter som importerar produktdatan direkt och kan inte läsa
 * Stripe själva — contexten är vägen dit utan att röra fem olika grids.
 */
const BetygContext = createContext({})

export function BetygProvider({ betyg, children }) {
  return <BetygContext.Provider value={betyg || {}}>{children}</BetygContext.Provider>
}

/** { antal, snitt } eller null. */
export function useBetyg(slug) {
  return useContext(BetygContext)[slug] || null
}
