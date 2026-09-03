"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart-context"
import { track } from "@/lib/track"

/**
 * Lägger tillbaka varukorgen ur påminnelsemejlet och skickar kunden till
 * kassan. Raderna är redan validerade mot produktdatan på servern.
 *
 * `clearCart` först: kunden kan ha en annan korg i webbläsaren sedan dess, och
 * att slå ihop två korgar ger dubbla batterier i kassan. Mejlets korg vinner,
 * det är den kunden klickade på.
 */
export default function AterstallContent({ items = [], redanBetald = false }) {
  const { addItem, clearCart } = useCart()
  const router = useRouter()
  const [fel, setFel] = useState(false)
  const kord = useRef(false)

  useEffect(() => {
    if (kord.current || redanBetald) return
    kord.current = true

    if (items.length === 0) {
      setFel(true)
      track("kassa-aterstalld", { rader: 0, resultat: "tom" })
      return
    }

    clearCart()
    for (const rad of items) {
      const { qty, ...produkt } = rad
      addItem(produkt, qty)
    }
    track("kassa-aterstalld", { rader: items.length, resultat: "ok" })
    // Kort paus så localStorage hunnit skrivas innan navigeringen.
    const t = setTimeout(() => router.push("/kassa"), 400)
    return () => clearTimeout(t)
  }, [items, redanBetald, addItem, clearCart, router])

  if (redanBetald) {
    return (
      <section className="mx-auto max-w-lg px-5 py-20 text-center">
        <h1 className="font-heading text-2xl font-bold text-navy">Ordern är redan lagd</h1>
        <p className="mt-3 text-sm leading-relaxed text-text-mid">
          Den här varukorgen blev en order, så det finns inget att slutföra.
          Dina ordrar och leveransstatus hittar du under ditt konto.
        </p>
        <Link
          href="/konto"
          className="mt-6 inline-block rounded-lg bg-navy px-5 py-3 text-sm font-bold text-white"
        >
          Till mitt konto
        </Link>
      </section>
    )
  }

  if (fel) {
    return (
      <section className="mx-auto max-w-lg px-5 py-20 text-center">
        <h1 className="font-heading text-2xl font-bold text-navy">
          Varukorgen gick inte att lägga tillbaka
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-text-mid">
          Länken är för gammal eller produkterna har ändrats sedan dess. Säg
          till i chatten vilken maskin det gäller, så plockar vi fram rätt
          batteri åt dig.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-navy px-5 py-3 text-sm font-bold text-white"
        >
          Till startsidan
        </Link>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-lg px-5 py-20 text-center">
      <h1 className="font-heading text-2xl font-bold text-navy">Lägger tillbaka din varukorg</h1>
      <p className="mt-3 text-sm text-text-mid">Ett ögonblick, du skickas till kassan.</p>
    </section>
  )
}
