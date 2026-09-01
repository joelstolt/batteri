"use client"

import { useState } from "react"

const MAX_TEXT = 350

function Stjarnvaljare({ betyg, onValj, disabled }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={disabled}
          onClick={() => onValj(n)}
          aria-label={`${n} av 5`}
          aria-pressed={betyg === n}
          className="p-1"
        >
          <svg
            width="32"
            height="32"
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
  )
}

/**
 * Omdömesformuläret bakom direktlänken i mejlet. Ett kort per artikel på
 * ordern — de flesta ordrar har en. Samma regler som kontovägen: betyget är
 * det enda obligatoriska, texten frivillig, allt modereras före publicering.
 */
function ArtikelOmdome({ token, buyerName, rad, redanLamnad }) {
  const [betyg, setBetyg] = useState(0)
  const [text, setText] = useState("")
  const [anonym, setAnonym] = useState(false)
  const [skickar, setSkickar] = useState(false)
  const [klart, setKlart] = useState(redanLamnad ? "Du har redan lämnat ett omdöme på den här artikeln." : "")
  const [fel, setFel] = useState("")

  async function skicka(e) {
    e.preventDefault()
    if (!betyg || skickar) return
    setSkickar(true)
    setFel("")
    try {
      const res = await fetch("/api/omdome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, slug: rad.slug, betyg, text, anonym }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Kunde inte spara omdömet")
      setKlart(data.meddelande || "Tack! Ditt omdöme granskas innan det publiceras.")
    } catch (err) {
      setFel(err.message)
    } finally {
      setSkickar(false)
    }
  }

  if (klart) {
    return (
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="font-heading text-sm font-bold text-navy">{rad.name}</div>
        <p className="mt-2 text-sm text-text-mid">{klart}</p>
      </div>
    )
  }

  return (
    <form onSubmit={skicka} className="rounded-xl border border-border bg-white p-5">
      <fieldset>
        <legend className="font-heading text-base font-bold text-navy">{rad.name}</legend>

        <div className="mt-3">
          <Stjarnvaljare betyg={betyg} onValj={setBetyg} disabled={skickar} />
        </div>

        <label htmlFor={`txt-${rad.slug}`} className="mt-4 block text-sm text-text-mid">
          Vill du skriva något? (frivilligt)
        </label>
        <textarea
          id={`txt-${rad.slug}`}
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

        <button
          type="submit"
          disabled={!betyg || skickar}
          className="mt-4 rounded-lg bg-navy px-5 py-2.5 font-heading text-sm font-bold text-white disabled:opacity-40"
        >
          {skickar ? "Skickar…" : "Skicka omdöme"}
        </button>

        <p className="mt-3 text-xs leading-relaxed text-text-light">
          Omdömet granskas innan det publiceras och visas med{" "}
          {anonym ? "märkningen" : `ditt namn${buyerName ? ` (${buyerName})` : ""} och märkningen`}{" "}
          verifierat köp. Vi ändrar aldrig i din text.
        </p>
      </fieldset>
    </form>
  )
}

export default function OmdomeDirektContent({ token, orderId, buyerName, items, redanLamnade }) {
  const fornamn = String(buyerName || "").split(" ")[0]
  return (
    <section className="mx-auto max-w-xl px-5 py-14">
      <h1 className="font-heading text-2xl font-bold text-navy sm:text-3xl">
        {fornamn ? `Hej ${fornamn}!` : "Hej!"}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-text-mid">
        Hur blev det med din order <strong className="text-text-dark">{orderId}</strong>? Sätt ett
        betyg — det tar tio sekunder och hjälper nästa kund att våga handla hos oss.
      </p>

      <div className="mt-8 flex flex-col gap-4">
        {items.map((rad) => (
          <ArtikelOmdome
            key={rad.slug}
            token={token}
            buyerName={buyerName}
            rad={rad}
            redanLamnad={redanLamnade.includes(rad.slug)}
          />
        ))}
      </div>
    </section>
  )
}
