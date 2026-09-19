"use client"

import { useEffect, useRef } from "react"
import { ChevronDown } from "lucide-react"

export default function OptionalCheckoutFields({ title, hint, reveal = false, children }) {
  const ref = useRef(null)
  useEffect(() => {
    if (reveal && ref.current) ref.current.open = true
  }, [reveal])

  return (
    <details ref={ref} className="group rounded-xl border border-border bg-surface/50">
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 p-4 text-sm font-semibold text-navy [&::-webkit-details-marker]:hidden">
        <span>{title}</span>
        <ChevronDown size={18} aria-hidden="true" className="shrink-0 transition-transform group-open:rotate-180" />
      </summary>
      <div className="space-y-4 border-t border-border p-4">
        {hint && <p className="text-sm text-text-mid">{hint}</p>}
        {children}
      </div>
    </details>
  )
}
