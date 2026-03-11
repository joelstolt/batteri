"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { X, Search, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { products } from "@/lib/products"
import { CATEGORIES } from "@/lib/constants"

function formatPrice(n) {
  return new Intl.NumberFormat("sv-SE").format(n)
}

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState("")
  const inputRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
      setQuery("")
    }
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose])

  const q = query.toLowerCase().trim()

  const matchedProducts = q.length >= 2
    ? products.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.shortName.toLowerCase().includes(q) ||
        p.voltage.toLowerCase().includes(q) ||
        p.capacity.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q)
      ).slice(0, 6)
    : []

  const matchedCategories = q.length >= 2
    ? CATEGORIES.filter((c) =>
        c.title.toLowerCase().includes(q) ||
        c.desc.toLowerCase().includes(q)
      )
    : []

  const hasResults = matchedProducts.length > 0 || matchedCategories.length > 0

  const goTo = (href) => {
    onClose()
    router.push(href)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[200] bg-black/50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-[10%] z-[201] w-full max-w-[640px] -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-white shadow-2xl"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 border-b border-border px-5 py-4">
              <Search size={20} className="flex-shrink-0 text-text-light" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Sök batteri, modellnr eller användningsområde..."
                className="flex-1 bg-transparent text-base text-text-dark outline-none placeholder:text-text-light"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-text-light hover:bg-surface hover:text-text-dark"
                >
                  <X size={16} />
                </button>
              )}
              <button
                onClick={onClose}
                className="rounded-md border border-border px-2.5 py-1 text-xs font-medium text-text-light hover:bg-surface"
              >
                ESC
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {q.length < 2 ? (
                /* Empty state — popular categories */
                <div className="px-5 py-6">
                  <div className="mb-3 text-xs font-bold uppercase tracking-wider text-text-light">
                    Populära kategorier
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.slug}
                        onClick={() => goTo(`/kategori/${cat.slug}`)}
                        className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3.5 py-2 text-sm font-medium text-text-dark transition-colors hover:border-amber-bg/40 hover:bg-amber-bg/5"
                      >
                        <span>{cat.icon}</span>
                        {cat.title}
                      </button>
                    ))}
                  </div>

                  <div className="mb-3 mt-6 text-xs font-bold uppercase tracking-wider text-text-light">
                    Populära sökningar
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["12V", "6V", "GF 12 105", "Städmaskin", "Golfbil", "Sonnenschein"].map((term) => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="rounded-lg border border-border px-3 py-1.5 text-sm text-text-mid transition-colors hover:border-border-dark hover:text-text-dark"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              ) : !hasResults ? (
                /* No results */
                <div className="px-5 py-10 text-center">
                  <p className="mb-1 font-heading text-base font-bold text-text-dark">
                    Inga resultat för "{query}"
                  </p>
                  <p className="text-sm text-text-mid">
                    Prova ett annat sökord eller{" "}
                    <button onClick={() => setQuery("")} className="font-semibold text-amber underline">
                      visa alla kategorier
                    </button>
                  </p>
                </div>
              ) : (
                /* Results */
                <div>
                  {/* Category matches */}
                  {matchedCategories.length > 0 && (
                    <div className="border-b border-border px-5 py-4">
                      <div className="mb-2 text-xs font-bold uppercase tracking-wider text-text-light">
                        Kategorier
                      </div>
                      {matchedCategories.map((cat) => (
                        <button
                          key={cat.slug}
                          onClick={() => goTo(`/kategori/${cat.slug}`)}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-surface"
                        >
                          <span className="text-xl">{cat.icon}</span>
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-text-dark">{cat.title}</div>
                            <div className="text-xs text-text-light">{cat.desc}</div>
                          </div>
                          <ArrowRight size={14} className="text-text-light" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Product matches */}
                  {matchedProducts.length > 0 && (
                    <div className="px-5 py-4">
                      <div className="mb-2 text-xs font-bold uppercase tracking-wider text-text-light">
                        Produkter
                      </div>
                      {matchedProducts.map((p) => (
                        <button
                          key={p.slug}
                          onClick={() => goTo(`/produkt/${p.slug}`)}
                          className="flex w-full items-center gap-4 rounded-lg px-3 py-3 text-left transition-colors hover:bg-surface"
                        >
                          <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border border-border bg-white">
                            <Image
                              src={p.images[0]}
                              alt={p.shortName}
                              fill
                              className="object-contain p-1"
                              sizes="56px"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="truncate text-sm font-semibold text-text-dark">
                              {p.shortName}
                            </div>
                            <div className="text-xs text-text-light">
                              {p.voltage} · {p.capacity}
                            </div>
                          </div>
                          <div className="flex-shrink-0 text-right">
                            <div className="font-heading text-sm font-bold text-text-dark">
                              {formatPrice(p.price)} kr
                            </div>
                            <div className="text-[10px] text-text-light">exkl. moms</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
