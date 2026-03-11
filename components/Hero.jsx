"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import BatteryFinder from "./BatteryFinder"

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-white">
      {/* Subtle background pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(0,0,0,0.3) 39px, rgba(0,0,0,0.3) 40px),
            repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(0,0,0,0.3) 39px, rgba(0,0,0,0.3) 40px)
          `,
        }}
      />
      {/* Soft gradient */}
      <div className="pointer-events-none absolute -right-[10%] -top-[20%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(253,184,19,0.06),transparent_70%)]" />

      <div className="relative z-10 mx-auto flex max-w-[1200px] flex-wrap items-center gap-8 px-4 pb-10 pt-8 sm:gap-12 sm:px-6 sm:pb-16 sm:pt-12">
        {/* Left */}
        <motion.div
          className="flex-[1_1_480px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Partner badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-bg" />
            Auktoriserad Sonnenschein-partner i Sverige
          </div>

          <h1 className="mb-5 font-heading text-[clamp(32px,4.5vw,52px)] font-extrabold leading-[1.1] tracking-tight text-text-dark">
            Professionella batterier
            <br />
            <span className="text-amber">för de som vet skillnaden</span>
          </h1>

          <p className="mb-8 max-w-[480px] text-[17px] leading-relaxed text-text-mid">
            Traktionsbatterier för industrin. Gel-batterier för städmaskiner.
            Stationära lösningar för hissar och larm. Vi säljer inte allt till
            alla — vi säljer rätt batteri till dig.
          </p>

          {/* CTA Buttons */}
          <div className="mb-10 flex flex-wrap gap-3">
            <Link
              href="/kategori/traktion-industri"
              className="rounded-xl bg-amber-bg px-7 py-3.5 font-heading text-sm font-bold text-navy shadow-sm transition-all hover:-translate-y-px hover:shadow-md sm:text-base"
            >
              Utforska sortimentet
            </Link>
            <Link
              href="/kontakt"
              className="rounded-xl border border-border bg-white px-7 py-3.5 font-heading text-sm font-bold text-text-dark transition-all hover:-translate-y-px hover:border-border-dark hover:shadow-sm sm:text-base"
            >
              Kontakta oss
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8">
            {[
              { val: "500+", sub: "Levererade ordrar" },
              { val: "100%", sub: "Nischad expertis" },
              { val: "1–3 dgr", sub: "Leveranstid" },
            ].map((s, i) => (
              <div
                key={i}
                className={i > 0 ? "border-l border-border pl-8" : ""}
              >
                <div className="font-heading text-2xl font-extrabold text-text-dark">
                  {s.val}
                </div>
                <div className="mt-0.5 text-[13px] font-medium text-text-light">
                  {s.sub}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right — Battery Finder */}
        <div className="flex flex-[1_1_380px] justify-center">
          <BatteryFinder />
        </div>
      </div>
    </section>
  )
}
