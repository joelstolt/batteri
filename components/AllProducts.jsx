"use client"

import { useMemo, useState } from "react"
import { ChevronDown, SlidersHorizontal } from "lucide-react"
import { publicProducts as allProductsList } from "@/lib/products"
import { CATEGORIES } from "@/lib/constants"
import ProductCard from "@/components/ProductCard"
import FadeIn from "@/components/FadeIn"

const SORT_OPTIONS = [
  { value: "popular", label: "Populärast" },
  { value: "price-asc", label: "Pris: Lägst först" },
  { value: "price-desc", label: "Pris: Högst först" },
  { value: "capacity", label: "Kapacitet: Störst" },
]

const CATEGORY_FILTERS = [
  { slug: "all", label: "Alla" },
  ...CATEGORIES.filter((c) => c.slug !== "alla").map((c) => ({
    slug: c.slug,
    label: c.title,
  })),
]

export default function AllProducts() {
  const [category, setCategory] = useState("all")
  const [voltage, setVoltage] = useState("all")
  const [sort, setSort] = useState("popular")
  const [showSort, setShowSort] = useState(false)

  const voltages = useMemo(() => {
    const set = new Set(allProductsList.map((p) => p.voltage))
    return ["all", ...Array.from(set).sort()]
  }, [])

  const filtered = useMemo(() => {
    let list = [...allProductsList]

    if (category !== "all") {
      list = list.filter((p) => p.category === category)
    }

    if (voltage !== "all") {
      list = list.filter((p) => p.voltage === voltage)
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
        list.sort((a, b) => (b.badge ? 1 : 0) - (a.badge ? 1 : 0))
    }

    return list
  }, [category, voltage, sort])

  return (
    <section className="border-t border-border bg-white py-14">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <FadeIn>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="mb-2 text-xs font-bold uppercase tracking-widest text-amber-text">
                Hela sortimentet
              </div>
              <h2 className="font-heading text-[clamp(24px,3.5vw,34px)] font-extrabold tracking-tight text-text-dark">
                Alla batterier
              </h2>
            </div>
            <div className="text-sm font-medium text-text-mid">
              {filtered.length} {filtered.length === 1 ? "produkt" : "produkter"}
            </div>
          </div>
        </FadeIn>

        {/* Filters */}
        <FadeIn delay={0.05}>
          <div className="mb-6 space-y-3 rounded-2xl border border-border bg-surface p-4 sm:p-5">
            {/* Category pills */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="mr-1 flex items-center gap-1.5 text-sm font-semibold text-text-mid">
                <SlidersHorizontal size={14} />
                Kategori:
              </div>
              {CATEGORY_FILTERS.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => setCategory(c.slug)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-all ${
                    category === c.slug
                      ? "bg-navy text-white"
                      : "bg-white text-text-mid hover:bg-border hover:text-text-dark"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Voltage pills + sort */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <div className="mr-1 text-sm font-semibold text-text-mid">
                  Spänning:
                </div>
                {voltages.map((v) => (
                  <button
                    key={v}
                    onClick={() => setVoltage(v)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-all ${
                      voltage === v
                        ? "bg-navy text-white"
                        : "bg-white text-text-mid hover:bg-border hover:text-text-dark"
                    }`}
                  >
                    {v === "all" ? "Alla" : v}
                  </button>
                ))}
              </div>

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
        </FadeIn>

        {/* Product grid */}
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="mb-2 text-lg font-semibold text-text-dark">
              Inga produkter matchar ditt filter
            </p>
            <button
              onClick={() => {
                setCategory("all")
                setVoltage("all")
              }}
              className="text-amber-text underline"
            >
              Återställ filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {filtered.map((product, i) => (
              <FadeIn key={product.slug} delay={Math.min(i * 0.04, 0.4)}>
                <ProductCard product={product} />
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
