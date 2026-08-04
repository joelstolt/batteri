"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Truck, Shield, Phone, ChevronRight, RotateCcw } from "lucide-react"
import { getProductBySlug, getProductsByCategory, getProductBrand, getProductChemistry } from "@/lib/products"
import { CATEGORIES, PHONE, PHONE_LINK } from "@/lib/constants"
import { machinesForProduct } from "@/lib/machines"
import { slugifyModel } from "@/lib/replacements"
import { useCart } from "@/lib/cart-context"
import { useVat } from "@/lib/vat-context"
import ProductCard from "@/components/ProductCard"
import FadeIn from "@/components/FadeIn"

function formatPrice(n) {
  return new Intl.NumberFormat("sv-SE").format(n)
}

function ImageGallery({ images, alt }) {
  const [active, setActive] = useState(0)

  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:gap-4">
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto sm:w-20 sm:flex-shrink-0 sm:flex-col sm:overflow-visible"
          tabIndex={0}
          role="group"
          aria-label="Produktbilder">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative aspect-square overflow-hidden rounded-lg border-2 bg-white transition-all ${
                active === i
                  ? "border-navy shadow-sm"
                  : "border-border hover:border-border-dark"
              }`}
            >
              <Image
                src={img}
                alt={`${alt} - bild ${i + 1}`}
                fill
                className="object-contain p-1.5"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main image */}
      <div className="relative flex-1 aspect-square overflow-hidden rounded-2xl border border-border bg-white">
        <div className="flex h-full items-center justify-center p-8">
          <div className="relative h-full w-full">
            <Image
              src={images[active]}
              alt={alt}
              fill
              className="object-contain"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductExtraInfo({ product, className = "" }) {
  if (!product.fitsTo && !product.recommendedCharger) return null

  return (
    <div className={`space-y-5 ${className}`}>
      {product.fitsTo && (
        <div className="rounded-xl border border-border bg-surface p-5">
          <h2 className="mb-2 font-heading text-sm font-bold uppercase tracking-wider text-text-dark">
            Passar till
          </h2>
          <p className="text-sm leading-relaxed text-text-mid">{product.fitsTo}</p>

          {/* Länkar till maskinsidorna — gör klustret dubbelriktat i stället för
              att bara peka nedåt från navet */}
          {machinesForProduct(product.slug).length > 0 && (
            <div className="mt-4 border-t border-border pt-4">
              <div className="mb-2 text-xs font-semibold text-text-mid">
                Se batteriet till en specifik maskin
              </div>
              <div className="flex flex-wrap gap-2">
                {machinesForProduct(product.slug).map((m) => (
                  <Link
                    key={m.slug}
                    href={`/batteri-till/${m.slug}`}
                    className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-medium text-text-dark transition-colors hover:border-navy/40"
                  >
                    {m.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {product.specs?.["Ersätter"] && (
        <div className="rounded-xl border border-border bg-surface p-5">
          <h2 className="mb-2 font-heading text-sm font-bold uppercase tracking-wider text-text-dark">
            Ersätter
          </h2>
          <p className="text-sm leading-relaxed text-text-mid">
            Batteriet är en direkt ersättare för{" "}
            <Link
              href={`/ersatter/${slugifyModel(product.specs["Ersätter"])}`}
              className="font-semibold text-navy hover:underline"
            >
              {product.specs["Ersätter"]}
            </Link>
            .
          </p>
        </div>
      )}
      {product.recommendedCharger && (
        <div className="rounded-xl border border-border bg-surface p-5">
          <h2 className="mb-2 font-heading text-sm font-bold uppercase tracking-wider text-text-dark">
            Rekommenderad laddare
          </h2>
          <p className="text-sm leading-relaxed text-text-mid">{product.recommendedCharger}</p>
          <Link
            href="/laddare"
            className="mt-3 inline-block text-sm font-semibold text-navy hover:underline"
          >
            Så väljer du rätt laddare →
          </Link>
        </div>
      )}

      {/* Bara öppna blybatterier ska vattenfyllas — gel och AGM är förseglade */}
      {/öppet|ventilerat/i.test(product.specs?.["Typ"] || "") && (
        <div className="rounded-xl border border-border bg-surface p-5">
          <h2 className="mb-2 font-heading text-sm font-bold uppercase tracking-wider text-text-dark">
            Underhåll
          </h2>
          <p className="text-sm leading-relaxed text-text-mid">
            Det här är ett öppet blybatteri och behöver påfyllning av destillerat
            vatten var fjärde till sjätte vecka vid daglig drift.
          </p>
          <Link
            href="/batterivatten"
            className="mt-3 inline-block text-sm font-semibold text-navy hover:underline"
          >
            Guide till batterivatten →
          </Link>
        </div>
      )}
    </div>
  )
}

function ExpandableDescription({ description }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="mb-6">
      <h2 className="mb-2 font-heading text-sm font-bold uppercase tracking-wider text-text-mid">
            Beskrivning
          </h2>
      <div className="relative">
        <div
          className={`text-sm leading-relaxed text-text-mid whitespace-pre-line overflow-hidden transition-[max-height] duration-300 ease-in-out ${expanded ? "max-h-[2000px]" : "max-h-[3.75em]"}`}
        >
          {description}
        </div>
        {!expanded && (
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent" />
        )}
      </div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-1 text-sm font-semibold text-navy hover:underline"
      >
        {expanded ? "Visa mindre" : "Läs mer"}
      </button>
    </div>
  )
}

export default function ProductPageContent() {
  const params = useParams()
  const product = getProductBySlug(params.slug)
  const [qty, setQty] = useState(1)
  const { addItem } = useCart()
  const { displayPrice, vatLabel, inclVat } = useVat()

  if (!product) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="mb-2 font-heading text-2xl font-bold text-text-dark">
            Produkten hittades inte
          </h1>
          <Link href="/" className="text-amber-text underline">
            Tillbaka till startsidan
          </Link>
        </div>
      </div>
    )
  }

  const category = CATEGORIES.find((c) => c.slug === product.category)
  const related = getProductsByCategory(product.category)
    .filter((p) => p.slug !== product.slug)
    .slice(0, 4)

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-[1200px] px-4 py-3 sm:px-6">
          <nav className="flex items-center gap-2 text-sm text-text-mid">
            <Link href="/" className="transition-colors hover:text-text-dark">Hem</Link>
            <ChevronRight size={12} className="text-border-dark" />
            {category && (
              <>
                <Link href={`/kategori/${category.slug}`} className="transition-colors hover:text-text-dark">
                  {category.title}
                </Link>
                <ChevronRight size={12} className="text-border-dark" />
              </>
            )}
            <span className="font-medium text-text-dark">{product.shortName}</span>
          </nav>
        </div>
      </div>

      {/* Main product section */}
      <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 sm:py-10">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Left — Image Gallery */}
          <FadeIn>
            <div className="relative">
              <ImageGallery images={product.images} alt={product.name} />
            </div>

            {/* Passar till & Rekommenderad laddare — desktop only */}
            <ProductExtraInfo product={product} className="mt-8 hidden lg:block" />
          </FadeIn>

          {/* Right — Info */}
          <FadeIn delay={0.1}>
            <div>
              <div className="mb-3 text-sm font-medium text-text-mid">
                {getProductBrand(product)} · {getProductChemistry(product)} · {product.voltage}
              </div>

              <h1 className="mb-2 font-heading text-[clamp(24px,3.5vw,32px)] font-extrabold tracking-tight text-text-dark">
                {product.name}
              </h1>

              {/* Price */}
              <div className="mb-5">
                <div className="flex items-baseline gap-2">
                  <span className="font-heading text-3xl font-extrabold text-text-dark">
                    {formatPrice(displayPrice(product.price))}
                  </span>
                  <span className="text-base font-medium text-text-mid">kr</span>
                </div>
                <div className="mt-0.5 text-sm text-text-light">
                  {vatLabel}
                  {inclVat
                    ? ` · ${formatPrice(Math.round(product.price / 1.25))} kr exkl. moms`
                    : ` · ${formatPrice(product.price)} kr inkl. moms`
                  }
                </div>
              </div>

              {/* Artnr */}
              <div className="mb-5 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm">
                <span className="text-text-mid">Artnr: </span>
                <span className="font-semibold text-text-dark">{product.slug.toUpperCase()}</span>
              </div>

              {/* In stock */}
              <div className="mb-5 flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="10" fill="#16a34a" opacity="0.15" />
                  <path d="M6 10l2.5 2.5L14 7" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-sm font-semibold text-green">Skickas direkt från leverantör</span>
              </div>

              {/* Qty + Add to cart */}
              <div className="mb-5 flex items-center gap-3">
                <div className="flex items-center rounded-xl border border-border bg-white">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="flex h-12 w-12 items-center justify-center rounded-l-xl text-text-mid transition-colors hover:bg-surface hover:text-text-dark"
                  >
                    <span className="text-lg font-bold">−</span>
                  </button>
                  <span className="w-10 text-center font-heading text-lg font-bold text-text-dark">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(Math.min(99, qty + 1))}
                    className="flex h-12 w-12 items-center justify-center rounded-r-xl text-text-mid transition-colors hover:bg-surface hover:text-text-dark"
                  >
                    <span className="text-lg font-bold">+</span>
                  </button>
                </div>

                <button
                  onClick={() => addItem(product, qty)}
                  className="flex flex-1 items-center justify-center gap-3 rounded-xl bg-amber-bg py-3.5 font-heading text-base font-bold text-navy shadow-sm transition-all hover:-translate-y-px hover:shadow-md"
                >
                  <ShoppingCart size={18} strokeWidth={2.5} />
                  LÄGG I VARUKORG
                </button>
              </div>

              {/* Volume order */}
              <div className="mb-6">
                <a href={`tel:${PHONE_LINK}`} className="text-sm font-semibold text-navy underline underline-offset-2 hover:text-amber-text">
                  Beställa större mängd? Vi erbjuder offert på volymköp av högre värde.
                </a>
              </div>

              {/* Trust items */}
              <div className="mb-6 flex flex-col gap-3 rounded-xl border border-border p-5">
                {[
                  { icon: <RotateCcw size={16} />, text: "Passar den inte din maskin byter vi" },
                  { icon: <Truck size={16} />, text: "Leverans normalt 1–3 arbetsdagar" },
                  { icon: <Shield size={16} />, text: "Garanti enligt tillverkare" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-surface text-text-mid">
                      {item.icon}
                    </div>
                    <span className="font-medium text-text-dark">{item.text}</span>
                  </div>
                ))}
              </div>

              {/* Description */}
              <ExpandableDescription description={product.description} />

              {/* Specs table */}
              <div className="overflow-hidden rounded-xl border border-border">
                <div className="border-b border-border bg-surface px-5 py-3">
                  <h2 className="font-heading text-sm font-bold text-text-dark">
            Specifikationer
          </h2>
                </div>
                <div className="divide-y divide-border">
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between px-5 py-3">
                      <span className="text-sm text-text-mid">{key}</span>
                      <span className="text-sm font-semibold text-text-dark">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Passar till & Rekommenderad laddare — mobile only */}
              <ProductExtraInfo product={product} className="mt-6 lg:hidden" />

            </div>
          </FadeIn>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="border-t border-border bg-surface py-14">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
            <h2 className="mb-6 font-heading text-2xl font-extrabold text-text-dark">
              Relaterade produkter
            </h2>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
