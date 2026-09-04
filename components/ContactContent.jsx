"use client"

import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import { useState } from "react"
import {
  Phone,
  Mail,
  Clock,
  MapPin,
  Send,
  CheckCircle,
  MessageCircle,
} from "lucide-react"
import { PHONE, PHONE_LINK, EMAIL, ADDRESS } from "@/lib/constants"
import ChattKnapp from "@/components/ChattKnapp"
import FadeIn from "@/components/FadeIn"

export default function ContactContent({
  quote = false,
  initialMessage = "",
  reviewPreview = false,
}) {
  const { items } = useCart()
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: initialMessage,
    type: "foretag",
    hp_field: "",
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    if (reviewPreview) {
      setError("Utskick är avstängda i förhandsvisningen.")
      return
    }
    if (quote && !items.length) {
      setError("Lägg till artiklar i varukorgen först.")
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          ...(quote
            ? { items: items.map(({ slug, qty }) => ({ slug, qty })) }
            : {}),
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || "Något gick fel")
      setSent(true)
      if (typeof window !== "undefined" && window.umami) {
        window.umami.track("lead-kontaktformular")
      }
    } catch (err) {
      setError(
        err.message ||
          "Något gick fel, prova igen eller mejla info@batteriproffs.se",
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-[1200px] px-4 pb-8 pt-10 sm:px-6">
          <FadeIn>
            <div className="mb-2 text-xs font-bold uppercase tracking-widest text-amber-text">
              Kontakt
            </div>
            <h1 className="mb-3 font-heading text-[clamp(28px,4vw,40px)] font-extrabold tracking-tight text-text-dark">
              {quote
                ? "Begär offert på din varukorg"
                : "Hur kan vi hjälpa dig?"}
            </h1>
            <p className="max-w-lg text-base text-text-mid">
              Osäker på vilket batteri du behöver? Vill ha offert på större
              beställning? Vi finns här för att hjälpa.
            </p>
          </FadeIn>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
          {/* Form */}
          <FadeIn>
            {sent ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-green/20 bg-green/5 py-16 text-center">
                <CheckCircle size={48} className="mb-4 text-green" />
                <h2 className="mb-2 font-heading text-2xl font-extrabold text-text-dark">
                  Tack för ditt meddelande!
                </h2>
                <p className="mb-6 max-w-sm text-text-mid">
                  Vi återkommer inom 24 timmar. Behöver du svar snabbare? Chatta
                  med oss.
                </p>
                <ChattKnapp className="rounded-xl bg-navy px-6 py-3 font-heading text-sm font-bold text-white transition-colors hover:bg-navy-light">
                  Chatta med oss
                </ChattKnapp>
              </div>
            ) : (
              <div>
                <h2 className="mb-6 font-heading text-xl font-bold text-text-dark">
                  {quote ? "Din offertförfrågan" : "Skicka ett meddelande"}
                </h2>
                {reviewPreview && (
                  <p className="mb-5 rounded-xl border border-border bg-surface p-4 text-sm">
                    Förhandsvisning: inga meddelanden skickas. Fyll inte i
                    riktiga personuppgifter här.
                  </p>
                )}
                {quote && (
                  <div className="mb-6 rounded-xl border border-border bg-surface p-5">
                    {items.length ? (
                      <ul className="space-y-2 text-sm">
                        {items.map((item) => (
                          <li key={item.slug}>
                            {item.qty} st{" "}
                            {item.specs?.Artikelnummer ||
                              item.slug.toUpperCase()}{" "}
                            · {item.shortName}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm">
                        Varukorgen är tom.{" "}
                        <Link href="/kategori/alla" className="underline">
                          Välj artiklar
                        </Link>
                      </p>
                    )}
                    <p className="mt-4 text-xs text-text-mid">
                      Artiklar och antal följer med automatiskt. Ange företag,
                      leveransort och önskat leveransdatum i meddelandet.
                      Förfrågan är inte en beställning. Vi återkommer med pris
                      och villkor.
                    </p>
                  </div>
                )}
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  {/* Customer type */}
                  <div className="flex gap-3">
                    {[
                      { id: "foretag", label: "Företag" },
                      { id: "privat", label: "Privatperson" },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setForm({ ...form, type: t.id })}
                        className={`flex-1 rounded-xl border py-3 text-center text-sm font-semibold transition-all ${
                          form.type === t.id
                            ? "border-navy bg-navy text-white"
                            : "border-border bg-surface text-text-mid hover:border-border-dark"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="mb-1.5 block text-sm font-medium text-text-dark"
                      >
                        Namn *
                      </label>
                      <input
                        type="text"
                        required
                        id="contact-name"
                        name="name"
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-text-dark outline-none transition-colors placeholder:text-text-light focus:border-navy"
                        placeholder="Ditt namn"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="contact-email"
                        className="mb-1.5 block text-sm font-medium text-text-dark"
                      >
                        E-post *
                      </label>
                      <input
                        type="email"
                        required
                        id="contact-email"
                        name="email"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-text-dark outline-none transition-colors placeholder:text-text-light focus:border-navy"
                        placeholder="din@epost.se"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-phone"
                      className="mb-1.5 block text-sm font-medium text-text-dark"
                    >
                      Telefon
                    </label>
                    <input
                      type="tel"
                      id="contact-phone"
                      name="phone"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-text-dark outline-none transition-colors placeholder:text-text-light focus:border-navy"
                      placeholder="070-123 45 67"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="mb-1.5 block text-sm font-medium text-text-dark"
                    >
                      Meddelande *
                    </label>
                    <textarea
                      required
                      rows={5}
                      id="contact-message"
                      name="message"
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                      className="w-full resize-none rounded-xl border border-border bg-white px-4 py-3 text-sm text-text-dark outline-none transition-colors placeholder:text-text-light focus:border-navy"
                      placeholder="Beskriv vad du behöver hjälp med..."
                    />
                  </div>

                  {/* Honeypot. Måste heta hp_field — hade fältet hetat company,
                      website, url eller email hade webbläsarens autofyll fyllt i
                      det åt riktiga kunder och deras meddelanden tappats tyst.
                      Göms med clip-path, inte display:none, så att bottar ser det. */}
                  <input
                    type="text"
                    name="hp_field"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    value={form.hp_field}
                    onChange={(e) =>
                      setForm({ ...form, hp_field: e.target.value })
                    }
                    style={{
                      position: "absolute",
                      clipPath: "inset(50%)",
                      width: 1,
                      height: 1,
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                    }}
                  />

                  {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={
                      reviewPreview || submitting || (quote && !items.length)
                    }
                    className="flex items-center justify-center gap-2 rounded-xl bg-amber-bg px-8 py-4 font-heading text-base font-bold text-navy shadow-sm transition-all hover:-translate-y-px hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-sm"
                  >
                    <Send size={16} />
                    {submitting
                      ? "Skickar…"
                      : quote
                        ? "Skicka offertförfrågan"
                        : "Skicka meddelande"}
                  </button>
                </form>
              </div>
            )}
          </FadeIn>

          {/* Sidebar */}
          <FadeIn delay={0.15}>
            <div className="flex flex-col gap-5">
              {/* Direct contact card */}
              <div className="rounded-2xl border border-border bg-surface p-6">
                <h3 className="mb-4 font-heading text-lg font-bold text-text-dark">
                  Direktkontakt
                </h3>
                <div className="flex flex-col gap-4">
                  <a
                    href={`tel:${PHONE_LINK}`}
                    className="flex items-center gap-3 text-sm font-medium text-text-dark transition-colors hover:text-amber-text"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                      <Phone size={16} className="text-navy" />
                    </div>
                    <div>
                      <div className="font-semibold">{PHONE}</div>
                      <div className="text-xs text-text-light">
                        Ring oss direkt
                      </div>
                    </div>
                  </a>
                  <a
                    href={`mailto:${EMAIL}`}
                    className="flex items-center gap-3 text-sm font-medium text-text-dark transition-colors hover:text-amber-text"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                      <Mail size={16} className="text-navy" />
                    </div>
                    <div>
                      <div className="font-semibold">{EMAIL}</div>
                      <div className="text-xs text-text-light">Mejla oss</div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div className="rounded-2xl border border-border bg-surface p-6">
                <h3 className="mb-4 font-heading text-lg font-bold text-text-dark">
                  Öppettider
                </h3>
                <div className="flex flex-col gap-2.5">
                  {[
                    { day: "Måndag – Fredag", time: "08:00 – 17:00" },
                    { day: "Lördag", time: "Stängt" },
                    { day: "Söndag", time: "Stängt" },
                  ].map((row) => (
                    <div
                      key={row.day}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-text-mid">{row.day}</span>
                      <span className="font-semibold text-text-dark">
                        {row.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Företagsadress. Krävs enligt e-handelslagen. Verksamheten är
                  digital utan kundbesök, därför "postadress" och inget om besök. */}
              <div className="rounded-2xl border border-border bg-surface p-6">
                <div className="mb-3 flex items-center gap-2">
                  <MapPin size={17} className="text-navy" aria-hidden="true" />
                  <h3 className="font-heading text-lg font-bold text-text-dark">
                    Postadress
                  </h3>
                </div>
                <address className="text-sm not-italic leading-relaxed text-text-mid">
                  Batteriproffs
                  <br />
                  {ADDRESS.gata}
                  <br />
                  {ADDRESS.postnummer} {ADDRESS.ort}
                </address>
                {/* Stod "direkt från lager", men vi har inget lager. Sidan om
                    oss säger "direkt från vår leverantör" och det är det som
                    gäller. Två olika svar på samma fråga på samma sajt är
                    precis vad Googles automatik läser som vilseledande. */}
                <p className="mt-3 text-xs leading-relaxed text-text-light">
                  Vi är en renodlad e-handel utan butik och utan eget lager.
                  Batterierna skickas direkt från vår leverantör till er adress.
                </p>
              </div>

              {/* Expert help */}
              <div className="rounded-2xl border border-amber-bg/20 bg-amber-bg/5 p-6">
                <div className="mb-2 font-heading text-base font-bold text-text-dark">
                  Snabb hjälp?
                </div>
                <p className="mb-4 text-sm text-text-mid">
                  Behöver du hjälp att välja rätt batteri? Chatta med oss så
                  guidar vi dig, kostnadsfritt och dygnet runt.
                </p>
                <ChattKnapp className="inline-flex items-center gap-2 rounded-lg bg-amber-bg px-5 py-2.5 text-sm font-bold text-navy transition-transform hover:-translate-y-px">
                  <MessageCircle size={14} />
                  Chatta nu
                </ChattKnapp>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  )
}
