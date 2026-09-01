"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { ShoppingCart, Loader2, Lock, Truck, ChevronDown, ChevronUp, Building2 } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useAttribution } from "@/lib/attribution-context"
import { track } from "@/lib/track"
import FadeIn from "@/components/FadeIn"
import {
  EMPTY_FORM,
  UNLOADING_OPTIONS,
  validateCheckout,
  vatNrFromOrgNr,
  isValidOrgNr,
} from "@/lib/checkout"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE)

const SHIPPING_COST = 556 // exkl. moms
const VAT_RATE = 1.25

function formatPrice(n) {
  return new Intl.NumberFormat("sv-SE").format(n)
}

/** Kassan räknar alltid i B2B-form: netto, moms för sig, brutto att betala. */
function priceBreakdown(totalPriceInclVat, freeShipping = false) {
  const productsExcl = Math.round(totalPriceInclVat / VAT_RATE)
  const shippingExcl = freeShipping ? 0 : SHIPPING_COST
  const totalInclVat = totalPriceInclVat + Math.round(shippingExcl * VAT_RATE)
  return {
    productsExcl,
    shippingExcl,
    vat: totalInclVat - productsExcl - shippingExcl,
    totalInclVat,
  }
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

/* ───────────── Fältkomponenter ───────────── */
function FormInput({ label, error, hint, optional = false, ...props }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-text-dark">
        {label} {optional ? <span className="text-text-light">(valfritt)</span> : "*"}
      </label>
      <input
        {...props}
        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-text-dark outline-none transition-colors placeholder:text-text-light focus:border-navy ${
          error ? "border-red-400" : "border-border"
        }`}
      />
      {hint && !error && <p className="mt-1 text-xs text-text-light">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}

function FormTextarea({ label, error, hint, optional = false, ...props }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-text-dark">
        {label} {optional ? <span className="text-text-light">(valfritt)</span> : "*"}
      </label>
      <textarea
        rows={3}
        {...props}
        className={`w-full resize-y rounded-xl border bg-white px-4 py-3 text-sm text-text-dark outline-none transition-colors placeholder:text-text-light focus:border-navy ${
          error ? "border-red-400" : "border-border"
        }`}
      />
      {hint && !error && <p className="mt-1 text-xs text-text-light">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}

function SectionHeading({ children, note }) {
  return (
    <div className="mb-5">
      <h2 className="font-heading text-xl font-bold text-text-dark">{children}</h2>
      {note && <p className="mt-1 text-sm text-text-mid">{note}</p>}
    </div>
  )
}

/* ───────────── Checkout form (inside Elements provider) ───────────── */
function CheckoutForm({ form, setForm, errors, setErrors, totalPrice, clientSecret, freeShipping }) {
  const stripe = useStripe()
  const elements = useElements()
  const hamtaKallan = useAttribution()
  const [loading, setLoading] = useState(false)
  const [paymentError, setPaymentError] = useState(null)
  // Så länge kunden inte själv rört momsnumret följer det organisationsnumret
  const [vatTouched, setVatTouched] = useState(false)

  const { totalInclVat } = priceBreakdown(totalPrice, freeShipping)

  const handleChange = (field) => (e) => {
    const value = e.target.value
    setForm((prev) => {
      const next = { ...prev, [field]: value }
      if (field === "orgNr" && !vatTouched) {
        next.vatNr = isValidOrgNr(value) ? vatNrFromOrgNr(value) : ""
      }
      if (field === "vatNr") setVatTouched(true)
      return next
    })
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }))
  }

  // Fäst beställarens mejl på betalningen så fort adressen är giltig — inte
  // först vid bekräftelsen. En övergiven kassa var annars helt anonym och gick
  // aldrig att följa upp; nu ligger kontakt_epost på PaymentIntenten i Stripe.
  // Fire-and-forget med fördröjning: får aldrig störa själva kassan.
  useEffect(() => {
    const epost = String(form.email || "").trim()
    if (!clientSecret || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(epost)) return
    const t = setTimeout(() => {
      fetch("/api/kassa-kontakt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentIntentId: clientSecret.split("_secret_")[0],
          clientSecret,
          epost,
        }),
      }).catch(() => {})
    }, 1200)
    return () => clearTimeout(t)
  }, [form.email, clientSecret])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setPaymentError(null)

    const formErrors = validateCheckout(form)
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      const first = document.querySelector(`[data-field="${Object.keys(formErrors)[0]}"]`)
      first?.scrollIntoView({ block: "center" })
      /*
       * Var kunden fastnar i kassan.
       *
       * Ett avhopp syns i dag bara som en PaymentIntent som blir kvar på
       * requires_payment_method, utan att det går att se varför. Kraven på
       * orgnr, er referens och fakturamejl är hårdare än vad en B2B-köpare
       * väntar sig, och slår ett av dem oftare än de andra ska det fältet
       * ifrågasättas. Bara fältnamnen skickas, aldrig vad kunden skrev.
       */
      track("kassa-valideringsfel", {
        falt: Object.keys(formErrors).sort().join(","),
        antal: Object.keys(formErrors).length,
      })
      return
    }

    if (!stripe || !elements) return

    setLoading(true)

    // Spara företags- och leveransuppgifterna på betalningen innan den bekräftas,
    // annars saknas de i orderbekräftelsen och i Stripe. Källan följer med samma
    // anrop: den är fångad vid landningen och finns bara i minnet fram till hit.
    try {
      const res = await fetch("/api/order-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentIntentId: clientSecret.split("_secret_")[0],
          clientSecret,
          form,
          source: hamtaKallan(),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (data.errors) setErrors(data.errors)
        setPaymentError(data.error || "Kunde inte spara uppgifterna. Försök igen.")
        setLoading(false)
        return
      }
    } catch {
      setPaymentError("Kunde inte nå servern. Försök igen.")
      setLoading(false)
      return
    }

    const invoiceSame = form.invoiceSameAsDelivery !== false

    // Vakthund: confirmPayment kan bli hängande om Stripe öppnar ett steg som
    // aldrig blir klart (Link-verifiering, blockerad 3D Secure-ruta). Utan den
    // här snurrar knappen för alltid och kunden får aldrig veta varför.
    const watchdog = setTimeout(() => {
      setLoading(false)
      setPaymentError(
        "Betalningen tar ovanligt lång tid. Ladda om sidan och försök igen — " +
          "blir det samma sak, chatta med oss eller mejla info@batteriproffs.se så tar vi ordern manuellt."
      )
    }, 45000)

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/tack`,
          payment_method_data: {
            billing_details: {
              name: form.companyName,
              email: form.email,
              phone: form.phone,
              // Faktureringsadress — inte nödvändigtvis dit godset går
              address: {
                line1: invoiceSame ? form.address : form.invoiceAddress,
                line2: "",
                postal_code: (invoiceSame ? form.postalCode : form.invoicePostalCode).replace(/\s/g, ""),
                city: invoiceSame ? form.city : form.invoiceCity,
                state: "",
                country: "SE",
              },
            },
          },
        },
      })

      // Kommer vi hit gick något fel — lyckad betalning omdirigerar av sig själv
      if (error) {
        setPaymentError(error.message)
      }
    } catch (err) {
      // Integrationsfel från Stripe.js kastas i stället för att returneras.
      // Utan den här grenen dog knappen tyst i "Bearbetar betalning...".
      console.error("Stripe confirmPayment kastade:", err)
      setPaymentError(
        err?.message || "Betalningen kunde inte genomföras. Försök igen, eller chatta med oss så hjälper vi dig."
      )
    } finally {
      clearTimeout(watchdog)
      setLoading(false)
    }
  }

  const invoiceSame = form.invoiceSameAsDelivery !== false

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10">
      {/* Beställare först: mejlen fästs på betalningen så fort den är ifylld,
          och då kan en övergiven kassa följas upp. Med sektionen sist hann de
          flesta avhoppare aldrig dit. */}
      <div data-field="firstName">
        <SectionHeading note="Vem vi kontaktar om något behöver stämmas av.">
          Beställare
        </SectionHeading>
        <div className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput
              label="Förnamn"
              type="text"
              placeholder="Anna"
              autoComplete="given-name"
              value={form.firstName}
              onChange={handleChange("firstName")}
              error={errors.firstName}
            />
            <div data-field="lastName">
              <FormInput
                label="Efternamn"
                type="text"
                placeholder="Andersson"
                autoComplete="family-name"
                value={form.lastName}
                onChange={handleChange("lastName")}
                error={errors.lastName}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div data-field="email">
              <FormInput
                label="E-post"
                type="email"
                placeholder="anna@exempelindustri.se"
                autoComplete="email"
                value={form.email}
                onChange={handleChange("email")}
                error={errors.email}
              />
            </div>
            <div data-field="phone">
              <FormInput
                label="Telefon"
                type="tel"
                placeholder="070-123 45 67"
                autoComplete="tel"
                value={form.phone}
                onChange={handleChange("phone")}
                error={errors.phone}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Företagsuppgifter */}
      <div data-field="companyName">
        <SectionHeading note="Vi säljer till företag. Uppgifterna här hamnar på fakturan.">
          Företagsuppgifter
        </SectionHeading>
        <div className="flex flex-col gap-4">
          <FormInput
            label="Företagsnamn"
            type="text"
            placeholder="Exempel Industri AB"
            autoComplete="organization"
            value={form.companyName}
            onChange={handleChange("companyName")}
            error={errors.companyName}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <div data-field="orgNr">
              <FormInput
                label="Organisationsnummer"
                type="text"
                inputMode="numeric"
                placeholder="556677-8899"
                value={form.orgNr}
                onChange={handleChange("orgNr")}
                error={errors.orgNr}
              />
            </div>
            <div data-field="vatNr">
              <FormInput
                label="Momsregistreringsnummer"
                type="text"
                optional
                placeholder="SE556677889901"
                hint="Fylls i automatiskt från organisationsnumret"
                value={form.vatNr}
                onChange={handleChange("vatNr")}
                error={errors.vatNr}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div data-field="reference">
              <FormInput
                label="Er referens"
                type="text"
                placeholder="Anna Andersson"
                hint="Namnet på beställaren, trycks på fakturan"
                value={form.reference}
                onChange={handleChange("reference")}
                error={errors.reference}
              />
            </div>
            <div data-field="poNumber">
              <FormInput
                label="Inköpsordernr / kostnadsställe"
                type="text"
                optional
                placeholder="PO-12345"
                value={form.poNumber}
                onChange={handleChange("poNumber")}
                error={errors.poNumber}
              />
            </div>
          </div>
          <div data-field="invoiceEmail">
            <FormInput
              label="Fakturaadress e-post"
              type="email"
              placeholder="faktura@exempelindustri.se"
              hint="Dit skickar vi fakturan — ofta en annan adress än beställarens"
              value={form.invoiceEmail}
              onChange={handleChange("invoiceEmail")}
              error={errors.invoiceEmail}
            />
          </div>
        </div>
      </div>

      {/* Leveransadress */}
      <div data-field="address">
        <SectionHeading>Leveransadress</SectionHeading>
        <div className="flex flex-col gap-4">
          <FormInput
            label="Gatuadress"
            type="text"
            placeholder="Industrivägen 12"
            value={form.address}
            onChange={handleChange("address")}
            error={errors.address}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <div data-field="postalCode">
              <FormInput
                label="Postnummer"
                type="text"
                inputMode="numeric"
                placeholder="123 45"
                value={form.postalCode}
                onChange={handleChange("postalCode")}
                error={errors.postalCode}
              />
            </div>
            <div data-field="city">
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
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput
              label="Godsmottagare / att"
              type="text"
              optional
              placeholder="Lagret, Erik Svensson"
              value={form.goodsRecipient}
              onChange={handleChange("goodsRecipient")}
              error={errors.goodsRecipient}
            />
            <FormInput
              label="Portkod"
              type="text"
              optional
              placeholder="1234"
              value={form.doorCode}
              onChange={handleChange("doorCode")}
              error={errors.doorCode}
            />
          </div>
          <div data-field="deliveryPhone">
            <FormInput
              label="Telefon till godsmottagningen"
              type="tel"
              optional
              placeholder="Om annat än beställarens nummer"
              hint="Chauffören ringer hit före leverans"
              value={form.deliveryPhone}
              onChange={handleChange("deliveryPhone")}
              error={errors.deliveryPhone}
            />
          </div>
          <div data-field="deliveryNote">
            <FormTextarea
              label="Leveransinstruktioner"
              optional
              placeholder="Infart från baksidan, ring vid grinden."
              value={form.deliveryNote}
              onChange={handleChange("deliveryNote")}
              error={errors.deliveryNote}
            />
          </div>
        </div>
      </div>

      {/* Lossning — batterierna går som pallgods */}
      <div data-field="unloading">
        <SectionHeading note="Batterierna skickas på pall. Vet du hur de kan lossas hos er går leveransen snabbare — annars ringer vi och stämmer av.">
          Lossning vid leverans <span className="text-base font-normal text-text-light">(valfritt)</span>
        </SectionHeading>
        <div className="grid gap-3 sm:grid-cols-3">
          {UNLOADING_OPTIONS.map((opt) => {
            const active = form.unloading === opt.value
            return (
              <label
                key={opt.value}
                className={`cursor-pointer rounded-xl border p-4 transition-colors ${
                  active ? "border-navy bg-surface" : "border-border bg-white hover:border-navy/40"
                }`}
              >
                <input
                  type="radio"
                  name="unloading"
                  value={opt.value}
                  checked={active}
                  onChange={handleChange("unloading")}
                  className="sr-only"
                />
                <span className="block text-sm font-semibold text-text-dark">{opt.label}</span>
                <span className="mt-1 block text-xs text-text-mid">{opt.hint}</span>
              </label>
            )
          })}
        </div>
        {errors.unloading && <p className="mt-2 text-xs text-red-500">{errors.unloading}</p>}
      </div>

      {/* Fakturaadress */}
      <div data-field="invoiceAddress">
        <SectionHeading>Fakturaadress</SectionHeading>
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-surface p-4">
          <input
            type="checkbox"
            checked={invoiceSame}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, invoiceSameAsDelivery: e.target.checked }))
            }
            className="h-4 w-4 accent-navy"
          />
          <span className="text-sm font-medium text-text-dark">
            Fakturaadressen är samma som leveransadressen
          </span>
        </label>

        {!invoiceSame && (
          <div className="mt-4 flex flex-col gap-4">
            <FormInput
              label="Fakturaadress"
              type="text"
              placeholder="Box 123"
              value={form.invoiceAddress}
              onChange={handleChange("invoiceAddress")}
              error={errors.invoiceAddress}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <div data-field="invoicePostalCode">
                <FormInput
                  label="Postnummer"
                  type="text"
                  inputMode="numeric"
                  placeholder="123 45"
                  value={form.invoicePostalCode}
                  onChange={handleChange("invoicePostalCode")}
                  error={errors.invoicePostalCode}
                />
              </div>
              <div data-field="invoiceCity">
                <FormInput
                  label="Ort"
                  type="text"
                  placeholder="Stockholm"
                  value={form.invoiceCity}
                  onChange={handleChange("invoiceCity")}
                  error={errors.invoiceCity}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Leveranssätt */}
      <div>
        <SectionHeading>Leveranssätt</SectionHeading>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4">
          <Truck size={20} className="text-text-mid" />
          <div className="flex-1">
            <div className="text-sm font-semibold text-text-dark">
              PostNord — Företagsleverans (normalt 1–3 dagar)
            </div>
            <div className="text-xs text-text-mid">Spårningsnummer mejlas när ordern skickats</div>
          </div>
          <span className="font-heading text-sm font-bold text-text-dark">
            {freeShipping ? "Fri frakt" : `${formatPrice(SHIPPING_COST)} kr`}
          </span>
        </div>
        {!freeShipping && (
          <p className="mt-2 text-xs text-text-light">Fraktpris angivet exkl. moms.</p>
        )}
      </div>

      {/* Stripe Payment Element */}
      <div>
        <SectionHeading note="Vi tar emot kortbetalning. Kvitto och faktura skickas till fakturaadressen ovan.">
          Betalning
        </SectionHeading>
        <div className="rounded-xl border border-border bg-white p-5">
          <PaymentElement options={{ layout: "tabs", fields: { billingDetails: "never" } }} />
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
        {["Visa", "Mastercard", "PostNord"].map((m) => (
          <span key={m} className="text-[10px] font-semibold uppercase tracking-wider text-text-mid/60">
            {m}
          </span>
        ))}
      </div>
    </form>
  )
}

