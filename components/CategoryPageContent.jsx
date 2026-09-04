"use client"

import { useState, useMemo } from "react"
import { useParams, useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  SlidersHorizontal,
  ChevronDown,
  Grid3X3,
  LayoutList,
} from "lucide-react"
import {
  getProductsByCategory,
  publicProducts as allProductsList,
} from "@/lib/products"
import { CATEGORIES } from "@/lib/constants"
import ProductCard from "@/components/ProductCard"
import { filterProducts } from "@/lib/product-selection"
import { getProductChemistry } from "@/lib/products"
import FadeIn from "@/components/FadeIn"

const SORT_OPTIONS = [
  { value: "popular", label: "Utvalda" },
  { value: "price-asc", label: "Pris: Lägst först" },
  { value: "price-desc", label: "Pris: Högst först" },
  { value: "capacity", label: "Kapacitet: Störst (vald mätgrund)" },
]

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug

  const category = CATEGORIES.find((c) => c.slug === slug)
  const allProducts =
    slug === "alla" ? allProductsList : getProductsByCategory(slug)

  // Batterifinnaren skickar hit ?volt=6V så listan öppnar förfiltrerad
  const searchParams = useSearchParams()
  const filters = Object.fromEntries(searchParams.entries())
  const sort = filters.sort || "popular"
  const voltageFilter = filters.volt || "all"
  const [showSort, setShowSort] = useState(false)
  function changeFilters(changes) {
    const next = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(changes)) {
      if (value && value !== "all") next.set(key, value)
      else next.delete(key)
    }
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${next.size ? `?${next}` : ""}`,
    )
  }
  const setSort = (value) => changeFilters({ sort: value })
  const setVoltageFilter = (value) => changeFilters({ volt: value })
  const voltages = ["all", ...new Set(allProducts.map((p) => p.voltage))]
  const chemistries = [...new Set(allProducts.map(getProductChemistry))]
  const filtered = filterProducts(allProducts, filters)

  if (!category) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="mb-2 font-heading text-2xl font-bold text-text-dark">
            Kategori hittades inte
          </h1>
          <Link href="/" className="text-amber-text underline">
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
              <div className="mb-2">
                <h1 className="font-heading text-[clamp(28px,4vw,40px)] font-extrabold tracking-tight text-text-dark">
                  {category.title}
                </h1>
              </div>
              <p className="max-w-lg text-base text-text-mid">
                {category.desc} — Kvalitetsbatterier till proffspriser. Snabb
                leverans i hela Sverige.
              </p>
            </div>
            <div className="text-sm font-medium text-text-mid">
              {filtered.length}{" "}
              {filtered.length === 1 ? "produkt" : "produkter"}
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

      <div className="mx-auto max-w-[1200px] px-4 pt-5 sm:px-6">
        <details
          className="rounded-xl border border-border p-4"
          open={
            !!(
              filters.kemi ||
              filters.ah ||
              filters.ahmax ||
              filters.langd ||
              filters.bredd ||
              filters.hojd
            )
          }
        >
          <summary className="cursor-pointer text-sm font-semibold text-navy">
            Batterityp, kapacitet och mått
          </summary>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <label className="text-xs font-medium">
              Batterityp
              <select
                className="mt-1 w-full rounded-lg border border-border p-2"
                value={filters.kemi || ""}
                onChange={(e) => changeFilters({ kemi: e.target.value })}
              >
                <option value="">Alla</option>
                {chemistries.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="text-xs font-medium">
              Mätgrund
              <select
                className="mt-1 w-full rounded-lg border border-border p-2"
                value={filters.basis === "C5" ? "C5" : "C20"}
                onChange={(e) => changeFilters({ basis: e.target.value })}
              >
                <option>C20</option>
                <option>C5</option>
              </select>
            </label>
            {[
              ["ah", "Minsta kapacitet (Ah)"],
              ["ahmax", "Högsta kapacitet (Ah)"],
              ["langd", "Max längd (mm)"],
              ["bredd", "Max bredd (mm)"],
              ["hojd", "Max höjd (mm)"],
            ].map(([key, label]) => (
              <label key={key} className="text-xs font-medium">
                {label}
                <input
                  type="number"
                  min="0"
                  inputMode="decimal"
                  className="mt-1 w-full rounded-lg border border-border p-2"
                  value={filters[key] || ""}
                  onChange={(e) => changeFilters({ [key]: e.target.value })}
                />
              </label>
            ))}
          </div>
          <p className="mt-3 text-xs text-text-mid">
            Produkter med saknade uppgifter visas inte när det filtret används.
            Mått anges som längd, bredd och höjd. Kontrollera polplacering och
            utrymme för anslutningar separat.
          </p>
        </details>
        {Object.keys(filters).length > 0 && (
          <button
            className="mt-3 text-sm underline"
            onClick={() =>
              window.history.replaceState(null, "", window.location.pathname)
            }
          >
            Rensa alla filter
          </button>
        )}
        <p className="sr-only" role="status">
          {filtered.length} produkter visas
        </p>
      </div>
      {/* Product grid */}
      <div className="mx-auto max-w-[1200px] px-4 pt-6 sm:px-6 sm:pt-8">
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="mb-2 text-lg font-semibold text-text-dark">
              Inga produkter matchar ditt filter
            </p>
            <button
              onClick={() =>
                window.history.replaceState(null, "", window.location.pathname)
              }
              className="text-amber-text underline"
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
