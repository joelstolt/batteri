"use client"

import { createContext, useContext, useState, useEffect } from "react"

const VatContext = createContext()

export function VatProvider({ children }) {
  const [inclVat, setInclVat] = useState(true)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem("batteriproffs-vat")
      if (saved !== null) setInclVat(JSON.parse(saved))
    } catch {}
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded) {
      try {
        localStorage.setItem("batteriproffs-vat", JSON.stringify(inclVat))
      } catch {}
    }
  }, [inclVat, loaded])

  const toggleVat = () => setInclVat((prev) => !prev)

  // Helper: apply VAT to a price
  const displayPrice = (priceExclVat) =>
    inclVat ? Math.round(priceExclVat * 1.25) : priceExclVat

  const vatLabel = inclVat ? "Inkl. moms" : "Exkl. moms"

  return (
    <VatContext.Provider value={{ inclVat, toggleVat, displayPrice, vatLabel }}>
      {children}
    </VatContext.Provider>
  )
}

export function useVat() {
  const ctx = useContext(VatContext)
  if (!ctx) throw new Error("useVat must be used within VatProvider")
  return ctx
}
