"use client"

import { useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Check, X } from "lucide-react"
import { useCart } from "@/lib/cart-context"

function formatPrice(n) {
  return new Intl.NumberFormat("sv-SE").format(n)
}

export default function CartToast() {
  const { toast, setToast, setIsOpen } = useCart()

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500)
      return () => clearTimeout(timer)
    }
  }, [toast, setToast])

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: -20, x: "-50%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed left-1/2 top-4 z-[300] w-[90vw] max-w-md overflow-hidden rounded-xl border border-border bg-white shadow-xl"
        >
          <div className="flex items-center gap-4 p-4">
            {/* Green checkmark */}
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green/10">
              <Check size={20} className="text-green" strokeWidth={3} />
            </div>

            {/* Product info */}
            <div className="flex flex-1 items-center gap-3 overflow-hidden">
              <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-border bg-surface">
                <Image
                  src={toast.images?.[0] || "/produkter/placeholder.jpg"}
                  alt={toast.shortName}
                  fill
                  className="object-contain p-1"
                  sizes="48px"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-text-dark">
                  {toast.shortName} tillagd
                </p>
                <p className="text-xs text-text-mid">
                  {toast.qty}x · {formatPrice(toast.price * toast.qty)} kr
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-shrink-0 items-center gap-2">
              <button
                onClick={() => { setToast(null); setIsOpen(true) }}
                className="rounded-lg bg-navy px-3.5 py-2 text-xs font-bold text-white transition-colors hover:bg-navy-light"
              >
                Visa
              </button>
              <button
                onClick={() => setToast(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-text-light transition-colors hover:bg-surface hover:text-text-dark"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 3.5, ease: "linear" }}
            className="h-[3px] bg-green"
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
