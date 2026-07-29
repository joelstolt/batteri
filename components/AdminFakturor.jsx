"use client"

import { useCallback, useEffect, useState } from "react"
import { publicProducts } from "@/lib/products"

/**
 * Förskottsfakturor mot bankgiro.
 *
 * För kunder som inte kan betala med kort men vars attestrutin kräver ett
 * fakturaunderlag. Ingen kredit lämnas: batteriet skickas först när betalningen
 * kommit in, och det står i mejlet till kunden.
 */

const BANKGIRO = "5218-3480"

function kr(n) {
  return new Intl.NumberFormat("sv-SE").format(Math.round(n || 0)) + " kr"
}

function datum(unix) {
  if (!unix) return "—"
  return new Date(unix * 1000).toLocaleDateString("sv-SE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

const ETIKETT = {
  open: { text: "Obetald", klass: "bg-amber-bg/20 text-amber-text" },
  paid: { text: "Betald", klass: "bg-green/10 text-green" },
  void: { text: "Makulerad", klass: "bg-surface-alt text-text-mid" },
  draft: { text: "Utkast", klass: "bg-surface-alt text-text-mid" },
}

export default function AdminFakturor({ token }) {
  const [fakturor, setFakturor] = useState([])
  const [laddar, setLaddar] = useState(false)
  const [fel, setFel] = useState("")
  const [jobbar, setJobbar] = useState(null)
  const [visaNy, setVisaNy] = useState(false)

  const hamta = useCallback(async () => {
    setLaddar(true)
    setFel("")
    try {
      const res = await fetch("/api/admin/fakturor", { headers: { "x-admin-token": token } })
      if (!res.ok) throw new Error("Kunde inte hämta fakturor")
      const data = await res.json()
      setFakturor(data.fakturor)
    } catch (e) {
      setFel(e.message)
    } finally {
      setLaddar(false)
    }
  }, [token])

  useEffect(() => {
    hamta()
  }, [hamta])

  async function atgard(f, vad) {
    if (vad === "makulera" && !confirm(`Makulera ${f.nummer}? Går inte att ångra.`)) return
    setJobbar(f.id)
    try {
      const res = await fetch("/api/admin/fakturor", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-token": token },
        body: JSON.stringify({ fakturaId: f.id, atgard: vad }),
      })
      if (!res.ok) throw new Error((await res.json()).error || "Kunde inte uppdatera")
      await hamta()
    } catch (e) {
      setFel(e.message)
    } finally {
      setJobbar(null)
    }
  }

  const obetalda = fakturor.filter((f) => f.status === "open")

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-xl font-bold text-navy">Förskottsfakturor</h2>
          <p className="mt-1 text-sm text-text-light">
            {obetalda.length} obetalda · bankgiro {BANKGIRO}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setVisaNy(!visaNy)}
            className="rounded-lg bg-navy px-3.5 py-2 font-heading text-sm font-bold text-white"
          >
            {visaNy ? "Stäng" : "Ny faktura"}
          </button>
          <button
            onClick={hamta}
            disabled={laddar}
            className="rounded-lg border border-border bg-white px-3.5 py-2 text-sm font-semibold text-navy disabled:opacity-50"
          >
            {laddar ? "Hämtar…" : "Uppdatera"}
          </button>
        </div>
      </div>

      {fel && <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{fel}</p>}

      {visaNy && (
        <NyFaktura
          token={token}
          onKlar={() => {
            setVisaNy(false)
            hamta()
          }}
        />
      )}

      {!laddar && fakturor.length === 0 && !fel && (
        <p className="mt-6 rounded-xl border border-border bg-white px-5 py-8 text-center text-sm text-text-light">
          Inga fakturor än.
        </p>
      )}

      <ul className="mt-5 space-y-3">
        {fakturor.map((f) => {
          const e = ETIKETT[f.status] || ETIKETT.draft
          return (
            <li key={f.id} className="rounded-xl border border-border bg-white p-5">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <span className="font-mono text-sm font-bold text-navy">{f.nummer}</span>
                <span className={`rounded-md px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${e.klass}`}>
                  {e.text}
                </span>
                {f.forfallen && (
                  <span className="rounded-md bg-red-50 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-red-700">
                    Förfallen
                  </span>
                )}
                <span className="ml-auto font-heading text-sm font-bold text-navy">
                  {kr(f.totalInkl)}
                </span>
              </div>

              <p className="mt-1.5 text-sm text-text-mid">
                {f.foretag || "—"}
                {f.orgnr ? ` · ${f.orgnr}` : ""} · {f.epost || "ingen adress"}
              </p>
              <p className="mt-0.5 text-sm text-text-light">
                Skapad {datum(f.skapad)} · förfaller {datum(f.forfaller)}
                {f.referens ? ` · ref ${f.referens}` : ""}
              </p>

              {f.rader.length > 0 && (
                <ul className="mt-3 space-y-1 border-t border-border pt-3">
                  {f.rader.map((r, n) => (
                    <li key={n} className="flex justify-between gap-4 text-sm text-text-mid">
                      <span>{r.text}</span>
                      <span className="shrink-0">{kr(r.belopp)}</span>
                    </li>
                  ))}
                </ul>
              )}

              {f.status === "open" && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => atgard(f, "betald")}
                    disabled={jobbar === f.id}
                    className="rounded-lg bg-navy px-4 py-2 font-heading text-sm font-bold text-white disabled:opacity-40"
                  >
                    Betalning mottagen
                  </button>
                  <button
                    onClick={() => atgard(f, "makulera")}
                    disabled={jobbar === f.id}
                    className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-text-mid disabled:opacity-40"
                  >
                    Makulera
                  </button>
                </div>
              )}

              {f.status === "paid" && (
                <p className="mt-3 text-sm text-green">
                  Betald. Skicka batteriet och lägg spårningsnumret under fliken Ordrar.
                </p>
              )}
            </li>
          )
        })}
      </ul>

      <p className="mt-6 text-xs leading-relaxed text-text-light">
        Fakturan förfaller efter 10 dagar. Ingen påminnelse skickas automatiskt och
        inget debiteras — betalar kunden inte makulerar du bara. Batteriet ska aldrig
        skickas innan betalningen syns på bankgirot.
      </p>
    </div>
  )
}

