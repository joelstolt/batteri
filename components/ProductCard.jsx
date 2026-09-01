"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useVat } from "@/lib/vat-context"
import { getProductBrand, getProductChemistry } from "@/lib/products"
import { useBetyg } from "@/lib/betyg-context"

export default function ProductCard({ product }) {
  const [qty, setQty] = useState(1)
  const { addItem } = useCart()
  const { displayPrice, vatLabel } = useVat()
  const { slug, shortName, voltage, capacity, price, images, badge } = product
  const betyg = useBetyg(slug)
  const image = images?.[0] || "/produkter/placeholder.jpg"

  const formattedPrice = new Intl.NumberFormat("sv-SE").format(displayPrice(price))

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-white transition-all duration-200 hover:-translate-y-1 hover:border-border-dark hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] sm:rounded-2xl">
      {/* Image area */}
      <Link
        href={`/produkt/${slug}`}
        className="relative block aspect-square overflow-hidden bg-surface"
      >
        <div className="absolute right-2 top-2 z-10 rounded-md bg-navy/80 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm sm:right-3 sm:top-3 sm:px-2 sm:text-[11px]">
          {voltage}
        </div>
        <div className="flex h-full items-center justify-center p-4 transition-transform duration-300 group-hover:scale-105 sm:p-6">
          <div className="relative h-full w-full">
            <Image
              src={image}
              alt={shortName}
              fill
              className="object-contain"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
        </div>
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <Link href={`/produkt/${slug}`}>
          <div className="mb-0.5 hidden text-xs font-medium text-text-mid sm:block">
            {getProductBrand(product)} · {getProductChemistry(product)} · {voltage}
          </div>
          <div className="mb-0.5 font-heading text-sm font-bold text-text-dark transition-colors group-hover:text-amber-text sm:mb-1 sm:text-[17px]">
            {shortName}
          </div>
          <div className="mb-2 text-xs text-text-mid sm:mb-4 sm:text-sm">{capacity}</div>
          {/* Stjärnor bara där det finns riktiga omdömen. Antalet skrivs alltid
              ut — ett betyg ska aldrig se ut som hundra. */}
          {betyg && (
            <div className="-mt-1 mb-2 flex items-center gap-1.5 text-[11px] text-text-mid sm:mb-3 sm:text-xs" aria-label={`${betyg.snitt.toFixed(1)} av 5, ${betyg.antal} omdömen`}>
              <span className="flex gap-px" aria-hidden="true">
                {[1, 2, 3, 4, 5].map((n) => (
                  <svg key={n} width="12" height="12" viewBox="0 0 20 20" fill="currentColor" className={n <= Math.round(betyg.snitt) ? "text-amber-bg" : "text-border-dark"}>
                    <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z" />
                  </svg>
                ))}
              </span>
              <span className="font-semibold text-text-dark">{betyg.snitt.toFixed(1)}</span>
              <span>({betyg.antal})</span>
            </div>
          )}
        </Link>

        {/* Price + actions */}
        <div className="mt-auto">
          <div className="mb-1 flex items-baseline gap-1 sm:mb-2 sm:gap-1.5">
            <span className="font-heading text-base font-extrabold text-text-dark sm:text-xl">
              {formattedPrice}
            </span>
            <span className="text-xs font-medium text-text-mid sm:text-sm">kr</span>
          </div>
          <div className="mb-2 text-[11px] text-text-light sm:mb-3">
            {vatLabel}
          </div>

          {/* In stock badge */}
          <div className="mb-2 hidden items-center gap-1.5 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-green" />
            <span className="text-[11px] font-medium text-green">I lager</span>
          </div>

          {/* Buy button */}
          <button
            onClick={() => addItem(product, qty)}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-navy py-2 text-xs font-bold text-white transition-all hover:bg-navy-light sm:py-2.5 sm:text-sm"
          >
            <ShoppingCart size={14} strokeWidth={2.5} />
            Köp
          </button>
        </div>
      </div>
    </div>
  )
}
