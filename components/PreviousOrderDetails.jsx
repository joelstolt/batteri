"use client"
import { useState } from "react"
import Link from "next/link"
import { detailsFromOrder } from "@/lib/customer-tools"
export default function PreviousOrderDetails({ onSelect }) {
  const [orders, setOrders] = useState(null)
  const [status, setStatus] = useState("")
  async function load() {
    setStatus("Hämtar dina tidigare ordrar...")
    try {
      const res = await fetch("/api/konto/ordrar", { cache: "no-store" })
      if (res.status === 401) {
        setStatus("login")
        return
      }
      const data = await res.json()
      if (!res.ok)
        throw new Error(data.error || "Kunde inte hämta tidigare uppgifter.")
      setOrders(data.ordrar)
      setStatus(data.ordrar.length ? "" : "Inga tidigare uppgifter hittades.")
    } catch (err) {
      setStatus(err.message)
    }
  }
  return (
    <div className="mb-6 rounded-xl border border-border bg-surface p-4 text-sm">
      <button type="button" onClick={load} className="font-semibold underline">
        Hämta företags- och leveransuppgifter från ett tidigare köp
      </button>
      {status === "login" ? (
        <p className="mt-2">
          <Link href="/konto" className="underline">
            Logga in med din beställaradress
          </Link>{" "}
          och återvänd sedan till kassan.
        </p>
      ) : (
        status && (
          <p role="status" className="mt-2">
            {status}
          </p>
        )
      )}
      {orders?.length > 0 && (
        <div className="mt-3 space-y-3">
          <p>
            Välj en order. Uppgifterna ersätter fälten i formuläret. Kontrollera
            adressen och ange ny referens vid behov.
          </p>
          {orders.map((o) => (
            <button
              type="button"
              className="block w-full rounded-lg border border-border bg-white p-3 text-left"
              key={o.id}
              onClick={() => {
                onSelect(detailsFromOrder(o))
                setOrders(null)
                setStatus(
                  `Uppgifter hämtade från ${o.orderId}. Kontrollera dem före köp.`,
                )
              }}
            >
              {o.orderId} · {o.company.name} · {o.delivery.line1},{" "}
              {o.delivery.city}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
