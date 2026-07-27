"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

const STORAGE_KEY = "bp-consent"

/**
 * Samtycke för Google Ads-taggen.
 *
 * Taggen sätter annonscookies, och den får enligt GDPR och ePrivacy inte göra
 * det innan besökaren sagt ja. Vi kör Googles Consent Mode v2: allt står på
 * "denied" från start (sätts i app/layout.js innan taggen ens laddas) och
 * uppgraderas först här, om besökaren godkänner.
 *
 * Umami rörs inte — det är cookielöst och kräver inget samtycke.
 */
function updateConsent(granted) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return
  const v = granted ? "granted" : "denied"
  window.gtag("consent", "update", {
    ad_storage: v,
    ad_user_data: v,
    ad_personalization: v,
    analytics_storage: v,
  })
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let saved = null
    try {
      saved = localStorage.getItem(STORAGE_KEY)
    } catch {}
    if (saved !== "granted" && saved !== "denied") setVisible(true)
  }, [])

  const choose = (granted) => {
    try {
      localStorage.setItem(STORAGE_KEY, granted ? "granted" : "denied")
    } catch {}
    updateConsent(granted)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Cookies"
      className="fixed bottom-0 left-0 right-0 z-[100] border-t border-border bg-white p-4 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-sm sm:rounded-2xl sm:border"
    >
      <div className="mb-3 font-heading text-sm font-bold text-text-dark">
        Cookies
      </div>
      <p className="mb-4 text-sm leading-relaxed text-text-mid">
        Vi använder cookies för att mäta hur våra annonser fungerar. Nödvändiga
        funktioner som varukorg och kassa fungerar oavsett vad du väljer. Läs mer i vår{" "}
        <Link href="/integritet" className="text-navy underline">
          integritetspolicy
        </Link>
        .
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => choose(true)}
          className="flex-1 cursor-pointer rounded-xl bg-navy px-4 py-2.5 font-heading text-sm font-bold text-white transition-colors hover:bg-navy-light"
        >
          Godkänn
        </button>
        <button
          type="button"
          onClick={() => choose(false)}
          className="flex-1 cursor-pointer rounded-xl border border-border px-4 py-2.5 font-heading text-sm font-bold text-text-dark transition-colors hover:bg-surface"
        >
          Bara nödvändiga
        </button>
      </div>
    </div>
  )
}
