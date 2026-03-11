"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import QuantitySelector from "./QuantitySelector"

export default function ProductCard({ product }) {
  const [qty, setQty] = useState(1)
  const { addItem } = useCart()
  const { slug, shortName, voltage, capacity, price, images, badge } = product
  const image = images?.[0] || "/produkter/placeholder.jpg"

  const formattedPrice = new Intl.NumberFormat("sv-SE").format(price)

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white transition-all duration-250 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
      {/* Image area */}
      <Link
        href={`/produkt/${slug}`}
        className="relative block aspect-square overflow-hidden bg-surface"
      >
        {/* Badge */}
        {badge && (
          <div className="absolute left-3 top-3 z-10 rounded-md bg-amber-bg px-2.5 py-1 text-[11px] font-bold text-navy">
            {badge}
          </div>
        )}

        {/* Voltage tag */}
        <div className="absolute right-3 top-3 z-10 rounded-md bg-navy/80 px-2 py-0.5 text-[11px] font-bold text-white backdrop-blur-sm">
          {voltage}
        </div>

        {/* Product image */}
        <div className="flex h-full items-center justify-center p-6 transition-transform duration-300 group-hover:scale-105">
          <div className="relative h-full w-full">
            <Image
              src={image}
              alt={shortName}
              fill
              className="object-contain"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        </div>
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col p-5">
        <Link href={`/produkt/${slug}`}>
          <div className="mb-1 text-xs font-medium text-text-mid">
            Sonnenschein · Gel · {voltage}
          </div>
          <h3 className="mb-1 font-heading text-[17px] font-bold text-text-dark transition-colors group-hover:text-accent">
            {shortName}
          </h3>
          <div className="mb-4 text-sm text-text-mid">{capacity}</div>
        </Link>

        {/* Price + actions — pushed to bottom */}
        <div className="mt-auto">
          <div className="mb-3 flex items-baseline gap-1.5">
            <span className="font-heading text-xl font-extrabold text-text-dark">
              {formattedPrice}
            </span>
            <span className="text-sm font-medium text-text-mid">kr</span>
            <span className="ml-1 text-xs text-text-mid">exkl. moms</span>
          </div>

          <div className="flex items-center gap-2">
            <QuantitySelector onChange={setQty} />
            <button
              onClick={() => addItem(product, qty)}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-navy px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-navy-light"
            >
              <ShoppingCart size={15} strokeWidth={2.5} />
              Köp
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
