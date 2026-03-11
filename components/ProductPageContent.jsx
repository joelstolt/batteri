"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Truck, Shield, Phone, ChevronRight, RotateCcw } from "lucide-react"
import { getProductBySlug, getProductsByCategory } from "@/lib/products"
import { CATEGORIES, PHONE, PHONE_LINK } from "@/lib/constants"
import { useCart } from "@/lib/cart-context"
import ProductCard from "@/components/ProductCard"
import FadeIn from "@/components/FadeIn"

function formatPrice(n) {
  return new Intl.NumberFormat("sv-SE").format(n)
}

function ImageGallery({ images, alt }) {
  const [active, setActive] = useState(0)

  return (
    <div className="flex gap-4">
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex w-20 flex-shrink-0 flex-col gap-2">
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

export default function ProductPageContent() {
  const params = useParams()
  const product = getProductBySlug(params.slug)
  const [qty, setQty] = useState(1)
  const { addItem } = useCart()

  if (!product) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="mb-2 font-heading text-2xl font-bold text-text-dark">
            Produkten hittades inte
          </h1>
          <Link href="/" className="text-accent underline">
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
        <div className="mx-auto max-w-[1200px] px-6 py-3">
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
      <div className="mx-auto max-w-[1200px] px-6 py-10">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Left — Image Gallery */}
          <FadeIn>
            <div className="relative">
              {product.badge && (
                <div className="absolute left-4 top-4 z-10 rounded-lg bg-amber-bg px-3 py-1.5 text-xs font-bold text-navy">
                  {product.badge}
                </div>
              )}
              <ImageGallery images={product.images} alt={product.name} />
            </div>
          </FadeIn>

          {/* Right — Info */}
          <FadeIn delay={0.1}>
            <div>
              <div className="mb-3 text-sm font-medium text-text-mid">
                Sonnenschein · Gel-batteri · {product.voltage}
              </div>

              <h1 className="mb-2 font-heading text-[clamp(24px,3.5vw,32px)] font-extrabold tracking-tight text-text-dark">
                {product.name}
              </h1>

              {/* Price */}
              <div className="mb-5">
                <div className="flex items-baseline gap-2">
                  <span className="font-heading text-3xl font-extrabold text-text-dark">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-base font-medium text-text-mid">kr</span>
                </div>
                <div className="mt-0.5 text-sm text-text-light">
                  {formatPrice(Math.round(product.price * 1.25))} kr inkl. moms
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
                <a href={`tel:${PHONE_LINK}`} className="text-sm font-semibold text-navy underline underline-offset-2 hover:text-accent">
                  Beställa större mängd? Vi erbjuder offert på volymköp av högre värde.
                </a>
              </div>

              {/* Trust items */}
              <div className="mb-6 flex flex-col gap-3 rounded-xl border border-border p-5">
                {[
                  { icon: <RotateCcw size={16} />, text: "30 dagars öppet köp!" },
                  { icon: <Truck size={16} />, text: "Fri frakt vid order över 2 000 kr" },
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
              <div className="mb-6">
                <h3 className="mb-2 font-heading text-sm font-bold uppercase tracking-wider text-text-mid">
                  Beskrivning
                </h3>
                <p className="text-sm leading-relaxed text-text-mid">
                  {product.description}
                </p>
              </div>

              {/* Specs table */}
              <div className="overflow-hidden rounded-xl border border-border">
                <div className="border-b border-border bg-surface px-5 py-3">
                  <h3 className="font-heading text-sm font-bold text-text-dark">
                    Specifikationer
                  </h3>
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

              {/* Need help */}
              <div className="mt-6 flex items-center gap-3 rounded-xl border border-amber-bg/20 bg-amber-bg/5 px-5 py-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-amber-bg/15">
                  <Phone size={18} className="text-amber" />
                </div>
                <div>
                  <div className="text-sm font-bold text-text-dark">Osäker på om detta batteri passar?</div>
                  <div className="text-sm text-text-mid">
                    Ring <a href={`tel:${PHONE_LINK}`} className="font-semibold text-navy underline">{PHONE}</a> så hjälper vi dig.
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="border-t border-border bg-surface py-14">
          <div className="mx-auto max-w-[1200px] px-6">
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
