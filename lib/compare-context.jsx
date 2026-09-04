"use client"
import { createContext, useContext, useState } from "react"
import Link from "next/link"
const Context = createContext(null)
export function CompareProvider({ children }) {
  const [slugs, setSlugs] = useState([])
  function toggle(slug) {
    setSlugs((s) =>
      s.includes(slug)
        ? s.filter((x) => x !== slug)
        : s.length < 3
          ? [...s, slug]
          : s,
    )
  }
  return (
    <Context.Provider value={{ slugs, toggle }}>
      {children}
      {slugs.length > 0 && (
        <>
          <div aria-hidden="true" className="h-24" />
          <aside
            aria-label="Valda produkter för jämförelse"
            className="fixed inset-x-0 bottom-0 z-40 flex flex-wrap items-center justify-center gap-4 border-t border-border bg-white px-4 py-3 shadow-lg"
          >
            <span aria-live="polite" className="text-sm">
              {slugs.length} av 3 produkter valda
            </span>
            <Link
              className="rounded-lg bg-navy px-4 py-2 text-sm font-bold text-white"
              href={`/jamfor?produkter=${slugs.join(",")}`}
            >
              Jämför produkter
            </Link>
            <button className="text-sm underline" onClick={() => setSlugs([])}>
              Rensa
            </button>
          </aside>
        </>
      )}
    </Context.Provider>
  )
}
export const useCompare = () => useContext(Context)
export function CompareButton({ product }) {
  const context = useContext(Context)
  if (!context) return null
  const selected = context.slugs.includes(product.slug)
  const full = !selected && context.slugs.length >= 3
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={full}
      onClick={() => context.toggle(product.slug)}
      className="mt-3 w-full rounded-lg border border-border px-3 py-2 text-xs font-semibold text-navy disabled:opacity-50"
    >
      {selected
        ? "Ta bort ur jämförelse"
        : full
          ? "Tre produkter redan valda"
          : "Jämför"}
    </button>
  )
}
