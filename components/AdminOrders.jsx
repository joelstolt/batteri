"use client"

import { useCallback, useEffect, useState } from "react"

/**
 * Adminvy för ordrar.
 *
 * Ordrarna ligger i Stripe och hämtas via /api/admin/orders. Innan den här
 * fanns gick de bara att se i Stripes dashboard eller i orderbekräftelsen, och
 * spårningsmejlet krävde en handknackad curl med rätt header.
 *
 * Token sparas i sessionStorage, inte localStorage: den ligger kvar mellan
 * sidladdningar men försvinner när fliken stängs. Den skickas alltid som
 * header, aldrig i URL:en — query-strängar hamnar i loggar och historik.
 */

const TOKEN_NYCKEL = "bp-admin-token"

function kr(n) {
  return new Intl.NumberFormat("sv-SE").format(Math.round(n || 0)) + " kr"
}

function datum(unix) {
  return new Date(unix * 1000).toLocaleString("sv-SE", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function AdminOrders() {
  const [token, setToken] = useState(null)
  const [tokenFalt, setTokenFalt] = useState("")
  const [ordrar, setOrdrar] = useState([])
  const [merFinns, setMerFinns] = useState(false)
  const [sistaId, setSistaId] = useState(null)
  const [laddar, setLaddar] = useState(false)
  const [fel, setFel] = useState("")
  const [oppen, setOppen] = useState(null)

  // Läses först i effekten. sessionStorage finns inte under serverrenderingen,
  // och läses den under render blir första klientrenderingen en annan än
  // serverns, vilket ger ett hydreringsfel.
  useEffect(() => {
    try {
      const sparad = sessionStorage.getItem(TOKEN_NYCKEL)
      if (sparad) setToken(sparad)
    } catch {}
  }, [])

  const hamta = useCallback(
    async (efter = null) => {
      if (!token) return
      setLaddar(true)
      setFel("")
      try {
        const url = efter
          ? `/api/admin/orders?efter=${encodeURIComponent(efter)}`
          : "/api/admin/orders"
        const res = await fetch(url, { headers: { "x-admin-token": token } })

        if (res.status === 401) {
          // Fel token. Kasta den så inloggningen kommer tillbaka i stället för
          // att sidan står och ser trasig ut.
          try {
            sessionStorage.removeItem(TOKEN_NYCKEL)
          } catch {}
          setToken(null)
          setFel("Fel token.")
          return
        }
        if (!res.ok) throw new Error("Kunde inte hämta ordrar")

        const data = await res.json()
        setOrdrar((tidigare) => (efter ? [...tidigare, ...data.ordrar] : data.ordrar))
        setMerFinns(data.merFinns)
        setSistaId(data.sistaId)
      } catch (e) {
        setFel(e.message || "Något gick fel")
      } finally {
        setLaddar(false)
      }
    },
    [token]
  )

  useEffect(() => {
    if (token) hamta()
  }, [token, hamta])

  function loggaIn(e) {
    e.preventDefault()
    const t = tokenFalt.trim()
    if (!t) return
    try {
      sessionStorage.setItem(TOKEN_NYCKEL, t)
    } catch {}
    setToken(t)
    setTokenFalt("")
  }

  function loggaUt() {
    try {
      sessionStorage.removeItem(TOKEN_NYCKEL)
    } catch {}
    setToken(null)
    setOrdrar([])
    setOppen(null)
  }

  /** Flippar en order till skickad lokalt, så badgen uppdateras direkt. */
  function markeraSkickad(id, tracking, carrier) {
    setOrdrar((tidigare) =>
      tidigare.map((o) =>
        o.id === id
          ? {
              ...o,
              status: "skickad",
              tracking: { number: tracking, carrier, shippedAt: Date.now() / 1000 },
            }
          : o
      )
    )
  }

  if (!token) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md items-center px-5">
        <form
          onSubmit={loggaIn}
          className="w-full rounded-2xl border border-border bg-white p-7"
        >
          <h1 className="font-heading text-xl font-bold text-navy">Batteriproffs admin</h1>
          <p className="mt-1.5 text-sm text-text-light">
            Klistra in admin-token för att se ordrarna.
          </p>
          <label htmlFor="token" className="sr-only">
            Admin-token
          </label>
          <input
            id="token"
            type="password"
            value={tokenFalt}
            onChange={(e) => setTokenFalt(e.target.value)}
            autoComplete="off"
            className="mt-5 w-full rounded-lg border border-border px-3.5 py-2.5 font-mono text-sm"
            placeholder="ADMIN_TOKEN"
          />
          {fel && <p className="mt-2.5 text-sm text-red-700">{fel}</p>}
          <button
            type="submit"
            className="mt-4 w-full rounded-lg bg-navy px-4 py-2.5 font-heading text-sm font-bold text-white"
          >
            Visa ordrar
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-navy">Ordrar</h1>
          <p className="mt-1 text-sm text-text-light">
            {ordrar.length} {ordrar.length === 1 ? "order" : "ordrar"} · direkt ur Stripe
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => hamta()}
            disabled={laddar}
            className="rounded-lg border border-border bg-white px-3.5 py-2 text-sm font-semibold text-navy disabled:opacity-50"
          >
            {laddar ? "Hämtar…" : "Uppdatera"}
          </button>
          <button
            onClick={loggaUt}
            className="rounded-lg border border-border bg-white px-3.5 py-2 text-sm font-semibold text-text-mid"
          >
            Logga ut
          </button>
        </div>
      </div>

      {fel && (
        <p className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{fel}</p>
      )}

      {!laddar && ordrar.length === 0 && !fel && (
        <p className="mt-8 rounded-xl border border-border bg-white px-5 py-8 text-center text-sm text-text-light">
          Inga genomförda ordrar än.
        </p>
      )}

      <ul className="mt-6 space-y-3">
        {ordrar.map((o) => (
          <li key={o.id} className="overflow-hidden rounded-xl border border-border bg-white">
            <button
              onClick={() => setOppen(oppen === o.id ? null : o.id)}
              aria-expanded={oppen === o.id}
              className="flex w-full items-center gap-4 px-5 py-4 text-left"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-sm font-bold text-navy">{o.orderId}</span>
                  <StatusBadge status={o.status} />
                </div>
                <p className="mt-1 truncate text-sm text-text-mid">
                  {o.company.name || o.customer.name || "Okänd köpare"} · {datum(o.created)}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <div className="font-heading text-sm font-bold text-navy">
                  {kr(o.totalInclVat)}
                </div>
                <div className="text-xs text-text-light">
                  {oppen === o.id ? "Dölj" : "Visa"}
                </div>
              </div>
            </button>

            {oppen === o.id && (
              <OrderDetalj order={o} token={token} onSkickad={markeraSkickad} />
            )}
          </li>
        ))}
      </ul>

      {merFinns && (
        <button
          onClick={() => hamta(sistaId)}
          disabled={laddar}
          className="mt-6 w-full rounded-lg border border-border bg-white px-4 py-3 text-sm font-semibold text-navy disabled:opacity-50"
        >
          {laddar ? "Hämtar…" : "Ladda fler"}
        </button>
      )}
    </div>
  )
}