/* ───────────── Order summary sidebar ───────────── */
function OrderSummary({ items, totalPrice, freeShipping }) {
  const [expanded, setExpanded] = useState(true)
  const { productsExcl, shippingExcl, vat, totalInclVat } = priceBreakdown(totalPrice, freeShipping)

  return (
    <div className="rounded-2xl border border-border bg-surface">
      {/* Mobile toggle */}
      <button
        type="button"
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
        <h2 className="font-heading text-lg font-bold text-text-dark">Din beställning</h2>
      </div>

      {/* Collapsible content */}
      <div className={`${expanded ? "block" : "hidden"} lg:block`}>
        {/* Products */}
        <div className="flex flex-col gap-3 p-5">
          {items.map((item) => (
            <div key={item.slug} className="flex gap-3">
              <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-white">
                <Image src={item.images[0]} alt={item.shortName} fill className="object-contain p-1" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="truncate text-sm font-semibold text-text-dark">{item.shortName}</div>
                <div className="text-xs text-text-mid">
                  {item.capacity} · Antal: {item.qty}
                </div>
              </div>
              <div className="text-sm font-bold text-text-dark whitespace-nowrap">
                {formatPrice(Math.round((item.price / VAT_RATE) * item.qty))} kr
              </div>
            </div>
          ))}
        </div>

        {/* Totals — B2B: netto, moms, brutto */}
        <div className="border-t border-border p-5">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-text-mid">Produkter exkl. moms</span>
            <span className="font-medium text-text-dark">{formatPrice(productsExcl)} kr</span>
          </div>

          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-text-mid">Frakt exkl. moms</span>
            <span className="font-medium text-text-dark">
              {shippingExcl === 0 ? "Fri" : `${formatPrice(shippingExcl)} kr`}
            </span>
          </div>

          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-text-mid">Moms (25%)</span>
            <span className="font-medium text-text-dark">{formatPrice(vat)} kr</span>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
            <span className="font-heading text-base font-bold text-text-dark">Att betala</span>
            <span className="font-heading text-xl font-extrabold text-text-dark">
              {formatPrice(totalInclVat)} kr
            </span>
          </div>

          <div className="mt-1 text-right text-[11px] text-text-light">Inkl. moms</div>
        </div>
      </div>
    </div>
  )
}

