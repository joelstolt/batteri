"use client"

import { useId, useState } from "react"
import Link from "next/link"
import { Minus, Plus, ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useVat } from "@/lib/vat-context"
import { normalizeQuantity, purchaseTotals } from "@/lib/product-purchase"

const money = (value) => new Intl.NumberFormat("sv-SE").format(value)

export function FitGuarantee() {
  return (
    <p className="text-xs leading-relaxed text-text-mid">
      <strong className="text-text-dark">Passformsgaranti utan returavdrag.</strong>{" "}
      Obruten förpackning, aldrig inkopplat och kontakt inom 14 dagar från leveransen.
      Väljer du själv fel modell betalar du returfrakten. Har vi rekommenderat fel
      batteri betalar vi frakten åt båda hållen.{" "}
      <Link href="/villkor#6-passformsgaranti" className="font-semibold text-navy underline underline-offset-2">
        Läs hela passformsgarantin
      </Link>
      .
    </p>
  )
}

export default function ProductPurchase({ product }) {
  const [quantity, setQuantity] = useState(1)
  const id = useId()
  const { addItem, items = [] } = useCart()
  const { displayPrice, vatLabel } = useVat()
  const quote = purchaseTotals(product, quantity)
  const unavailable = product.inStock === false
  const inCart = items.find((item) => item.slug === product.slug)?.qty || 0
  const exceedsLimit = inCart + quote.quantity > 99
  const setClampedQuantity = (value) => setQuantity(normalizeQuantity(value))

  return (
    <section className="mb-5 rounded-2xl border border-navy/15 bg-surface p-4 sm:p-5" aria-label="Välj antal och köp">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-heading text-3xl font-extrabold text-navy">
          {money(displayPrice(product.price))} <span className="text-base font-semibold">kr/st</span>
        </p>
        <span className="text-sm text-text-mid">{vatLabel}</span>
      </div>
      <p className="mt-1 text-xs text-text-mid">
        {unavailable ? "Ej beställningsbar just nu" : "Beställningsbar från leverantör"}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label htmlFor={id} className="text-sm font-semibold text-text-dark">Antal</label>
        <div className="flex rounded-lg border border-border bg-white">
          <button type="button" aria-label="Minska antal" disabled={quote.quantity === 1} onClick={() => setClampedQuantity(quote.quantity - 1)} className="flex h-11 w-10 items-center justify-center rounded-l-lg hover:bg-surface disabled:opacity-40">
            <Minus size={16} aria-hidden="true" />
          </button>
          <input id={id} type="number" inputMode="numeric" min="1" max="99" step="1" value={quantity} onChange={(event) => setQuantity(event.target.value === "" ? "" : normalizeQuantity(event.target.value))} onBlur={(event) => setClampedQuantity(event.target.value)} className="h-11 w-14 border-x border-border bg-white text-center font-heading text-lg font-bold text-navy [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />
          <button type="button" aria-label="Öka antal" disabled={quote.quantity === 99} onClick={() => setClampedQuantity(quote.quantity + 1)} className="flex h-11 w-10 items-center justify-center rounded-r-lg hover:bg-surface disabled:opacity-40">
            <Plus size={16} aria-hidden="true" />
          </button>
        </div>
        <span className="text-xs text-text-mid">1 till 99 st</span>
      </div>
      <div className="mt-3 flex gap-2" role="group" aria-label="Snabbval antal">
        {[1, 2, 4, 6, 8].map((value) => (
          <button key={value} type="button" onClick={() => setClampedQuantity(value)} aria-pressed={quote.quantity === value} className={`min-h-10 flex-1 rounded-lg border px-2 text-sm font-semibold transition-colors ${quote.quantity === value ? "border-navy bg-navy text-white" : "border-border bg-white text-navy hover:border-navy"}`}>
            {value} st
          </button>
        ))}
      </div>
      <div className="mt-4 border-t border-border pt-3 text-sm" aria-live="polite" aria-atomic="true">
        <div className="flex justify-between gap-2 text-text-mid"><span>{quote.quantity} st batterier</span><span>{money(displayPrice(quote.subtotal))} kr</span></div>
        <div className="mt-1 flex justify-between gap-2 text-text-mid"><span>Frakt per order</span><span>{quote.shipping === 0 ? "Fri frakt" : `${money(displayPrice(quote.shipping))} kr`}</span></div>
        <div className="mt-2 flex flex-wrap items-baseline justify-between gap-2 font-bold text-navy">
          <span>Totalt med frakt</span>
          <span className="font-heading text-xl">{money(displayPrice(quote.total))} kr <span className="text-xs font-normal">{vatLabel.toLowerCase()}</span></span>
        </div>
      </div>
      {exceedsLimit && <p role="status" className="mt-3 text-sm font-semibold text-amber-text">Du har redan {inCart} st i varukorgen. Högst 99 st av samma batteri kan beställas per order.</p>}
      <button type="button" disabled={unavailable || exceedsLimit} onClick={() => { if (!unavailable && !exceedsLimit) addItem(product, normalizeQuantity(quantity)) }} className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-amber-bg px-3 py-3 font-heading text-base font-bold text-navy shadow-sm transition-colors hover:bg-amber-bg/85 disabled:cursor-not-allowed disabled:opacity-50">
        <ShoppingCart size={18} aria-hidden="true" />
        {unavailable ? "Ej beställningsbar" : "Lägg i varukorg"}
      </button>
      <div className="mt-3"><FitGuarantee /></div>
    </section>
  )
}
