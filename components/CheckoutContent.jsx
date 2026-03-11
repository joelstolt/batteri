"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Lock, Truck, CreditCard, ShieldCheck, CheckCircle, ArrowLeft } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { PHONE } from "@/lib/constants"

function formatPrice(n) {
  return new Intl.NumberFormat("sv-SE").format(n)
}

const SHIPPING_THRESHOLD = 2000
const SHIPPING_COST = 149

export default function CheckoutContent() {
  const { items, totalPrice, updateQty, removeItem } = useCart()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [form, setForm] = useState({
    email: "", phone: "",
    firstName: "", lastName: "", company: "",
    address: "", zip: "", city: "",
    cardName: "", cardNumber: "", cardExpiry: "", cardCvc: "",
  })

  const shippingFree = totalPrice >= SHIPPING_THRESHOLD
  const shippingCost = shippingFree ? 0 : SHIPPING_COST
  const totalWithShipping = totalPrice + shippingCost
  const totalWithMoms = Math.round(totalWithShipping * 1.25)

  const update = (key, val) => setForm({ ...form, [key]: val })

  const handlePlaceOrder = (e) => {
    e.preventDefault()
    setOrderPlaced(true)
  }

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-4 text-5xl">🛒</div>
        <h1 className="mb-2 font-heading text-2xl font-extrabold text-text-dark">Varukorgen är tom</h1>
        <p className="mb-6 text-text-mid">Lägg till produkter innan du går till kassan.</p>
        <Link href="/" className="rounded-xl bg-navy px-6 py-3 font-heading text-sm font-bold text-white hover:bg-navy-light">
          Tillbaka till shoppen
        </Link>
      </div>
    )
  }

  if (orderPlaced) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green/10">
          <CheckCircle size={36} className="text-green" />
        </div>
        <h1 className="mb-2 font-heading text-2xl font-extrabold text-text-dark">Tack för din beställning!</h1>
        <p className="mb-2 max-w-md text-text-mid">
          En orderbekräftelse har skickats till <strong className="text-text-dark">{form.email || "din e-post"}</strong>.
        </p>
        <p className="mb-8 text-sm text-text-light">
          Ordernummer: <span className="font-mono font-semibold text-text-dark">BP-{Math.floor(Math.random() * 90000 + 10000)}</span>
        </p>
        <div className="mb-6 rounded-xl border border-border bg-surface p-5 text-left">
          <div className="mb-3 text-sm font-bold text-text-dark">Leveransinformation</div>
          <div className="flex flex-col gap-1 text-sm text-text-mid">
            <span>Beräknad leverans: 1–3 arbetsdagar</span>
            <span>Fraktsätt: PostNord</span>
            <span>Du får spårningsnummer via e-post</span>
          </div>
        </div>
        <Link href="/" className="rounded-xl bg-navy px-6 py-3 font-heading text-sm font-bold text-white hover:bg-navy-light">
          Tillbaka till shoppen
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-[960px] px-4 py-3 sm:px-6">
          <nav className="flex items-center gap-2 text-sm text-text-mid">
            <Link href="/" className="hover:text-text-dark">Hem</Link>
            <ChevronRight size={12} className="text-border-dark" />
            <span className="font-medium text-text-dark">Kassan</span>
          </nav>
        </div>
      </div>

      {/* Secure badge */}
      <div className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-[960px] items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium text-text-mid sm:px-6">
          <Lock size={12} className="text-green" />
          Säker betalning — All data krypteras med SSL
        </div>
      </div>

      <div className="mx-auto max-w-[960px] px-4 py-8 sm:px-6">
        {/* Step indicator */}
        <div className="mb-8 flex items-center justify-center gap-3">
          {[
            { num: 1, label: "Leverans" },
            { num: 2, label: "Betalning" },
          ].map((s, i) => (
            <div key={s.num} className="flex items-center gap-3">
              <button
                onClick={() => s.num < step ? setStep(s.num) : null}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                  step === s.num
                    ? "bg-navy text-white"
                    : step > s.num
                    ? "bg-green/10 text-green"
                    : "bg-surface text-text-light"
                }`}
              >
                {step > s.num ? <CheckCircle size={14} /> : <span>{s.num}</span>}
                <span className="hidden sm:inline">{s.label}</span>
              </button>
              {i < 1 && <div className="h-px w-8 bg-border sm:w-12" />}
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Left — Form */}
          <div>
            {step === 1 && (
              <div>
                <h2 className="mb-5 font-heading text-xl font-bold text-text-dark">
                  Leveransinformation
                </h2>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-text-dark">Förnamn *</label>
                      <input type="text" value={form.firstName} onChange={(e) => update("firstName", e.target.value)}
                        className="w-full rounded-xl border border-border px-4 py-3 text-sm text-text-dark placeholder:text-text-light" placeholder="Förnamn" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-text-dark">Efternamn *</label>
                      <input type="text" value={form.lastName} onChange={(e) => update("lastName", e.target.value)}
                        className="w-full rounded-xl border border-border px-4 py-3 text-sm text-text-dark placeholder:text-text-light" placeholder="Efternamn" />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-dark">Företag (valfritt)</label>
                    <input type="text" value={form.company} onChange={(e) => update("company", e.target.value)}
                      className="w-full rounded-xl border border-border px-4 py-3 text-sm text-text-dark placeholder:text-text-light" placeholder="Företagsnamn" />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-dark">E-post *</label>
                    <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)}
                      className="w-full rounded-xl border border-border px-4 py-3 text-sm text-text-dark placeholder:text-text-light" placeholder="din@epost.se" />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-dark">Telefon *</label>
                    <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)}
                      className="w-full rounded-xl border border-border px-4 py-3 text-sm text-text-dark placeholder:text-text-light" placeholder="070-123 45 67" />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-dark">Adress *</label>
                    <input type="text" value={form.address} onChange={(e) => update("address", e.target.value)}
                      className="w-full rounded-xl border border-border px-4 py-3 text-sm text-text-dark placeholder:text-text-light" placeholder="Gatuadress" />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-text-dark">Postnummer *</label>
                      <input type="text" value={form.zip} onChange={(e) => update("zip", e.target.value)}
                        className="w-full rounded-xl border border-border px-4 py-3 text-sm text-text-dark placeholder:text-text-light" placeholder="123 45" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-text-dark">Ort *</label>
                      <input type="text" value={form.city} onChange={(e) => update("city", e.target.value)}
                        className="w-full rounded-xl border border-border px-4 py-3 text-sm text-text-dark placeholder:text-text-light" placeholder="Stockholm" />
                    </div>
                  </div>

                  {/* Shipping method */}
                  <div className="mt-2">
                    <div className="mb-3 text-sm font-bold text-text-dark">Fraktsätt</div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between rounded-xl border-2 border-navy bg-navy/3 p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-navy">
                            <div className="h-2.5 w-2.5 rounded-full bg-navy" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-text-dark">PostNord — Hemleverans</div>
                            <div className="text-xs text-text-mid">1–3 arbetsdagar</div>
                          </div>
                        </div>
                        <span className={`text-sm font-bold ${shippingFree ? "text-green" : "text-text-dark"}`}>
                          {shippingFree ? "GRATIS" : `${SHIPPING_COST} kr`}
                        </span>
                      </div>
                    </div>
                    {!shippingFree && (
                      <p className="mt-2 text-xs text-text-light">
                        Fri frakt vid order över {formatPrice(SHIPPING_THRESHOLD)} kr — du saknar {formatPrice(SHIPPING_THRESHOLD - totalPrice)} kr
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    className="mt-2 w-full rounded-xl bg-amber-bg py-4 font-heading text-base font-bold text-navy shadow-sm transition-all hover:-translate-y-px hover:shadow-md"
                  >
                    Fortsätt till betalning
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <form onSubmit={handlePlaceOrder}>
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="font-heading text-xl font-bold text-text-dark">Betalning</h2>
                  <button type="button" onClick={() => setStep(1)} className="flex items-center gap-1 text-sm font-medium text-accent hover:underline">
                    <ArrowLeft size={14} /> Tillbaka
                  </button>
                </div>

                {/* Delivery summary */}
                <div className="mb-6 rounded-xl border border-border bg-surface p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-mid">Levereras till</span>
                    <button type="button" onClick={() => setStep(1)} className="text-xs font-medium text-accent hover:underline">Ändra</button>
                  </div>
                  <div className="mt-1 text-sm font-medium text-text-dark">
                    {form.firstName} {form.lastName}{form.company && `, ${form.company}`}
                  </div>
                  <div className="text-sm text-text-mid">
                    {form.address}, {form.zip} {form.city}
                  </div>
                </div>

                {/* Card form */}
                <div className="mb-5 flex flex-col gap-4">
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-navy">
                      <div className="h-2.5 w-2.5 rounded-full bg-navy" />
                    </div>
                    <CreditCard size={18} className="text-text-mid" />
                    <span className="text-sm font-semibold text-text-dark">Kortbetalning</span>
                    <div className="ml-auto flex gap-2 text-[10px] font-bold uppercase text-text-light">
                      <span className="rounded border border-border px-1.5 py-0.5">Visa</span>
                      <span className="rounded border border-border px-1.5 py-0.5">MC</span>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-dark">Namn på kort *</label>
                    <input type="text" value={form.cardName} onChange={(e) => update("cardName", e.target.value)}
                      className="w-full rounded-xl border border-border px-4 py-3 text-sm text-text-dark placeholder:text-text-light" placeholder="Namn som det står på kortet" />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-dark">Kortnummer *</label>
                    <input type="text" value={form.cardNumber} onChange={(e) => update("cardNumber", e.target.value)}
                      className="w-full rounded-xl border border-border px-4 py-3 font-mono text-sm text-text-dark placeholder:text-text-light" placeholder="1234 5678 9012 3456" maxLength={19} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-text-dark">Utgångsdatum *</label>
                      <input type="text" value={form.cardExpiry} onChange={(e) => update("cardExpiry", e.target.value)}
                        className="w-full rounded-xl border border-border px-4 py-3 font-mono text-sm text-text-dark placeholder:text-text-light" placeholder="MM / ÅÅ" maxLength={7} />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-text-dark">CVC *</label>
                      <input type="text" value={form.cardCvc} onChange={(e) => update("cardCvc", e.target.value)}
                        className="w-full rounded-xl border border-border px-4 py-3 font-mono text-sm text-text-dark placeholder:text-text-light" placeholder="123" maxLength={4} />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[#16a34a] to-[#15803d] py-4 font-heading text-base font-bold text-white shadow-lg transition-all hover:-translate-y-px hover:shadow-xl"
                >
                  <Lock size={16} />
                  Betala {formatPrice(totalWithMoms)} kr
                </button>

                <div className="mt-3 flex items-center justify-center gap-2 text-xs text-text-light">
                  <ShieldCheck size={12} />
                  Säker betalning via krypterad anslutning
                </div>
              </form>
            )}
          </div>

          {/* Right — Order summary */}
          <div>
            <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
              <h3 className="mb-4 font-heading text-lg font-bold text-text-dark">
                Ordersammandrag
              </h3>

              {/* Items */}
              <div className="mb-4 flex flex-col gap-3">
                {items.map((item) => (
                  <div key={item.slug} className="flex items-center gap-3">
                    <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border border-border bg-white">
                      <Image src={item.images[0]} alt={item.shortName} fill className="object-contain p-1" sizes="56px" />
                      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-navy text-[10px] font-bold text-white">
                        {item.qty}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold text-text-dark">{item.shortName}</div>
                      <div className="text-xs text-text-mid">{item.voltage} · {item.capacity}</div>
                    </div>
                    <div className="text-sm font-bold text-text-dark">{formatPrice(item.price * item.qty)} kr</div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-border pt-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-mid">Delsumma</span>
                    <span className="font-medium text-text-dark">{formatPrice(totalPrice)} kr</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-mid">Frakt</span>
                    <span className={`font-medium ${shippingFree ? "text-green" : "text-text-dark"}`}>
                      {shippingFree ? "Gratis" : `${SHIPPING_COST} kr`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-mid">Moms (25%)</span>
                    <span className="font-medium text-text-dark">{formatPrice(Math.round(totalWithShipping * 0.25))} kr</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                  <span className="font-heading text-base font-bold text-text-dark">Totalt</span>
                  <span className="font-heading text-xl font-extrabold text-text-dark">{formatPrice(totalWithMoms)} kr</span>
                </div>
                <div className="mt-1 text-right text-xs text-text-light">
                  varav moms {formatPrice(Math.round(totalWithShipping * 0.25))} kr
                </div>
              </div>

              {/* Trust */}
              <div className="mt-5 flex flex-col gap-2.5 border-t border-border pt-5">
                {[
                  { icon: <Truck size={14} />, text: shippingFree ? "Fri frakt" : `Fri frakt från ${formatPrice(SHIPPING_THRESHOLD)} kr` },
                  { icon: <ShieldCheck size={14} />, text: "30 dagars öppet köp" },
                  { icon: <Lock size={14} />, text: "Säker betalning" },
                ].map((t, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-text-mid">
                    <span className="text-text-light">{t.icon}</span>
                    {t.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Help */}
            <div className="mt-4 rounded-xl border border-border p-4 text-center text-sm text-text-mid">
              Behöver du hjälp? Ring{" "}
              <a href={`tel:+46701234567`} className="font-semibold text-navy underline">{PHONE}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
