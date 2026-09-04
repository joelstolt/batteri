"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
const kr = (n) =>
  Number(n).toLocaleString("sv-SE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) + " kr"
export default function OrderDocument({ id }) {
  const [order, setOrder] = useState(null)
  const [error, setError] = useState("")
  useEffect(() => {
    const abort = new AbortController()
    fetch("/api/konto/ordrar", { cache: "no-store", signal: abort.signal })
      .then(async (res) => {
        if (!res.ok)
          throw new Error(
            res.status === 401
              ? "Logga in för att se ditt orderunderlag."
              : "Kunde inte hämta orderunderlaget.",
          )
        const data = await res.json()
        const ownOrder = data.ordrar.find((o) => o.id === id)
        if (!ownOrder) throw new Error("Ordern hittades inte på ditt konto.")
        setOrder(ownOrder)
      })
      .catch((e) => {
        if (e.name !== "AbortError") setError(e.message)
      })
    return () => abort.abort()
  }, [id])
  if (!order)
    return (
      <section className="mx-auto max-w-3xl px-5 py-16">
        <p role="status">{error || "Hämtar orderunderlag..."}</p>
        <Link href="/konto" className="mt-4 block underline">
          Till mitt konto
        </Link>
      </section>
    )
  return (
    <article className="order-document mx-auto max-w-3xl px-5 py-12 text-text-dark">
      <style>{`@media print { body * { visibility: hidden; } .order-document, .order-document * { visibility: visible; } .order-document { position: absolute; left: 0; top: 0; width: 100%; max-width: none; } .order-document .no-print, .order-document .no-print * { display: none; } }`}</style>
      <div className="no-print mb-8 flex gap-5">
        <Link href="/konto" className="underline">
          Till mina ordrar
        </Link>
        <button
          onClick={() => window.print()}
          className="font-semibold underline"
        >
          Skriv ut / spara som PDF
        </button>
      </div>
      <p className="font-bold">Batteriproffs</p>
      <h1 className="mt-3 text-2xl font-bold">
        Ordersammanställning {order.orderId}
      </h1>
      <p className="mt-3">
        {new Date(order.created * 1000).toLocaleDateString("sv-SE")} ·{" "}
        {order.status === "reserverad"
          ? "Belopp reserverat, ännu inte debiterat"
          : order.status === "skickad"
            ? "Betald och skickad"
            : "Betald"}
      </p>
      <p className="mt-3 text-sm">
        Ordersammanställning för ditt inköpsunderlag. Detta dokument är ingen
        faktura eller betalningsuppmaning. Eventuella senare återbetalningar
        framgår inte här.
      </p>
      <h2 className="mt-8 font-bold">Köpare och leverans</h2>
      <p>
        {order.company.name} · {order.company.orgNr}
      </p>
      <p>{order.customer.name}</p>
      <p>
        {order.delivery.line1}, {order.delivery.postalCode}{" "}
        {order.delivery.city}
      </p>
      {order.company.reference && <p>Referens: {order.company.reference}</p>}
      {order.company.poNumber && <p>Inköpsordernr: {order.company.poNumber}</p>}
      <table className="my-8 w-full text-left text-sm">
        <thead>
          <tr>
            <th className="py-3">Artikel</th>
            <th>Antal</th>
            <th className="text-right">Summa inkl. moms</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((r, i) => (
            <tr className="border-t border-border" key={i}>
              <td className="py-3">{r.name}</td>
              <td>{r.qty}</td>
              <td className="text-right">{kr(r.price * r.qty)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {(order.incompleteItems ||
        order.struknaRader > 0 ||
        !order.items.length) && (
        <p>
          Det här äldre orderunderlaget saknar kompletta artikelrader. Kontakta
          oss för fullständigt underlag.
        </p>
      )}
      <p>Frakt exkl. moms: {kr(order.shipping)}</p>
      <p className="mt-2 text-lg font-bold">
        Ordersumma inkl. moms: {kr(order.totalInclVat)}
      </p>
    </article>
  )
}
