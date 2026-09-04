"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { publicProducts } from "@/lib/products"
import { useCart } from "@/lib/cart-context"
import { trackingUrl } from "@/lib/customer-tools"
import OmdomeFormular from "./OmdomeFormular"

/**
 * Kundkontot.
 *
 * B2B-kunder köper samma batteri om och om igen. Poängen med sidan är inte att
 * visa upp en orderhistorik utan att göra återköpet friktionsfritt: se vad du
 * köpte sist, klicka, klart.
 *
 * Inloggningen är en mejlad länk. Det finns inget lösenord och inget
 * kontoregister — adressen på ordern är kontot.
 */

function kr(n) {
  return new Intl.NumberFormat("sv-SE").format(Math.round(n || 0)) + " kr"
}

function datum(unix) {
  return new Date(unix * 1000).toLocaleDateString("sv-SE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

/**
 * Kopplar en orderrad till en produkt som fortfarande säljs.
 *
 * Ordrar lagda före 2026-07-29 saknar slug i metadatan, så för dem får namnet
 * duga. Hittas ingen produkt går raden inte att beställa om — den kan vara
 * utgången ur sortimentet, och då ska knappen inte finnas.
 */
function hittaProdukt(rad) {
  if (rad.slug) {
    const träff = publicProducts.find((p) => p.slug === rad.slug)
    if (träff) return träff
  }
  if (!rad.name) return null
  return (
    publicProducts.find(
      (p) => p.name === rad.name || p.shortName === rad.name,
    ) || null
  )
}

export default function KontoContent() {
  const params = useSearchParams()
  const [status, setStatus] = useState("laddar")
  const [epost, setEpost] = useState("")
  const [ordrar, setOrdrar] = useState([])
  const [fel, setFel] = useState(
    params.get("fel") === "lank"
      ? "Länken var ogiltig eller har gått ut. Begär en ny."
      : "",
  )

  useEffect(() => {
    let avbruten = false
    ;(async () => {
      try {
        const res = await fetch("/api/konto/ordrar")
        if (avbruten) return
        if (res.status === 401) {
          setStatus("utloggad")
          return
        }
        if (!res.ok) throw new Error("Kunde inte hämta ordrar")
        const data = await res.json()
        if (avbruten) return
        setEpost(data.epost)
        setOrdrar(data.ordrar)
        setStatus("inloggad")
      } catch {
        if (!avbruten) {
          setFel("Kunde inte hämta dina ordrar just nu.")
          setStatus("utloggad")
        }
      }
    })()
    return () => {
      avbruten = true
    }
  }, [])

  async function loggaUt() {
    await fetch("/api/konto/logga-ut", { method: "POST" })
    setStatus("utloggad")
    setOrdrar([])
    setEpost("")
  }

  if (status === "laddar") {
    return (
      <section className="mx-auto max-w-3xl px-5 py-20">
        <p className="text-sm text-text-light">Hämtar…</p>
      </section>
    )
  }

  if (status === "utloggad") {
    return <Inloggning fel={fel} forifylld={params.get("epost") || ""} />
  }

  return (
    <section className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-navy">
            Mina ordrar
          </h1>
          <p className="mt-1.5 text-sm text-text-light">Inloggad som {epost}</p>
        </div>
        <button
          onClick={loggaUt}
          className="rounded-lg border border-border bg-white px-3.5 py-2 text-sm font-semibold text-text-mid"
        >
          Logga ut
        </button>
      </div>

      {ordrar.length === 0 ? (
        <div className="mt-10 rounded-xl border border-border bg-surface/60 px-6 py-12 text-center">
          <p className="font-heading text-base font-bold text-navy">
            Inga ordrar än
          </p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-text-light">
            Har du precis lagt en order kan den dröja någon minut innan den
            dyker upp här.
          </p>
          <Link
            href="/kategori/alla"
            className="mt-5 inline-block rounded-lg bg-navy px-5 py-2.5 font-heading text-sm font-bold text-white"
          >
            Se sortimentet
          </Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {ordrar.map((o) => (
            <OrderKort key={o.id} order={o} />
          ))}
        </ul>
      )}
    </section>
  )
}

function Inloggning({ fel, forifylld }) {
  // Kommer kunden från omdömesmejlet ligger adressen i länken. Ingen token
  // följer med — bara förifyllningen, så ett vidarebefordrat mejl inte blir
  // en inloggning.
  const [epost, setEpost] = useState(forifylld || "")
  const [skickar, setSkickar] = useState(false)
  const [skickat, setSkickat] = useState(false)
  const [felmed, setFelmed] = useState("")

  async function skicka(e) {
    e.preventDefault()
    if (skickar || !epost.trim()) return
    setSkickar(true)
    setFelmed("")
    try {
      const res = await fetch("/api/konto/logga-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ epost: epost.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Kunde inte skicka länken")
      setSkickat(true)
    } catch (e) {
      setFelmed(e.message || "Något gick fel")
    } finally {
      setSkickar(false)
    }
  }

  if (skickat) {
    return (
      <section className="mx-auto max-w-md px-5 py-16 sm:py-24">
        <div className="rounded-2xl border border-border bg-white p-8 text-center">
          <h1 className="font-heading text-2xl font-bold text-navy">
            Kolla mejlen
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-text-mid">
            Har du handlat hos oss med {epost} ligger det en inloggningslänk i
            inkorgen. Den gäller i 15 minuter.
          </p>
          <p className="mt-4 text-sm text-text-light">
            Hittar du inget, kolla skräpposten.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-md px-5 py-16 sm:py-24">
      <div className="rounded-2xl border border-border bg-white p-8">
        <h1 className="font-heading text-2xl font-bold text-navy">
          Mitt konto
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-text-mid">
          Skriv in mejladressen du beställde med, så skickar vi en
          inloggningslänk. Inget lösenord behövs.
        </p>

        {fel && (
          <p className="mt-5 rounded-lg bg-amber-bg/15 px-4 py-3 text-sm text-amber-text">
            {fel}
          </p>
        )}

        <form onSubmit={skicka} className="mt-6">
          <label
            htmlFor="konto-epost"
            className="font-heading text-sm font-semibold text-navy"
          >
            E-postadress
          </label>
          <input
            id="konto-epost"
            type="email"
            required
            autoComplete="email"
            value={epost}
            onChange={(e) => setEpost(e.target.value)}
            placeholder="namn@foretaget.se"
            className="mt-2 w-full rounded-lg border border-border px-3.5 py-3 text-sm"
          />
          {felmed && <p className="mt-2.5 text-sm text-red-700">{felmed}</p>}
          <button
            type="submit"
            disabled={skickar}
            className="mt-4 w-full rounded-lg bg-navy px-4 py-3 font-heading text-sm font-bold text-white disabled:opacity-50"
          >
            {skickar ? "Skickar…" : "Skicka inloggningslänk"}
          </button>
        </form>

        <p className="mt-5 text-xs leading-relaxed text-text-light">
          Frågor om en order? Chatta med oss eller mejla info@batteriproffs.se.
        </p>
      </div>
    </section>
  )
}

function OrderKort({ order }) {
  const [oppen, setOppen] = useState(false)
  const { addItem, setIsOpen } = useCart()
  const [lagtIKorg, setLagtIKorg] = useState(false)
  // Kvitto per artikel direkt efter att omdömet skickats, så kunden inte
  // undrar om det gick fram. Serverns svar hämtas inte om.
  const [nyaOmdomen, setNyaOmdomen] = useState({})

  function omdomeSparat(slug, meddelande) {
    setNyaOmdomen((f) => ({ ...f, [slug]: meddelande }))
  }

  const bestallbara = order.items
    .map((rad) => ({ rad, produkt: hittaProdukt(rad) }))
    .filter((x) => x.produkt && x.produkt.inStock !== false)

  function bestallIgen() {
    for (const { rad, produkt } of bestallbara) {
      addItem(produkt, rad.qty || 1)
    }
    setLagtIKorg(true)
    setIsOpen(true)
  }

  const skickad = order.status === "skickad"

  return (
    <li className="overflow-hidden rounded-xl border border-border bg-white">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm font-bold text-navy">
              {order.orderId}
            </span>
            <span
              className={`rounded-md px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${
                skickad
                  ? "bg-green/10 text-green"
                  : "bg-amber-bg/20 text-amber-text"
              }`}
            >
              {skickad ? "Skickad" : "Behandlas"}
            </span>
            {order.status === "reserverad" && (
              <span className="text-xs text-text-light">
                Beloppet är reserverat och dras när batteriet skickas
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-text-mid">{datum(order.created)}</p>
        </div>
        <div className="text-right">
          <div className="font-heading text-sm font-bold text-navy">
            {kr(order.totalInclVat)}
          </div>
          <button
            onClick={() => setOppen(!oppen)}
            aria-expanded={oppen}
            className="text-xs font-semibold text-accent"
          >
            {oppen ? "Dölj detaljer" : "Visa detaljer"}
          </button>
        </div>
      </div>

      {order.tracking && (
        <div className="border-t border-border bg-green/5 px-5 py-3 text-sm">
          <span className="text-text-mid">
            {order.tracking.carrier} ·{" "}
            <span className="font-mono font-semibold text-text-dark">
              {trackingUrl(order.tracking.carrier, order.tracking.number) ? (
                <a
                  href={trackingUrl(
                    order.tracking.carrier,
                    order.tracking.number,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Spåra {order.tracking.number}
                </a>
              ) : (
                order.tracking.number
              )}
            </span>
          </span>
        </div>
      )}

      {oppen && (
        <div className="border-t border-border bg-surface/50 px-5 py-5">
          {order.items.length === 0 ? (
            <p className="text-sm text-text-light">
              Raderna finns inte sparade på den här ordern. Mejla oss så tar vi
              fram dem.
            </p>
          ) : (
            <ul className="space-y-3">
              {order.items.map((rad, n) => {
                const befintligt = order.omdomen?.find(
                  (o) => o.slug === rad.slug,
                )
                const nyss = nyaOmdomen[rad.slug]
                return (
                  <li key={n} className="text-sm">
                    <div className="flex justify-between gap-4">
                      <span className="text-text-dark">
                        {rad.qty} ×{" "}
                        {rad.name || hittaProdukt(rad)?.name || "Produkt"}
                      </span>
                      <span className="shrink-0 font-semibold text-navy">
                        {kr(rad.price * rad.qty)}
                      </span>
                    </div>
                    {rad.slug && (
                      <div className="mt-1">
                        {nyss ? (
                          <p className="text-sm text-green">{nyss}</p>
                        ) : befintligt ? (
                          <p className="text-xs text-text-light">
                            {befintligt.status === "g"
                              ? "Ditt omdöme är publicerat. Tack!"
                              : befintligt.status === "n"
                                ? "Ditt omdöme publicerades inte. Mejla oss om du undrar varför."
                                : "Ditt omdöme granskas."}
                          </p>
                        ) : (
                          <OmdomeFormular
                            order={order}
                            rad={rad}
                            onKlar={omdomeSparat}
                          />
                        )}
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
          {order.struknaRader > 0 && (
            <p className="mt-2 text-sm text-text-light">
              + {order.struknaRader} rader till. Mejla oss så läser vi upp hela
              ordern.
            </p>
          )}

          <div className="mt-3 space-y-1 border-t border-border pt-3 text-sm">
            <div className="flex justify-between text-text-mid">
              <span>Frakt exkl. moms</span>
              <span>
                {order.shipping === 0 ? "Fri frakt" : kr(order.shipping)}
              </span>
            </div>
            <div className="flex justify-between font-heading font-bold text-navy">
              <span>Totalt inkl. moms</span>
              <span>{kr(order.totalInclVat)}</span>
            </div>
          </div>

          {(order.delivery.line1 || order.company.name) && (
            <div className="mt-4 border-t border-border pt-3 text-sm text-text-mid">
              {order.company.name && <div>{order.company.name}</div>}
              {order.delivery.line1 && <div>{order.delivery.line1}</div>}
              {(order.delivery.postalCode || order.delivery.city) && (
                <div>
                  {order.delivery.postalCode} {order.delivery.city}
                </div>
              )}
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-4 text-sm font-semibold">
            <Link
              className="underline"
              href={`/konto/order/${encodeURIComponent(order.id)}`}
            >
              Visa och skriv ut orderunderlag
            </Link>
            <Link
              className="underline"
              href={`/kontakt?order=${encodeURIComponent(order.orderId)}`}
            >
              Fråga om ordern
            </Link>
            <ReturnRequest order={order} />
          </div>
          {bestallbara.length > 0 && (
            <div className="mt-5 border-t border-border pt-4">
              <button
                onClick={bestallIgen}
                className="w-full rounded-lg bg-navy px-4 py-3 font-heading text-sm font-bold text-white sm:w-auto sm:px-6"
              >
                {lagtIKorg ? "Lagt i varukorgen" : "Beställ igen"}
              </button>
              {bestallbara.length < order.items.length && (
                <p className="mt-2 text-xs text-text-light">
                  Bara {bestallbara.length} av {order.items.length}{" "}
                  {order.items.length === 1 ? "rad" : "rader"} går att beställa
                  om. Resten finns inte kvar i sortimentet, mejla oss så löser
                  vi det.
                </p>
              )}
              <p className="mt-2 text-xs text-text-light">
                Priset som gäller är dagens, inte priset på den här ordern.
              </p>
            </div>
          )}
        </div>
      )}
    </li>
  )
}

function ReturnRequest({ order }) {
  const [index, setIndex] = useState(0)
  const [reason, setReason] = useState("reklamation")
  const item = order.items[index]
  const params = new URLSearchParams({
    order: order.orderId,
    arende: "retur",
    orsak: reason,
  })
  if (item) {
    params.set("artikel", item.name || item.slug || "Artikel")
    params.set("antal", String(item.qty))
  }
  return (
    <details className="w-full rounded-lg border border-border p-3">
      <summary className="cursor-pointer">Retur eller reklamation</summary>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-normal">
          Artikel
          <select
            value={index}
            onChange={(e) => setIndex(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-border bg-white p-2"
          >
            {order.items.map((r, i) => (
              <option key={i} value={i}>
                {r.qty} st {r.name || r.slug}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-normal">
          Ärende
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-white p-2"
          >
            <option value="reklamation">Fel på produkten</option>
            <option value="transportskada">Transportskada</option>
            <option value="felartikel">Fel artikel levererad</option>
            <option value="retur">Fråga om retur</option>
          </select>
        </label>
      </div>
      <p className="my-3 text-xs font-normal text-text-mid">
        Vi tar med order och vald artikel till kontaktformuläret. Beskriv
        ärendet där. En förfrågan innebär inte att en retur är godkänd.
      </p>
      <Link href={`/kontakt?${params}`} className="underline">
        Fortsätt till förfrågan
      </Link>
    </details>
  )
}
