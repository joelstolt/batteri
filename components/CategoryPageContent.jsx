"use client"

import { useState, useMemo } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { SlidersHorizontal, ChevronDown, Grid3X3, LayoutList } from "lucide-react"
import { getProductsByCategory } from "@/lib/products"
import { CATEGORIES } from "@/lib/constants"
import ProductCard from "@/components/ProductCard"
import FadeIn from "@/components/FadeIn"

const SORT_OPTIONS = [
  { value: "popular", label: "Populärast" },
  { value: "price-asc", label: "Pris: Lägst först" },
  { value: "price-desc", label: "Pris: Högst först" },
  { value: "capacity", label: "Kapacitet: Störst" },
]

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug

  const category = CATEGORIES.find((c) => c.slug === slug)
  const allProducts = getProductsByCategory(slug)

  const [sort, setSort] = useState("popular")
  const [voltageFilter, setVoltageFilter] = useState("all")
  const [showSort, setShowSort] = useState(false)

  const voltages = useMemo(() => {
    const set = new Set(allProducts.map((p) => p.voltage))
    return ["all", ...Array.from(set).sort()]
  }, [allProducts])

  const filtered = useMemo(() => {
    let list = [...allProducts]

    if (voltageFilter !== "all") {
      list = list.filter((p) => p.voltage === voltageFilter)
    }

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        list.sort((a, b) => b.price - a.price)
        break
      case "capacity":
        list.sort((a, b) => {
          const capA = parseInt(a.capacity) || 0
          const capB = parseInt(b.capacity) || 0
          return capB - capA
        })
        break
      default:
        // popular — badges first
        list.sort((a, b) => (b.badge ? 1 : 0) - (a.badge ? 1 : 0))
    }

    return list
  }, [allProducts, sort, voltageFilter])

  if (!category) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="mb-2 font-heading text-2xl font-bold text-text-dark">
            Kategori hittades inte
          </h1>
          <Link href="/" className="text-accent underline">
            Tillbaka till startsidan
          </Link>
        </div>
      </div>
    )
  }

  return (
    <section className="bg-white pb-20">
      {/* Category header */}
      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-[1200px] px-4 pb-8 pt-8 sm:px-6 sm:pt-10">
          {/* Breadcrumb */}
          <nav className="mb-4 flex items-center gap-2 text-sm text-text-mid">
            <Link href="/" className="transition-colors hover:text-text-dark">
              Hem
            </Link>
            <span className="text-border">/</span>
            <span className="font-medium text-text-dark">{category.title}</span>
          </nav>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <span className="text-3xl">{category.icon}</span>
                <h1 className="font-heading text-[clamp(28px,4vw,40px)] font-extrabold tracking-tight text-text-dark">
                  {category.title}
                </h1>
              </div>
              <p className="max-w-lg text-base text-text-mid">
                {category.desc} — Underhållsfria Sonnenschein gel-batterier
                tillverkade i Tyskland. Fri frakt över 2 000 kr.
              </p>
            </div>
            <div className="text-sm font-medium text-text-mid">
              {filtered.length} {filtered.length === 1 ? "produkt" : "produkter"}
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar: filters + sort */}
      <div className="border-b border-border">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          {/* Voltage filter pills */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-text-mid" />
            <span className="mr-1 text-sm font-medium text-text-mid">
              Spänning:
            </span>
            {voltages.map((v) => (
              <button
                key={v}
                onClick={() => setVoltageFilter(v)}
                className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-all ${
                  voltageFilter === v
                    ? "bg-navy text-white"
                    : "bg-surface text-text-mid hover:bg-border hover:text-text-dark"
                }`}
              >
                {v === "all" ? "Alla" : v}
              </button>
            ))}
          </div>

          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSort(!showSort)}
              className="flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text-dark transition-colors hover:bg-surface"
            >
              {SORT_OPTIONS.find((o) => o.value === sort)?.label}
              <ChevronDown
                size={14}
                className={`transition-transform ${showSort ? "rotate-180" : ""}`}
              />
            </button>
            {showSort && (
              <div className="absolute right-0 top-full z-20 mt-1 w-48 overflow-hidden rounded-xl border border-border bg-white shadow-lg">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setSort(opt.value)
                      setShowSort(false)
                    }}
                    className={`block w-full px-4 py-2.5 text-left text-sm transition-colors ${
                      sort === opt.value
                        ? "bg-surface font-semibold text-navy"
                        : "text-text-mid hover:bg-surface hover:text-text-dark"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product grid */}
      <div className="mx-auto max-w-[1200px] px-4 pt-6 sm:px-6 sm:pt-8">
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="mb-2 text-lg font-semibold text-text-dark">
              Inga produkter matchar ditt filter
            </p>
            <button
              onClick={() => setVoltageFilter("all")}
              className="text-accent underline"
            >
              Visa alla produkter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
            {filtered.map((product, i) => (
              <FadeIn key={product.slug} delay={i * 0.05}>
                <ProductCard product={product} />
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
