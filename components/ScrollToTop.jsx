"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export default function ScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    // Länkar med #ankare ska landa på ankaret, inte på toppen. Utan den här
    // vakten sköt vi förbi t.ex. /villkor#3-frakt-och-leverans varje gång.
    if (window.location.hash) return
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [pathname])

  return null
}