/* ───────────── Main CheckoutContent ───────────── */
export default function CheckoutContent() {
  const { items, totalPrice } = useCart()
  // Serverns beräkning är den som gäller — det här styr bara vad kassan visar
  const freeShipping = items.length > 0 && items.every((i) => i.freeShipping)
  const [clientSecret, setClientSecret] = useState(null)
  const [error, setError] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formErrors, setFormErrors] = useState({})

  // Påbörjad kassa — mäts en gång när kassan öppnas med varor i korgen
  useEffect(() => {
    if (items.length === 0) return
    if (typeof window !== "undefined" && window.umami) {
      window.umami.track("paborjad-kassa", { rader: items.length, varde: totalPrice })
    }
    // Avsiktligt bara vid montering; korgändringar ska inte räknas som ny kassa
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Create PaymentIntent on mount
  useEffect(() => {
    if (items.length === 0) return

    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((i) => ({ slug: i.slug, qty: i.qty })),
      }),
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
        <h1 className="mb-2 font-heading text-2xl font-extrabold text-text-dark">Något gick fel</h1>
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
            <div className="mb-2 text-xs font-bold uppercase tracking-widest text-amber-text">Kassa</div>
            <h1 className="font-heading text-[clamp(28px,4vw,40px)] font-extrabold tracking-tight text-text-dark">
              Slutför din beställning
            </h1>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2">
              <Building2 size={15} className="text-navy" />
              <span className="text-sm font-medium text-text-dark">
                Företagsbeställning — alla priser visas exkl. moms
              </span>
            </div>
          </FadeIn>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 sm:py-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_400px]">
          {/* Left: Form */}
          <FadeIn>
            {/* key={clientSecret} tvingar omstart av Elements när varukorgen
                ändras i kassan — annars sitter betalfältet kvar på den gamla
                betalningen och kunden hade debiterats fel belopp. */}
            <Elements
              key={clientSecret}
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
                clientSecret={clientSecret}
                freeShipping={freeShipping}
              />
            </Elements>
          </FadeIn>

          {/* Right: Order summary */}
          <FadeIn delay={0.1}>
            <div className="lg:sticky lg:top-6 lg:self-start">
              <OrderSummary items={items} totalPrice={totalPrice} freeShipping={freeShipping} />
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  )
}
