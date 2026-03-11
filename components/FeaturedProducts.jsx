"use client"

import { products } from "@/lib/products"
import ProductCard from "@/components/ProductCard"
import FadeIn from "@/components/FadeIn"
import Link from "next/link"

export default function FeaturedProducts() {
  const featured = products.filter((p) => p.badge).slice(0, 4)

  // If less than 4 with badges, fill with cheapest
  if (featured.length < 4) {
    const remaining = products
      .filter((p) => !p.badge)
      .sort((a, b) => b.price - a.price)
      .slice(0, 4 - featured.length)
    featured.push(...remaining)
  }

  return (
    <section className="border-t border-border bg-white py-14">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <FadeIn>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="mb-2 text-xs font-bold uppercase tracking-widest text-amber">
                Populära produkter
              </div>
              <h2 className="font-heading text-[clamp(24px,3.5vw,34px)] font-extrabold tracking-tight text-text-dark">
                Våra mest sålda batterier
              </h2>
            </div>
            <Link
              href="/kategori/traktion-industri"
              className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-text-dark transition-all hover:border-border-dark hover:bg-surface"
            >
              Visa alla produkter
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M5 3l5 5-5 5" />
              </svg>
            </Link>
          </div>
        </FadeIn>

        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {featured.map((product, i) => (
            <FadeIn key={product.slug} delay={i * 0.06}>
              <ProductCard product={product} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
