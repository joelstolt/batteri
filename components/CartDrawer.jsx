"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { X, Minus, Plus, Trash2, ShoppingCart, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "@/lib/cart-context"
import { useVat } from "@/lib/vat-context"

function formatPrice(n) {
  return new Intl.NumberFormat("sv-SE").format(n)
}

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQty, removeItem, totalItems, totalPrice } =
    useCart()
  const { displayPrice, vatLabel, inclVat } = useVat()
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || "Något gick fel. Försök igen.")
        setLoading(false)
      }
    } catch {
      alert("Kunde inte nå kassan. Försök igen.")
      setLoading(false)
    }
  }

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] bg-black/40"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 right-0 top-0 z-[201] flex w-full max-w-md flex-col bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <h2 className="font-heading text-xl font-extrabold text-text-dark">
                Varukorg ({totalItems})
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-text-mid transition-colors hover:bg-surface hover:text-text-dark"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <ShoppingCart size={48} className="mb-4 text-border" strokeWidth={1.5} />
                  <p className="mb-1 font-heading text-lg font-bold text-text-dark">
                    Varukorgen är tom
                  </p>
                  <p className="mb-6 text-sm text-text-mid">
                    Lägg till produkter för att komma igång
                  </p>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="rounded-lg bg-navy px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-navy-light"
                  >
                    Fortsätt handla
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {items.map((item) => (
                    <div
                      key={item.slug}
                      className="rounded-xl border border-border p-4"
                    >
                      <div className="mb-3 flex gap-4">
                        {/* Thumbnail */}
                        <Link
                          href={`/produkt/${item.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-surface"
                        >
                          <Image
                            src={item.images[0]}
                            alt={item.shortName}
                            fill
                            className="object-contain p-1"
                          />
                        </Link>

                        {/* Info */}
                        <div className="flex-1">
                          <Link
                            href={`/produkt/${item.slug}`}
                            onClick={() => setIsOpen(false)}
                            className="font-heading text-sm font-bold text-text-dark transition-colors hover:text-accent"
                          >
                            {item.shortName}
                          </Link>
                          <div className="mt-0.5 text-xs text-text-mid">
                            {item.capacity}
                          </div>
                          <div className="mt-1.5 font-heading text-base font-extrabold text-text-dark">
                            {formatPrice(displayPrice(item.price) * item.qty)} kr
                          </div>
                        </div>
                      </div>

                      {/* Quantity + shipping + delete */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <circle cx="7" cy="7" r="7" fill="#16a34a" opacity="0.15" />
                              <path d="M4 7l2 2 4-4" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Skickas direkt
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Qty controls */}
                          <div className="flex items-center rounded-lg border border-border bg-surface">
                            <button
                              onClick={() => updateQty(item.slug, item.qty - 1)}
                              className="flex h-8 w-8 items-center justify-center text-text-mid transition-colors hover:text-text-dark"
                            >
                              <Minus size={13} strokeWidth={2.5} />
                            </button>
                            <span className="w-7 text-center text-sm font-bold text-text-dark">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => updateQty(item.slug, item.qty + 1)}
                              className="flex h-8 w-8 items-center justify-center text-text-mid transition-colors hover:text-text-dark"
                            >
                              <Plus size={13} strokeWidth={2.5} />
                            </button>
                          </div>

                          {/* Delete */}
                          <button
                            onClick={() => removeItem(item.slug)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-mid transition-colors hover:bg-red-50 hover:text-red-500"
                          >
                            <Trash2 size={15} strokeWidth={2} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer — shipping + total + checkout */}
            {items.length > 0 && (
              <div className="border-t border-border px-6 py-5">
                {/* Shipping info */}
                {totalPrice < 2000 ? (
                  <div className="mb-3 rounded-lg bg-amber-bg/8 px-3.5 py-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-text-mid">Frakt</span>
                      <span className="font-semibold text-text-dark">
                        {formatPrice(inclVat ? Math.round(149 * 1.25) : 149)} kr
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-border">
                      <div
                        className="h-full rounded-full bg-amber-bg transition-all"
                        style={{ width: `${Math.min(100, (totalPrice / 2000) * 100)}%` }}
                      />
                    </div>
                    <div className="mt-1 text-[11px] text-text-light">
                      {formatPrice(inclVat ? Math.round((2000 - totalPrice) * 1.25) : 2000 - totalPrice)} kr kvar till fri frakt
                    </div>
                  </div>
                ) : (
                  <div className="mb-3 flex items-center gap-2 rounded-lg bg-green/5 px-3.5 py-2.5 text-xs font-semibold text-green">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="7" fill="#16a34a" opacity="0.15" />
                      <path d="M4 7l2 2 4-4" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Fri frakt!
                  </div>
                )}

                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm text-text-mid">Produkter {vatLabel.toLowerCase()}</span>
                  <span className="text-sm font-medium text-text-dark">
                    {formatPrice(inclVat ? Math.round(totalPrice * 1.25) : totalPrice)} kr
                  </span>
                </div>
                {totalPrice < 2000 && (
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm text-text-mid">Frakt</span>
                    <span className="text-sm font-medium text-text-dark">
                      {formatPrice(inclVat ? Math.round(149 * 1.25) : 149)} kr
                    </span>
                  </div>
                )}
                <div className="mb-4 flex items-center justify-between border-t border-border pt-3 mt-2">
                  <span className="font-heading text-base font-bold text-text-dark">Totalt {vatLabel.toLowerCase()}</span>
                  <span className="font-heading text-xl font-extrabold text-text-dark">
                    {formatPrice(
                      inclVat
                        ? Math.round((totalPrice + (totalPrice < 2000 ? 149 : 0)) * 1.25)
                        : totalPrice + (totalPrice < 2000 ? 149 : 0)
                    )} kr
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[#16a34a] to-[#15803d] py-4 font-heading text-base font-bold text-white shadow-lg transition-transform hover:-translate-y-px disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Laddar...
                    </>
                  ) : (
                    <>
                      Till kassan
                      <svg width="18" height="18" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 9h10M10 5l4 4-4 4" />
                      </svg>
                    </>
                  )}
                </button>
                <div className="mt-3 flex items-center justify-center gap-3">
                  {["Swish", "Visa", "Mastercard", "PostNord"].map((m) => (
                    <span key={m} className="text-[10px] font-semibold uppercase tracking-wider text-text-mid/60">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