function StatusBadge({ status }) {
  const skickad = status === "skickad"
  return (
    <span
      className={`rounded-md px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${
        skickad ? "bg-green/10 text-green" : "bg-amber-bg/20 text-amber-text"
      }`}
    >
      {skickad ? "Skickad" : "Betald"}
    </span>
  )
}

function OrderDetalj({ order, token, onSkickad }) {
  const [tracking, setTracking] = useState(order.tracking?.number || "")
  const [carrier, setCarrier] = useState(order.tracking?.carrier || "PostNord")
  const [skickar, setSkickar] = useState(false)
  const [resultat, setResultat] = useState("")
  const [felmed, setFelmed] = useState("")

  async function skickaSparning(e) {
    e.preventDefault()
    if (!tracking.trim() || skickar) return
    setSkickar(true)
    setResultat("")
    setFelmed("")
    try {
      const res = await fetch("/api/order/ship", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-token": token },
        body: JSON.stringify({
          paymentIntentId: order.id,
          tracking: tracking.trim(),
          carrier,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Kunde inte skicka")

      onSkickad(order.id, tracking.trim(), carrier)
      setResultat(data.varning || `Spårningsmejl skickat till ${order.customer.email}.`)
    } catch (e) {
      setFelmed(e.message || "Något gick fel")
    } finally {
      setSkickar(false)
    }
  }

  return (
    <div className="border-t border-border bg-surface/60 px-5 py-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Block titel="Köpare">
          <Rad label="Företag" varde={order.company.name} />
          <Rad label="Orgnr" varde={order.company.orgNr} />
          <Rad label="Momsnr" varde={order.company.vatNr} />
          <Rad label="Kontakt" varde={order.customer.name} />
          <Rad label="E-post" varde={order.customer.email} />
          <Rad label="Telefon" varde={order.customer.phone} />
          <Rad label="Referens" varde={order.company.reference} />
          <Rad label="Ordernr hos kund" varde={order.company.poNumber} />
          <Rad label="Fakturamejl" varde={order.company.invoiceEmail} />
        </Block>

        <Block titel="Leverans">
          <Rad label="Mottagare" varde={order.delivery.name} />
          <Rad label="Adress" varde={order.delivery.line1} />
          <Rad
            label="Postort"
            varde={[order.delivery.postalCode, order.delivery.city].filter(Boolean).join(" ")}
          />
          <Rad label="Telefon" varde={order.delivery.phone} />
          <Rad label="Lossning" varde={order.delivery.unloading} />
          <Rad
            label="Kort"
            varde={
              order.card.brand ? `${order.card.brand} ···· ${order.card.last4}` : ""
            }
          />
        </Block>
      </div>

      <div className="mt-5">
        <h3 className="font-heading text-xs font-bold uppercase tracking-wide text-text-light">
          Rader
        </h3>
        {order.items.length === 0 ? (
          <p className="mt-2 text-sm text-text-light">
            Raderna kunde inte läsas. Stripe kapar metadata vid 500 tecken — se ordern
            i Stripe.
          </p>
        ) : (
          <ul className="mt-2 space-y-1.5">
            {order.items.map((i, n) => (
              <li key={n} className="flex justify-between gap-4 text-sm">
                <span className="text-text-dark">
                  {i.qty} × {i.name}
                </span>
                <span className="shrink-0 font-semibold text-navy">{kr(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-3 space-y-1 border-t border-border pt-3 text-sm">
          <div className="flex justify-between text-text-mid">
            <span>Varor exkl. moms</span>
            <span>{kr(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-text-mid">
            <span>Frakt exkl. moms</span>
            <span>{kr(order.shipping)}</span>
          </div>
          <div className="flex justify-between font-heading font-bold text-navy">
            <span>Totalt inkl. moms</span>
            <span>{kr(order.totalInclVat)}</span>
          </div>
        </div>
      </div>

      <form onSubmit={skickaSparning} className="mt-5 border-t border-border pt-5">
        <h3 className="font-heading text-xs font-bold uppercase tracking-wide text-text-light">
          {order.status === "skickad" ? "Skicka om spårningsmejl" : "Skicka spårningsmejl"}
        </h3>
        {order.tracking?.shippedAt && (
          <p className="mt-1.5 text-sm text-text-mid">
            Skickad {datum(order.tracking.shippedAt)} med {order.tracking.carrier} ·{" "}
            <span className="font-mono">{order.tracking.number}</span>
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          <label htmlFor={`tracking-${order.id}`} className="sr-only">
            Spårningsnummer
          </label>
          <input
            id={`tracking-${order.id}`}
            value={tracking}
            onChange={(e) => setTracking(e.target.value)}
            placeholder="Spårningsnummer"
            className="min-w-0 flex-1 rounded-lg border border-border px-3.5 py-2.5 font-mono text-sm"
          />
          <label htmlFor={`carrier-${order.id}`} className="sr-only">
            Transportör
          </label>
          <select
            id={`carrier-${order.id}`}
            value={carrier}
            onChange={(e) => setCarrier(e.target.value)}
            className="rounded-lg border border-border bg-white px-3 py-2.5 text-sm"
          >
            <option>PostNord</option>
            <option>DHL</option>
            <option>Schenker</option>
          </select>
          <button
            type="submit"
            disabled={skickar || !tracking.trim()}
            className="rounded-lg bg-navy px-4 py-2.5 font-heading text-sm font-bold text-white disabled:opacity-40"
          >
            {skickar ? "Skickar…" : "Skicka"}
          </button>
        </div>
        {resultat && <p className="mt-2.5 text-sm text-green">{resultat}</p>}
        {felmed && <p className="mt-2.5 text-sm text-red-700">{felmed}</p>}
        <p className="mt-2.5 text-xs text-text-light">
          Mejlet går till {order.customer.email || "— ingen adress på ordern"}. Länken i
          mejlet fungerar bara för PostNord och DHL.
        </p>
      </form>
    </div>
  )
}

function Block({ titel, children }) {
  return (
    <div>
      <h3 className="font-heading text-xs font-bold uppercase tracking-wide text-text-light">
        {titel}
      </h3>
      <dl className="mt-2 space-y-1">{children}</dl>
    </div>
  )
}

/** Tomma fält döljs helt — en lista full av tomma rader är svårare att läsa. */
function Rad({ label, varde }) {
  if (!varde) return null
  return (
    <div className="flex gap-2 text-sm">
      <dt className="w-32 shrink-0 text-text-light">{label}</dt>
      <dd className="min-w-0 break-words text-text-dark">{varde}</dd>
    </div>
  )
}