function NyFaktura({ token, onKlar }) {
  const [epost, setEpost] = useState("")
  const [foretag, setForetag] = useState("")
  const [orgnr, setOrgnr] = useState("")
  const [referens, setReferens] = useState("")
  const [rader, setRader] = useState([{ slug: publicProducts[0]?.slug || "", antal: 1 }])
  const [skickar, setSkickar] = useState(false)
  const [fel, setFel] = useState("")
  const [klart, setKlart] = useState("")

  function andra(i, falt, varde) {
    setRader((r) => r.map((x, n) => (n === i ? { ...x, [falt]: varde } : x)))
  }

  const total = rader.reduce((s, r) => {
    const p = publicProducts.find((x) => x.slug === r.slug)
    return s + (p ? p.price * (Number(r.antal) || 0) : 0)
  }, 0)

  async function skicka(e) {
    e.preventDefault()
    if (skickar) return
    setSkickar(true)
    setFel("")
    try {
      const res = await fetch("/api/admin/fakturor", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-token": token },
        body: JSON.stringify({
          epost,
          foretag,
          orgnr,
          referens,
          rader: rader.map((r) => ({ slug: r.slug, antal: Number(r.antal) })),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Kunde inte skapa fakturan")
      setKlart(data.varning || `Faktura ${data.nummer} skapad och mejlad.`)
      setTimeout(onKlar, 1600)
    } catch (e) {
      setFel(e.message)
    } finally {
      setSkickar(false)
    }
  }

  if (klart) {
    return (
      <div className="mt-5 rounded-xl border border-border bg-green/5 p-5">
        <p className="text-sm font-semibold text-green">{klart}</p>
      </div>
    )
  }

  return (
    <form onSubmit={skicka} className="mt-5 rounded-xl border border-border bg-white p-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <Falt label="Företag" varde={foretag} satt={setForetag} kravs />
        <Falt label="Organisationsnummer" varde={orgnr} satt={setOrgnr} platshallare="556677-8899" />
        <Falt label="E-post" varde={epost} satt={setEpost} typ="email" kravs />
        <Falt label="Er referens" varde={referens} satt={setReferens} />
      </div>

      <h3 className="mt-5 font-heading text-sm font-bold text-navy">Artiklar</h3>
      <div className="mt-2 space-y-2">
        {rader.map((r, i) => (
          <div key={i} className="flex flex-wrap gap-2">
            <label className="sr-only" htmlFor={`art-${i}`}>
              Artikel {i + 1}
            </label>
            <select
              id={`art-${i}`}
              value={r.slug}
              onChange={(e) => andra(i, "slug", e.target.value)}
              className="min-w-0 flex-1 rounded-lg border border-border bg-white px-3 py-2 text-sm"
            >
              {publicProducts.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.shortName} — {kr(p.price)}
                </option>
              ))}
            </select>
            <label className="sr-only" htmlFor={`ant-${i}`}>
              Antal
            </label>
            <input
              id={`ant-${i}`}
              type="number"
              min="1"
              max="99"
              value={r.antal}
              onChange={(e) => andra(i, "antal", e.target.value)}
              className="w-20 rounded-lg border border-border px-3 py-2 text-sm"
            />
            {rader.length > 1 && (
              <button
                type="button"
                onClick={() => setRader((x) => x.filter((_, n) => n !== i))}
                className="rounded-lg border border-border px-3 py-2 text-sm text-text-mid"
              >
                Ta bort
              </button>
            )}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setRader((r) => [...r, { slug: publicProducts[0].slug, antal: 1 }])}
        className="mt-2 text-sm font-semibold text-accent"
      >
        + Lägg till artikel
      </button>

      <p className="mt-4 border-t border-border pt-3 text-sm text-text-mid">
        Varor inkl. moms: <strong className="text-navy">{kr(total)}</strong>. Frakt 695 kr
        och momsspecifikation läggs till automatiskt på fakturan.
      </p>

      {fel && <p className="mt-3 text-sm text-red-700">{fel}</p>}

      <button
        type="submit"
        disabled={skickar}
        className="mt-4 rounded-lg bg-navy px-5 py-2.5 font-heading text-sm font-bold text-white disabled:opacity-40"
      >
        {skickar ? "Skapar…" : "Skapa och mejla underlaget"}
      </button>
    </form>
  )
}

function Falt({ label, varde, satt, typ = "text", kravs = false, platshallare }) {
  const id = `f-${label.replace(/\s+/g, "-").toLowerCase()}`
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-text-mid">
        {label}
        {kravs && <span aria-hidden="true"> *</span>}
      </label>
      <input
        id={id}
        type={typ}
        required={kravs}
        value={varde}
        placeholder={platshallare}
        onChange={(e) => satt(e.target.value)}
        className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
      />
    </div>
  )
}
