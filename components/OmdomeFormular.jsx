"use client"

import { useState } from "react"

const MAX_TEXT = 350

/**
 * Omdömesformulär inne i kundkontot.
 *
 * Visas bara på artiklar kunden faktiskt har på ordern och inte redan
 * recenserat. Texten är frivillig — ett betyg utan text är ett fullgott
 * omdöme och tvingar man fram text får man tomma artighetsfraser.
 */
export default function OmdomeFormular({ order, rad, onKlar }) {
  const [oppet, setOppet] = useState(false)
  const [betyg, setBetyg] = useState(0)
  const [text, setText] = useState("")
  const [anonym, setAnonym] = useState(false)
  const [skickar, setSkickar] = useState(false)
  const [fel, setFel] = useState("")

  async function skicka(e) {
    e.preventDefault()
    if (!betyg || skickar) return
    setSkickar(true)
    setFel("")
    try {
      const res = await fetch("/api/konto/omdome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentIntentId: order.id,
          slug: rad.slug,
          betyg,
          text,
          namn: order.customer.name,
          anonym,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Kunde inte spara omdömet")
      onKlar(rad.slug, data.meddelande)
    } catch (e) {
      setFel(e.message)
    } finally {
      setSkickar(false)
    }
  }

  if (!oppet) {
    return (
      <button
        onClick={() => setOppet(true)}
        className="text-sm font-semibold text-accent hover:underline"
      >
        Lämna omdöme
      </button>
    )
  }

  return (
    <form onSubmit={skicka} className="mt-2 rounded-lg border border-border bg-white p-4">
      <fieldset>
        <legend className="font-heading text-sm font-bold text-navy">
          Ditt omdöme om {rad.name || rad.slug}
        </legend>

        <div className="mt-3 flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setBetyg(n)}
              aria-label={`${n} av 5`}
              aria-pressed={betyg === n}
              className="p-0.5"
            >
              <svg
                width="26"
                height="26"
                viewBox="0 0 20 20"
                aria-hidden="true"
                fill="currentColor"
                className={n <= betyg ? "text-amber-bg" : "text-border-dark"}
              >
                <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z" />
              </svg>
            </button>
          ))}
        </div>

        <label htmlFor={`txt-${order.id}-${rad.slug}`} className="mt-4 block text-sm text-text-mid">
          Vill du skriva något? (frivilligt)
        </label>
        <textarea
          id={`txt-${order.id}-${rad.slug}`}
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, MAX_TEXT))}
          rows={3}
          className="mt-1.5 w-full rounded-lg border border-border px-3 py-2 text-sm"
          placeholder="Hur har batteriet fungerat?"
        />
        <p className="mt-1 text-xs text-text-light">
          {text.length} / {MAX_TEXT} tecken
        </p>

        <label className="mt-3 flex items-center gap-2 text-sm text-text-mid">
          <input
            type="checkbox"
            checked={anonym}
            onChange={(e) => setAnonym(e.target.checked)}
            className="h-4 w-4"
          />
          Visa mig som anonym
        </label>

        {fel && <p className="mt-2.5 text-sm text-red-700">{fel}</p>}

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={!betyg || skickar}
            className="rounded-lg bg-navy px-4 py-2.5 font-heading text-sm font-bold text-white disabled:opacity-40"
          >
            {skickar ? "Skickar…" : "Skicka omdöme"}
          </button>
          <button
            type="button"
            onClick={() => setOppet(false)}
            className="rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-text-mid"
          >
            Avbryt
          </button>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-text-light">
          Omdömet granskas innan det publiceras, och visas med ditt namn och
          märkningen verifierat köp. Vi ändrar aldrig i din text.
        </p>
      </fieldset>
    </form>
  )
}
