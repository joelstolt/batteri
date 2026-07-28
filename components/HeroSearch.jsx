"use client"

import { useState, useRef, useEffect, useId } from "react"
import { useRouter } from "next/navigation"
import { Search, Wrench, Package, RefreshCw, CornerDownLeft } from "lucide-react"
import { sok } from "@/lib/search-index"

const IKON = {
  maskin: Wrench,
  ersattning: RefreshCw,
  produkt: Package,
}

const ETIKETT = {
  maskin: "Maskin",
  ersattning: "Ersättning",
  produkt: "Batteri",
}

function formatPris(n) {
  return new Intl.NumberFormat("sv-SE").format(n)
}

/**
 * Sökfältet i heron.
 *
 * Byggt som en ARIA-combobox: input med role="combobox" och aria-activedescendant,
 * resultatlistan som role="listbox" med role="option". Piltangenter navigerar,
 * Enter väljer, Escape stänger. Utan det mönstret blir den oanvändbar med
 * skärmläsare, och sajten ligger på 100 i tillgänglighet.
 */
export default function HeroSearch() {
  const [query, setQuery] = useState("")
  const [oppen, setOppen] = useState(false)
  const [aktiv, setAktiv] = useState(-1)
  const router = useRouter()
  const boxRef = useRef(null)
  const inputRef = useRef(null)
  const listId = useId()

  const traffar = sok(query)

  // Stäng när man klickar utanför
  useEffect(() => {
    const utanfor = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOppen(false)
    }
    document.addEventListener("mousedown", utanfor)
    return () => document.removeEventListener("mousedown", utanfor)
  }, [])

  // Logga vad besökaren söker. Träffar noll betyder att vi saknar en
  // maskinsida — det är den datan som styr vilka som ska byggas härnäst.
  useEffect(() => {
    if (query.trim().length < 3) return
    const t = setTimeout(() => {
      if (typeof window !== "undefined" && window.umami) {
        window.umami.track("hero-sok", { term: query.trim().toLowerCase(), traffar: traffar.length })
      }
    }, 1200)
    return () => clearTimeout(t)
  }, [query, traffar.length])

  const ga = (href) => {
    setOppen(false)
    router.push(href)
  }

  const tangent = (e) => {
    if (!oppen || traffar.length === 0) {
      if (e.key === "ArrowDown" && traffar.length) setOppen(true)
      return
    }
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setAktiv((i) => (i + 1) % traffar.length)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setAktiv((i) => (i <= 0 ? traffar.length - 1 : i - 1))
    } else if (e.key === "Enter") {
      e.preventDefault()
      ga(traffar[aktiv >= 0 ? aktiv : 0].href)
    } else if (e.key === "Escape") {
      setOppen(false)
      setAktiv(-1)
    }
  }

  return (
    <div ref={boxRef} className="relative max-w-[560px]">
      <label htmlFor="hero-sok" className="mb-2 block font-heading text-sm font-bold text-white">
        Vilken maskin har du?
      </label>

      <div className="relative">
        <Search
          size={19}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-navy/50"
          aria-hidden="true"
        />
        <input
          id="hero-sok"
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={oppen && traffar.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={aktiv >= 0 ? `${listId}-${aktiv}` : undefined}
          autoComplete="off"
          placeholder="Nilfisk SC401, JLG saxlift, Trojan T-105…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOppen(true)
            setAktiv(-1)
          }}
          onFocus={() => setOppen(true)}
          onKeyDown={tangent}
          className="h-14 w-full rounded-xl border-2 border-transparent bg-white pl-12 pr-4 text-[15px] text-text-dark outline-none transition-colors placeholder:text-text-light focus:border-amber-bg"
        />
      </div>

      {/* Skärmläsare behöver få veta att listan ändrats */}
      <div aria-live="polite" className="sr-only">
        {query.trim().length >= 2 &&
          (traffar.length > 0
            ? `${traffar.length} träffar`
            : "Inga träffar — ring oss så hjälper vi dig")}
      </div>

      {oppen && query.trim().length >= 2 && (
        <div className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-xl border border-border bg-white shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
          {traffar.length > 0 ? (
            <ul id={listId} role="listbox" aria-label="Sökträffar" className="max-h-[340px] overflow-y-auto">
              {traffar.map((t, i) => {
                const Ikon = IKON[t.typ]
                return (
                  <li
                    key={t.href}
                    id={`${listId}-${i}`}
                    role="option"
                    aria-selected={i === aktiv}
                    onMouseEnter={() => setAktiv(i)}
                    onClick={() => ga(t.href)}
                    className={`flex cursor-pointer items-center gap-3 border-b border-border px-4 py-3 last:border-b-0 ${
                      i === aktiv ? "bg-surface" : "bg-white"
                    }`}
                  >
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-surface">
                      <Ikon size={16} className="text-navy" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold text-text-dark">{t.titel}</div>
                      <div className="truncate text-xs text-text-mid">
                        <span className="font-medium">{ETIKETT[t.typ]}</span> · {t.undertitel}
                      </div>
                    </div>
                    {t.pris && (
                      <div className="flex-shrink-0 text-right">
                        <div className="font-heading text-sm font-bold text-text-dark">
                          {formatPris(t.pris)} kr
                        </div>
                        <div className="text-[11px] text-text-light">inkl. moms</div>
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          ) : (
            <div className="px-4 py-5 text-sm text-text-mid">
              Ingen träff på <strong className="text-text-dark">{query.trim()}</strong>. Vi har fler
              batterier än vad som listas här — ring{" "}
              <a href="tel:+46735546968" className="font-semibold text-navy hover:underline">
                073-554 69 68
              </a>{" "}
              med modellbeteckningen så tar vi fram rätt.
            </div>
          )}

          {traffar.length > 0 && (
            <div className="flex items-center gap-1.5 border-t border-border bg-surface px-4 py-2 text-[11px] text-text-mid">
              <CornerDownLeft size={12} aria-hidden="true" />
              Enter för att öppna · piltangenter för att bläddra
            </div>
          )}
        </div>
      )}
    </div>
  )
}
