"use client"

import { useEffect } from "react"
import Link from "next/link"
import { CheckCircle, Truck, Mail } from "lucide-react"
import { useCart } from "@/lib/cart-context"

export default function ThankYouContent() {
  const { clearCart } = useCart()

  // Clear cart after successful payment
  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green/10">
        <CheckCircle size={44} className="text-green" />
      </div>

      <h1 className="mb-3 font-heading text-3xl font-extrabold text-text-dark">
        Tack för din beställning!
      </h1>
      <p className="mb-8 max-w-md text-base text-text-mid">
        Din betalning har genomförts. Du får en orderbekräftelse via e-post inom kort.
      </p>

      <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6 text-left sm:flex-row sm:gap-8">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
            <Mail size={18} className="text-navy" />
          </div>
          <div>
            <div className="text-sm font-bold text-text-dark">Orderbekräftelse</div>
            <div className="text-sm text-text-mid">Skickas till din e-post</div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
            <Truck size={18} className="text-navy" />
          </div>
          <div>
            <div className="text-sm font-bold text-text-dark">Leverans 1–3 dagar</div>
            <div className="text-sm text-text-mid">Spårningsnummer via e-post</div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/"
          className="rounded-xl bg-navy px-6 py-3 font-heading text-sm font-bold text-white transition-colors hover:bg-navy-light"
        >
          Tillbaka till shoppen
        </Link>
        <Link
          href="/kontakt"
          className="rounded-xl border border-border px-6 py-3 font-heading text-sm font-bold text-text-dark transition-colors hover:bg-surface"
        >
          Kontakta oss
        </Link>
      </div>
    </div>
  )
}
