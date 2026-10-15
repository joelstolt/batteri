"use client"

import { useVat } from "@/lib/vat-context"

import { useState, useRef, useEffect, useId, useMemo } from "react"
import { useRouter } from "next/navigation"
import { track } from "@/lib/track"
import {
  Search,
  Wrench,
  Package,
  RefreshCw,
  CornerDownLeft,
  LayoutGrid,
} from "lucide-react"
import { sok, sokbar } from "@/lib/search-index"
import SokHjalp from "@/components/SokHjalp"

const IKON = {
  maskin: Wrench,
  ersattning: RefreshCw,
  produkt: Package,
  sida: LayoutGrid,
}

const ETIKETT = {
  maskin: "Maskin",
  ersattning: "Ersättning",
  produkt: "Batteri",
  sida: "Kategori",
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
export default function HeroSearch({ onForhandsvisning }) {
  const { displayPrice, vatLabel } = useVat()
  const [query, setQuery] = useState("")
  const [oppen, setOppen] = useState(false)
  const [aktiv, setAktiv] = useState(-1)
  const router = useRouter()
  const boxRef = useRef(null)
  const inputRef = useRef(null)
  const listId = useId()

  // Samma villkor som sökningen använder — annars påstår rutan "ingen träff"
  // på en fråga som aldrig söktes.
  const kanSoka = sokbar(query)
  const traffar = useMemo(() => (kanSoka ? sok(query) : []), [kanSoka, query])

  // Rapportera upp den träff som är i fokus, så heron kan visa den. Utan det
  // står samma stillastående batteribild kvar oavsett vad besökaren skriver.
  // Delträffar är gissningar, inte svaret på det som skrevs: visa dem inte som
  // förhandsvisning förrän besökaren själv markerat en.
  const delvis = traffar.length > 0 && traffar[0].delvis === true
  const forhandsvisad =
    traffar.length && (aktiv >= 0 || !delvis)
      ? traffar[aktiv >= 0 ? aktiv : 0]
      : null
  useEffect(() => {
    onForhandsvisning?.(forhandsvisad || null)
  }, [forhandsvisad, onForhandsvisning])

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
      const term = query.trim().toLowerCase()
      track("hero-sok", { term, traffar: traffar.length })
      // Eget event, av samma skäl som i SearchModal: en nolla begravd i en
      // egenskap syns inte i Umamis eventlista. Delträffar räknas som
      // "utan träff": modellen saknas fortfarande, och det är den signalen
      // som styr vilka maskinsidor som byggs härnäst.
      if (traffar.length === 0 || delvis) {
        track("sok-utan-traff", { term, delvis: traffar.length })
      }
    }, 1200)
    return () => clearTimeout(t)
  }, [query, traffar.length, delvis])

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
      // Vid delträffar öppnas inget förrän besökaren valt själv
      const i = aktiv >= 0 ? aktiv : delvis ? -1 : 0
      if (i >= 0) ga(traffar[i].href)
    } else if (e.key === "Escape") {
      setOppen(false)
      setAktiv(-1)
    }
  }

  return (
    <div ref={boxRef} className="relative max-w-[560px]">
      <label
        htmlFor="hero-sok"
        className="mb-2 block font-heading text-sm font-bold text-white"
      >
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
        {kanSoka &&
          (delvis
            ? `Ingen exakt träff. ${traffar.length} närmaste träffar`
            : traffar.length > 0
              ? `${traffar.length} träffar`
              : "Inga träffar. Chatta med oss så hjälper vi dig")}
      </div>

      {oppen && kanSoka && (
        <div className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-xl border border-border bg-white shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
          {delvis && (
            <div className="border-b border-border bg-surface px-4 py-2 text-xs text-text-mid">
              Ingen exakt träff på{" "}
              <strong className="text-text-dark">{query.trim()}</strong>.
              Närmaste träffar:
            </div>
          )}
          {traffar.length > 0 ? (
            <ul
              id={listId}
              role="listbox"
              aria-label="Sökträffar"
              className="max-h-[340px] overflow-y-auto"
            >
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
                      <Ikon
                        size={16}
                        className="text-navy"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold text-text-dark">
                        {t.titel}
                      </div>
                      <div className="truncate text-xs text-text-mid">
                        <span className="font-medium">{ETIKETT[t.typ]}</span> ·{" "}
                        {t.undertitel}
                      </div>
                    </div>
                    {t.pris && (
                      <div className="flex-shrink-0 text-right">
                        <div className="font-heading text-sm font-bold text-text-dark">
                          {formatPris(displayPrice(t.pris))} kr
                        </div>
                        <div className="text-[11px] text-text-light">
                          {vatLabel}
                        </div>
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          ) : (
            <div>
              <div className="px-4 pb-1 pt-4 text-sm text-text-mid">
                Ingen träff på{" "}
                <strong className="text-text-dark">{query.trim()}</strong>. Vi
                har fler batterier än vad som listas här.
              </div>
              <SokHjalp onKlar={() => setOppen(false)} />
            </div>
          )}

          {delvis && (
            <SokHjalp
              className="border-t border-border"
              onKlar={() => setOppen(false)}
            />
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
