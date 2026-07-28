"use client"

import { useState } from "react"
import { ChevronDown, Package, Truck, CreditCard, RotateCcw, Zap, HelpCircle } from "lucide-react"
import { PHONE, PHONE_LINK, EMAIL } from "@/lib/constants"
import FadeIn from "@/components/FadeIn"
import { FAQ_SECTIONS } from "@/lib/faq"
import Link from "next/link"


function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="text-[15px] font-semibold text-text-dark pr-4">
          {question}
        </span>
        <div
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
            open ? "bg-navy rotate-180" : "bg-surface"
          }`}
        >
          <ChevronDown
            className={`h-4 w-4 transition-colors ${open ? "text-white" : "text-text-mid"}`}
            strokeWidth={2.5}
          />
        </div>
      </button>
      <div
        className={`grid transition-all duration-200 ease-in-out ${
          open ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="text-[15px] leading-relaxed text-text-mid pr-12">
            {answer}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function FaqContent() {
  return (
    <div className="bg-white">
      {/* Header */}
      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-[1200px] px-4 pb-8 pt-10 sm:px-6">
          <FadeIn>
            <div className="mb-2 text-xs font-bold uppercase tracking-widest text-amber-text">
              Support
            </div>
            <h1 className="mb-3 font-heading text-[clamp(28px,4vw,40px)] font-extrabold tracking-tight text-text-dark">
              Vanliga frågor
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-text-mid">
              Här hittar du svar på de vanligaste frågorna om beställning, frakt, 
              betalning och våra produkter. Hittar du inte svaret?{" "}
              <Link href="/kontakt" className="font-semibold text-navy underline decoration-navy/30 underline-offset-2 transition-colors hover:text-amber-text">
                Kontakta oss
              </Link>
              .
            </p>
          </FadeIn>
        </div>
      </div>

      {/* FAQ sections */}
      <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-[800px] space-y-14">
          {FAQ_SECTIONS.map((section, i) => (
            <FadeIn key={section.title} delay={i * 0.08}>
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy/5">
                    <section.icon className="h-4.5 w-4.5 text-navy" strokeWidth={2} />
                  </div>
                  <h2 className="font-heading text-lg font-extrabold text-text-dark">
                    {section.title}
                  </h2>
                </div>
                <div className="rounded-xl border border-border bg-white px-5 sm:px-6">
                  {section.items.map((item) => (
                    <FaqItem key={item.q} question={item.q} answer={item.a} />
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* CTA */}
        <FadeIn delay={0.3}>
          <div className="mx-auto mt-16 max-w-[800px] rounded-2xl bg-navy p-8 text-center sm:p-10">
            <HelpCircle className="mx-auto mb-4 h-8 w-8 text-amber-bg" strokeWidth={1.5} />
            <h3 className="mb-2 font-heading text-xl font-extrabold text-white">
              Hittade du inte svaret?
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-white/50">
              Ring oss eller skicka ett mejl så hjälper vi dig inom kort.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={`tel:${PHONE_LINK}`}
                className="inline-flex items-center gap-2 rounded-full bg-amber-bg px-6 py-3 text-sm font-bold text-navy transition-all hover:brightness-110"
              >
                Ring {PHONE}
              </a>
              <a
                href={`mailto:${EMAIL}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-white/5"
              >
                Skicka mejl
              </a>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
