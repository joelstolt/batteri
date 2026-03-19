"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Truck, Mail, CreditCard, MapPin, Package, Loader2 } from "lucide-react"
import { useCart } from "@/lib/cart-context"

function formatPrice(n) {
  return new Intl.NumberFormat("sv-SE").format(n)
}

function formatDate(timestamp) {
  return new Date(timestamp * 1000).toLocaleDateString("sv-SE", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function cardBrandName(brand) {
  const brands = { visa: "Visa", mastercard: "Mastercard", amex: "Amex" }
  return brands[brand] || brand || "Kort"
}

export default function ThankYouContent() {
  const { clearCart } = useCart()
  const searchParams = useSearchParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  // Clear cart after successful payment
  useEffect(() => {
    clearCart()
  }, [clearCart])

  // Fetch order details
  useEffect(() => {
    const paymentIntent = searchParams.get("payment_intent")
    if (!paymentIntent) {
      setLoading(false)
      return
    }

    fetch(`/api/order?payment_intent=${paymentIntent}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setOrder(data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [searchParams])

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-[800px] px-4 py-14 sm:px-6 sm:py-20">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green/10">
            <CheckCircle size={44} className="text-green" />
          </div>
          <h1 className="mb-3 font-heading text-3xl font-extrabold text-text-dark">
            Tack för din beställning!
          </h1>
          <p className="text-base text-text-mid">
            Din betalning har genomförts.
            {order?.customer?.email && (
              <> En orderbekräftelse skickas till <span className="font-semibold text-text-dark">{order.customer.email}</span>.</>
            )}
            {!order?.customer?.email && " Du får en orderbekräftelse via e-post inom kort."}
          </p>
        </div>

        {/* Info cards */}
        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6 sm:flex-row sm:gap-8">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
              <Mail size={18} className="text-navy" />
            </div>
            <div>
              <div className="text-sm font-bold text-text-dark">Orderbekräftelse</div>
              <div className="text-sm text-text-mid">Skickas till din e-post</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
              <Truck size={18} className="text-navy" />
            </div>
            <div>
              <div className="text-sm font-bold text-text-dark">Leverans 1–3 dagar</div>
              <div className="text-sm text-text-mid">Spårningsnummer via e-post</div>
            </div>
          </div>
        </div>

        {/* Order details */}
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 size={24} className="animate-spin text-navy" />
          </div>
        ) : order ? (
          <div className="rounded-2xl border border-border">
            {/* Order header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-text-light">Ordernummer</div>
                <div className="font-heading text-sm font-bold text-text-dark">
                  {order.id.replace("pi_", "BP-").slice(0, 14).toUpperCase()}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold uppercase tracking-widest text-text-light">Datum</div>
                <div className="text-sm font-medium text-text-dark">{formatDate(order.created)}</div>
              </div>
            </div>

            {/* Products */}
            <div className="border-b border-border px-6 py-5">
              <div className="mb-3 flex items-center gap-2 text-sm font-bold text-text-dark">
                <Package size={16} className="text-navy" />
                Produkter
              </div>
              <div className="flex flex-col gap-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div>
                      <span className="font-medium text-text-dark">{item.name}</span>
                      <span className="ml-2 text-text-mid">× {item.qty}</span>
                    </div>
                    <span className="font-semibold text-text-dark">
                      {formatPrice(Math.round(item.price * item.qty * 1.25))} kr
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="border-b border-border px-6 py-5">
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-mid">Produkter exkl. moms</span>
                  <span className="text-text-dark">{formatPrice(order.subtotal)} kr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-mid">Frakt</span>
                  <span className={order.shipping === 0 ? "font-medium text-green" : "text-text-dark"}>
                    {order.shipping === 0 ? "Fri frakt" : `${formatPrice(order.shipping)} kr`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-mid">Moms (25%)</span>
                  <span className="text-text-dark">
                    {formatPrice(order.totalInclVat - order.subtotal - order.shipping)} kr
                  </span>
                </div>
                <div className="mt-2 flex justify-between border-t border-border pt-3">
                  <span className="font-heading text-base font-bold text-text-dark">Totalt</span>
                  <span className="font-heading text-xl font-extrabold text-text-dark">
                    {formatPrice(order.totalInclVat)} kr
                  </span>
                </div>
              </div>
            </div>

            {/* Customer & payment info */}
            <div className="grid gap-6 px-6 py-5 sm:grid-cols-2">
              {/* Delivery address */}
              {order.customer?.name && (
                <div>
                  <div className="mb-2 flex items-center gap-2 text-sm font-bold text-text-dark">
                    <MapPin size={16} className="text-navy" />
                    Leveransadress
                  </div>
                  <div className="text-sm leading-relaxed text-text-mid">
                    <div>{order.customer.name}</div>
                    {order.customer.address?.line1 && <div>{order.customer.address.line1}</div>}
                    {(order.customer.address?.postal_code || order.customer.address?.city) && (
                      <div>
                        {order.customer.address.postal_code} {order.customer.address.city}
                      </div>
                    )}
                    {order.customer.phone && <div className="mt-1">{order.customer.phone}</div>}
                  </div>
                </div>
              )}

              {/* Payment method */}
              {order.cardLast4 && (
                <div>
                  <div className="mb-2 flex items-center gap-2 text-sm font-bold text-text-dark">
                    <CreditCard size={16} className="text-navy" />
                    Betalning
                  </div>
                  <div className="text-sm text-text-mid">
                    {cardBrandName(order.cardBrand)} •••• {order.cardLast4}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-xl bg-navy px-6 py-3 font-heading text-sm font-bold text-white transition-colors hover:bg-navy-light"
          >
            Tillbaka till shoppen
          </Link>
          <Link
            href="/kontakt"
            className="rounded-xl border border-border px-6 py-3 font-heading text-sm font-bold text-text-dark transition-colors hover:bg-surface"
          >
            Kontakta oss
          </Link>
        </div>
      </div>
    </div>
  )
}
