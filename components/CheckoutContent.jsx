"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { ShoppingCart, Loader2, Lock, Truck, ChevronDown, ChevronUp } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useVat } from "@/lib/vat-context"
import FadeIn from "@/components/FadeIn"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

const SHIPPING_THRESHOLD = 2000
const SHIPPING_COST = 149

function formatPrice(n) {
  return new Intl.NumberFormat("sv-SE").format(n)
}

/* ───────────── Stripe appearance to match site design ───────────── */
const stripeAppearance = {
  theme: "stripe",
  variables: {
    colorPrimary: "#0B1D3A",
    colorBackground: "#FFFFFF",
    colorText: "#1A1A1A",
    colorDanger: "#ef4444",
    fontFamily: "DM Sans, sans-serif",
    borderRadius: "12px",
    spacingUnit: "4px",
  },
  rules: {
    ".Input": {
      border: "1px solid #E5E5E5",
      padding: "12px 16px",
      fontSize: "14px",
      boxShadow: "none",
    },
    ".Input:focus": {
      border: "1px solid #0B1D3A",
      boxShadow: "0 0 0 3px rgba(11, 29, 58, 0.06)",
    },
    ".Label": {
      fontSize: "14px",
      fontWeight: "500",
      color: "#1A1A1A",
    },
  },
}

/* ───────────── Validation helpers ───────────── */
function validateForm(form) {
  const errors = {}
  if (!form.firstName || form.firstName.length < 2) errors.firstName = "Ange förnamn"
  if (!form.lastName || form.lastName.length < 2) errors.lastName = "Ange efternamn"
  if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Ange en giltig e-postadress"
  if (!form.phone || !/^[\d\s\-+]{7,15}$/.test(form.phone)) errors.phone = "Ange ett giltigt telefonnummer"
  if (!form.address || form.address.length < 2) errors.address = "Ange gatuadress"
  if (!form.postalCode || !/^\d{3}\s?\d{2}$/.test(form.postalCode)) errors.postalCode = "Ange postnummer (XXX XX)"
  if (!form.city || form.city.length < 2) errors.city = "Ange ort"
  return errors
}

