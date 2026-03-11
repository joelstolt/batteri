"use client"

import { useState } from "react"
import { Minus, Plus } from "lucide-react"

export default function QuantitySelector({ onChange }) {
  const [qty, setQty] = useState(1)

  const update = (val) => {
    const next = Math.max(1, Math.min(99, val))
    setQty(next)
    onChange?.(next)
  }

  return (
    <div className="flex items-center rounded-lg border border-border bg-surface">
      <button
        onClick={() => update(qty - 1)}
        className="flex h-9 w-9 items-center justify-center text-text-mid transition-colors hover:text-text-dark"
        aria-label="Minska antal"
      >
        <Minus size={14} strokeWidth={2.5} />
      </button>
      <span className="w-8 text-center text-sm font-bold text-text-dark">
        {qty}
      </span>
      <button
        onClick={() => update(qty + 1)}
        className="flex h-9 w-9 items-center justify-center text-text-mid transition-colors hover:text-text-dark"
        aria-label="Öka antal"
      >
        <Plus size={14} strokeWidth={2.5} />
      </button>
    </div>
  )
}
