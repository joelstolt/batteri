"use client"

import { useState } from "react"
import { Phone, Mail, Clock, MapPin, Send, CheckCircle } from "lucide-react"
import { PHONE, PHONE_LINK, EMAIL } from "@/lib/constants"
import FadeIn from "@/components/FadeIn"

export default function ContactContent() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "", type: "foretag" })

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-[1200px] px-4 pb-8 pt-10 sm:px-6">
          <FadeIn>
            <div className="mb-2 text-xs font-bold uppercase tracking-widest text-amber">Kontakt</div>
            <h1 className="mb-3 font-heading text-[clamp(28px,4vw,40px)] font-extrabold tracking-tight text-text-dark">
              Hur kan vi hjälpa dig?
            </h1>
            <p className="max-w-lg text-base text-text-mid">
              Osäker på vilket batteri du behöver? Vill ha offert på större beställning?
              Vi finns här för att hjälpa.
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
                  Vi återkommer inom 24 timmar. Behöver du svar snabbare? Ring oss direkt.
                </p>
                <a
                  href={`tel:${PHONE_LINK}`}
                  className="rounded-xl bg-navy px-6 py-3 font-heading text-sm font-bold text-white transition-colors hover:bg-navy-light"
                >
                  Ring {PHONE}
                </a>
              </div>
            ) : (
              <div>
                <h2 className="mb-6 font-heading text-xl font-bold text-text-dark">
                  Skicka ett meddelande
                </h2>
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
                      <label className="mb-1.5 block text-sm font-medium text-text-dark">Namn *</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-text-dark outline-none transition-colors placeholder:text-text-light focus:border-navy"
                        placeholder="Ditt namn"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-text-dark">E-post *</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-text-dark outline-none transition-colors placeholder:text-text-light focus:border-navy"
                        placeholder="din@epost.se"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-dark">Telefon</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-text-dark outline-none transition-colors placeholder:text-text-light focus:border-navy"
                      placeholder="070-123 45 67"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-dark">Meddelande *</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full resize-none rounded-xl border border-border bg-white px-4 py-3 text-sm text-text-dark outline-none transition-colors placeholder:text-text-light focus:border-navy"
                      placeholder="Beskriv vad du behöver hjälp med..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 rounded-xl bg-amber-bg px-8 py-4 font-heading text-base font-bold text-navy shadow-sm transition-all hover:-translate-y-px hover:shadow-md"
                  >
                    <Send size={16} />
                    Skicka meddelande
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
                  <a href={`tel:${PHONE_LINK}`} className="flex items-center gap-3 text-sm font-medium text-text-dark transition-colors hover:text-accent">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                      <Phone size={16} className="text-navy" />
                    </div>
                    <div>
                      <div className="font-semibold">{PHONE}</div>
                      <div className="text-xs text-text-light">Ring oss direkt</div>
                    </div>
                  </a>
                  <a href={`mailto:${EMAIL}`} className="flex items-center gap-3 text-sm font-medium text-text-dark transition-colors hover:text-accent">
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
                    <div key={row.day} className="flex items-center justify-between text-sm">
                      <span className="text-text-mid">{row.day}</span>
                      <span className="font-semibold text-text-dark">{row.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expert help */}
              <div className="rounded-2xl border border-amber-bg/20 bg-amber-bg/5 p-6">
                <div className="mb-2 font-heading text-base font-bold text-text-dark">
                  Snabb hjälp?
                </div>
                <p className="mb-4 text-sm text-text-mid">
                  Behöver du hjälp att välja rätt batteri? Ring oss så guidar vi dig — kostnadsfritt.
                </p>
                <a
                  href={`tel:${PHONE_LINK}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-amber-bg px-5 py-2.5 text-sm font-bold text-navy transition-transform hover:-translate-y-px"
                >
                  <Phone size={14} />
                  Ring nu
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  )
}