/* ───────────── Input component ───────────── */
function FormInput({ label, error, ...props }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-text-dark">{label} *</label>
      <input
        {...props}
        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-text-dark outline-none transition-colors placeholder:text-text-light focus:border-navy ${
          error ? "border-red-400" : "border-border"
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}

/* ───────────── Checkout form (inside Elements provider) ───────────── */
function CheckoutForm({ form, setForm, errors, setErrors, totalPrice, shippingCost }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [paymentError, setPaymentError] = useState(null)

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setPaymentError(null)

    // Validate form
    const formErrors = validateForm(form)
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }

    if (!stripe || !elements) return

    setLoading(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/tack`,
        payment_method_data: {
          billing_details: {
            name: `${form.firstName} ${form.lastName}`,
            email: form.email,
            phone: form.phone,
            address: {
              line1: form.address,
              postal_code: form.postalCode.replace(/\s/g, ""),
              city: form.city,
              country: "SE",
            },
          },
        },
      },
    })

    // If we get here, something went wrong (success redirects automatically)
    if (error) {
      setPaymentError(error.message)
    }
    setLoading(false)
  }

  const { displayPrice, vatLabel, inclVat } = useVat()
  const totalInclVat = Math.round((totalPrice + shippingCost) * 1.25)

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {/* Customer info */}
      <div>
        <h2 className="mb-5 font-heading text-xl font-bold text-text-dark">Dina uppgifter</h2>
        <div className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput
              label="Förnamn"
              type="text"
              placeholder="Anna"
              value={form.firstName}
              onChange={handleChange("firstName")}
              error={errors.firstName}
            />
            <FormInput
              label="Efternamn"
              type="text"
              placeholder="Andersson"
              value={form.lastName}
              onChange={handleChange("lastName")}
              error={errors.lastName}
            />
          </div>
          <FormInput
            label="E-post"
            type="email"
            placeholder="anna@exempel.se"
            value={form.email}
            onChange={handleChange("email")}
            error={errors.email}
          />
          <FormInput
            label="Telefon"
            type="tel"
            placeholder="070-123 45 67"
            value={form.phone}
            onChange={handleChange("phone")}
            error={errors.phone}
          />
        </div>
      </div>

      {/* Delivery address */}
      <div>
        <h2 className="mb-5 font-heading text-xl font-bold text-text-dark">Leveransadress</h2>
        <div className="flex flex-col gap-4">
          <FormInput
            label="Gatuadress"
            type="text"
            placeholder="Storgatan 1"
            value={form.address}
            onChange={handleChange("address")}
            error={errors.address}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput
              label="Postnummer"
              type="text"
              placeholder="123 45"
              value={form.postalCode}
              onChange={handleChange("postalCode")}
              error={errors.postalCode}
            />
            <FormInput
              label="Ort"
              type="text"
              placeholder="Stockholm"
              value={form.city}
              onChange={handleChange("city")}
              error={errors.city}
            />
          </div>
        </div>
      </div>

      {/* Shipping info */}
      <div>
        <h2 className="mb-5 font-heading text-xl font-bold text-text-dark">Leveranssätt</h2>
        <div className={`flex items-center gap-3 rounded-xl border p-4 ${
          shippingCost === 0 ? "border-green/20 bg-green/5" : "border-border bg-surface"
        }`}>
          <Truck size={20} className={shippingCost === 0 ? "text-green" : "text-text-mid"} />
          <div className="flex-1">
            <div className="text-sm font-semibold text-text-dark">
              PostNord — Hemleverans (1–3 dagar)
            </div>
            <div className="text-xs text-text-mid">Spårningsnummer skickas via e-post</div>
          </div>
          <span className={`font-heading text-sm font-bold ${shippingCost === 0 ? "text-green" : "text-text-dark"}`}>
            {shippingCost === 0 ? "Fri frakt" : `${formatPrice(inclVat ? Math.round(SHIPPING_COST * 1.25) : SHIPPING_COST)} kr`}
          </span>
        </div>
      </div>

      {/* Stripe Payment Element */}
      <div>
        <h2 className="mb-5 font-heading text-xl font-bold text-text-dark">Betalning</h2>
        <div className="rounded-xl border border-border bg-white p-5">
          <PaymentElement options={{ layout: "tabs" }} />
        </div>
        {paymentError && (
          <div className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {paymentError}
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || !stripe}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[#16a34a] to-[#15803d] py-4 font-heading text-base font-bold text-white shadow-lg transition-transform hover:-translate-y-px disabled:opacity-70 disabled:hover:translate-y-0"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Bearbetar betalning...
          </>
        ) : (
          <>
            <Lock size={16} />
            Slutför köp — {formatPrice(totalInclVat)} kr
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-3">
        {["Swish", "Visa", "Mastercard", "PostNord"].map((m) => (
          <span key={m} className="text-[10px] font-semibold uppercase tracking-wider text-text-mid/60">
            {m}
          </span>
        ))}
      </div>
    </form>
  )
}

/* ───────────── Order summary sidebar ───────────── */
function OrderSummary({ items, totalPrice, shippingCost }) {
  const { displayPrice, vatLabel, inclVat } = useVat()
  const [expanded, setExpanded] = useState(true)

  const totalInclVat = Math.round((totalPrice + shippingCost) * 1.25)

  return (
    <div className="rounded-2xl border border-border bg-surface">
      {/* Mobile toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between p-5 lg:hidden"
      >
        <span className="font-heading text-base font-bold text-text-dark">
          Ordersammanfattning ({items.length})
        </span>
        <div className="flex items-center gap-2">
          <span className="font-heading text-base font-extrabold text-text-dark">
            {formatPrice(totalInclVat)} kr
          </span>
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {/* Desktop heading */}
      <div className="hidden border-b border-border p-5 lg:block">
        <h2 className="font-heading text-lg font-bold text-text-dark">
          Din beställning
        </h2>
      </div>

      {/* Collapsible content */}
      <div className={`${expanded ? "block" : "hidden"} lg:block`}>
        {/* Products */}
        <div className="flex flex-col gap-3 p-5">
          {items.map((item) => (
            <div key={item.slug} className="flex gap-3">
              <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-white">
                <Image
                  src={item.images[0]}
                  alt={item.shortName}
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="truncate text-sm font-semibold text-text-dark">
                  {item.shortName}
                </div>
                <div className="text-xs text-text-mid">
                  {item.capacity} · Antal: {item.qty}
                </div>
              </div>
              <div className="text-sm font-bold text-text-dark whitespace-nowrap">
                {formatPrice(displayPrice(item.price) * item.qty)} kr
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t border-border p-5">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-text-mid">Produkter {vatLabel.toLowerCase()}</span>
            <span className="font-medium text-text-dark">
              {formatPrice(inclVat ? Math.round(totalPrice * 1.25) : totalPrice)} kr
            </span>
          </div>

          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-text-mid">Frakt</span>
            <span className={`font-medium ${shippingCost === 0 ? "text-green" : "text-text-dark"}`}>
              {shippingCost === 0
                ? "Fri frakt"
                : `${formatPrice(inclVat ? Math.round(SHIPPING_COST * 1.25) : SHIPPING_COST)} kr`}
            </span>
          </div>

          {/* Free shipping progress */}
          {shippingCost > 0 && (
            <div className="mb-3 rounded-lg bg-amber-bg/8 px-3 py-2">
              <div className="h-1.5 overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full bg-amber-bg transition-all"
                  style={{ width: `${Math.min(100, (totalPrice / SHIPPING_THRESHOLD) * 100)}%` }}
                />
              </div>
              <div className="mt-1 text-[11px] text-text-light">
                {formatPrice(inclVat ? Math.round((SHIPPING_THRESHOLD - totalPrice) * 1.25) : SHIPPING_THRESHOLD - totalPrice)} kr kvar till fri frakt
              </div>
            </div>
          )}

          {!inclVat && (
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-text-mid">Moms (25%)</span>
              <span className="font-medium text-text-dark">
                {formatPrice(Math.round((totalPrice + shippingCost) * 0.25))} kr
              </span>
            </div>
          )}

          <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
            <span className="font-heading text-base font-bold text-text-dark">Att betala</span>
            <span className="font-heading text-xl font-extrabold text-text-dark">
              {formatPrice(totalInclVat)} kr
            </span>
          </div>

          <div className="mt-1 text-right text-[11px] text-text-light">
            Inkl. moms
          </div>
        </div>
      </div>
    </div>
  )
}

/* ───────────── Main CheckoutContent ───────────── */
export default function CheckoutContent() {
  const { items, totalPrice, totalItems } = useCart()
  const [clientSecret, setClientSecret] = useState(null)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    postalCode: "",
    city: "",
  })
  const [formErrors, setFormErrors] = useState({})

  const shippingCost = totalPrice >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST

  // Create PaymentIntent on mount
  useEffect(() => {
    if (items.length === 0) return

    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret)
        } else {
          setError(data.error || "Kunde inte skapa betalning")
        }
      })
      .catch(() => setError("Kunde inte nå servern. Försök igen."))
  }, [items])

  // Empty cart
  if (items.length === 0) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-16 text-center">
        <ShoppingCart size={48} className="mb-4 text-border" strokeWidth={1.5} />
        <h1 className="mb-2 font-heading text-2xl font-extrabold text-text-dark">
          Varukorgen är tom
        </h1>
        <p className="mb-6 text-text-mid">Lägg till produkter för att gå till kassan.</p>
        <Link
          href="/"
          className="rounded-xl bg-navy px-6 py-3 font-heading text-sm font-bold text-white transition-colors hover:bg-navy-light"
        >
          Tillbaka till shoppen
        </Link>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="mb-2 font-heading text-2xl font-extrabold text-text-dark">
          Något gick fel
        </h1>
        <p className="mb-6 text-text-mid">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-xl bg-navy px-6 py-3 font-heading text-sm font-bold text-white transition-colors hover:bg-navy-light"
        >
          Försök igen
        </button>
      </div>
    )
  }

  // Loading state
  if (!clientSecret) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 size={32} className="animate-spin text-navy" />
      </div>
    )
  }

  return (
    <div className="bg-white">
      {/* Page header */}
      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-[1200px] px-4 pb-8 pt-10 sm:px-6">
          <FadeIn>
            <div className="mb-2 text-xs font-bold uppercase tracking-widest text-amber">Kassa</div>
            <h1 className="font-heading text-[clamp(28px,4vw,40px)] font-extrabold tracking-tight text-text-dark">
              Slutför din beställning
            </h1>
          </FadeIn>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 sm:py-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_400px]">
          {/* Left: Form */}
          <FadeIn>
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: stripeAppearance,
                locale: "sv",
              }}
            >
              <CheckoutForm
                form={form}
                setForm={setForm}
                errors={formErrors}
                setErrors={setFormErrors}
                totalPrice={totalPrice}
                shippingCost={shippingCost}
              />
            </Elements>
          </FadeIn>

          {/* Right: Order summary */}
          <FadeIn delay={0.1}>
            <div className="lg:sticky lg:top-6 lg:self-start">
              <OrderSummary
                items={items}
                totalPrice={totalPrice}
                shippingCost={shippingCost}
              />
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  )
}
