"use client"

import { useCallback, useEffect, useState } from "react"

/**
 * Moderering av omdömen.
 *
 * Ingenting publiceras oberett. Ett omdöme på sajten är ett
 * marknadsföringspåstående med Batteriproffs namn på, så någon ska ha läst det.
 *
 * Nekade omdömen raderas inte, bara döljs. Dels går ett felklick att ångra,
 * dels vill man kunna visa vad som kom in om någon någonsin ifrågasätter
 * urvalet.
 */
function datum(unix) {
  return new Date(unix * 1000).toLocaleDateString("sv-SE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

const ETIKETT = {
  v: { text: "Väntar", klass: "bg-amber-bg/20 text-amber-text" },
  g: { text: "Publicerat", klass: "bg-green/10 text-green" },
  n: { text: "Nekat", klass: "bg-surface-alt text-text-mid" },
}

export default function AdminOmdomen({ token }) {
  const [omdomen, setOmdomen] = useState([])
  const [laddar, setLaddar] = useState(false)
  const [fel, setFel] = useState("")
  const [jobbar, setJobbar] = useState(null)

  const hamta = useCallback(async () => {
    setLaddar(true)
    setFel("")
    try {
      const res = await fetch("/api/admin/omdomen", { headers: { "x-admin-token": token } })
      if (!res.ok) throw new Error("Kunde inte hämta omdömen")
      const data = await res.json()
      setOmdomen(data.omdomen)
    } catch (e) {
      setFel(e.message)
    } finally {
      setLaddar(false)
    }
  }, [token])

  useEffect(() => {
    hamta()
  }, [hamta])

  async function satt(o, status) {
    const id = `${o.piId}-${o.slug}`
    setJobbar(id)
    try {
      const res = await fetch("/api/admin/omdomen", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-token": token },
        body: JSON.stringify({ paymentIntentId: o.piId, slug: o.slug, status }),
      })
      if (!res.ok) throw new Error("Kunde inte uppdatera")
      setOmdomen((f) =>
        f.map((x) => (x.piId === o.piId && x.slug === o.slug ? { ...x, status } : x))
      )
    } catch (e) {
      setFel(e.message)
    } finally {
      setJobbar(null)
    }
  }

  const vantande = omdomen.filter((o) => o.status === "v").length

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-navy">Omdömen</h2>
          <p className="mt-1 text-sm text-text-light">
            {vantande > 0
              ? `${vantande} väntar på granskning`
              : `${omdomen.length} totalt, inget väntar`}
          </p>
        </div>
        <button
          onClick={hamta}
          disabled={laddar}
          className="rounded-lg border border-border bg-white px-3.5 py-2 text-sm font-semibold text-navy disabled:opacity-50"
        >
          {laddar ? "Hämtar…" : "Uppdatera"}
        </button>
      </div>

      {fel && <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{fel}</p>}

      {!laddar && omdomen.length === 0 && !fel && (
        <p className="mt-6 rounded-xl border border-border bg-white px-5 py-8 text-center text-sm text-text-light">
          Inga omdömen än. De kommer in via mejlet som går ut sju dagar efter
          varje order.
        </p>
      )}

      <ul className="mt-5 space-y-3">
        {omdomen.map((o) => {
          const id = `${o.piId}-${o.slug}`
          const e = ETIKETT[o.status] || ETIKETT.v
          return (
            <li key={id} className="rounded-xl border border-border bg-white p-5">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <span className="font-heading text-sm font-bold text-navy">
                  {"★".repeat(o.betyg)}
                  <span className="text-border-dark">{"★".repeat(5 - o.betyg)}</span>
                </span>
                <span className="text-sm font-semibold text-text-dark">
                  {o.namn || "Anonym"}
                </span>
                <span className={`rounded-md px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${e.klass}`}>
                  {e.text}
                </span>
              </div>

              <p className="mt-1 text-sm text-text-light">
                {o.produkt} · {o.orderId} · {datum(o.datum)} · {o.epost || "ingen adress"}
              </p>

              {o.text ? (
                <p className="mt-2.5 leading-relaxed text-text-dark">{o.text}</p>
              ) : (
                <p className="mt-2.5 text-sm italic text-text-light">Betyg utan text.</p>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                {o.status !== "g" && (
                  <button
                    onClick={() => satt(o, "g")}
                    disabled={jobbar === id}
                    className="rounded-lg bg-navy px-4 py-2 font-heading text-sm font-bold text-white disabled:opacity-40"
                  >
                    Publicera
                  </button>
                )}
                {o.status !== "n" && (
                  <button
                    onClick={() => satt(o, "n")}
                    disabled={jobbar === id}
                    className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-text-mid disabled:opacity-40"
                  >
                    Neka
                  </button>
                )}
              </div>
            </li>
          )
        })}
      </ul>

      <p className="mt-6 text-xs leading-relaxed text-text-light">
        Publicerade omdömen syns på produktsidan direkt. Nekade raderas
        inte, bara döljs, så ett felklick går att ångra.
      </p>
    </div>
  )
}
