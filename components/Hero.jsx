"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export default function Hero() {
  return (
    <section className="border-b border-border bg-white">
      <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 sm:py-12">
        <div
          className="relative overflow-hidden rounded-2xl border border-border bg-navy bg-cover bg-center px-6 py-12 sm:px-12 sm:py-20"
          style={{ backgroundImage: "url('/hero-bg.jpg')" }}
        >
          {/* Dark overlay for readability */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/85 to-navy/55" />

          <motion.div
            className="relative z-10 max-w-[640px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber/30 bg-amber/10 px-3.5 py-1.5 font-heading text-xs font-bold uppercase tracking-wider text-amber backdrop-blur-sm">
              <span className="text-sm">🏆</span>
              Billigast & bäst på traktion
            </div>

            <h1 className="mb-5 font-heading text-[clamp(32px,4.5vw,52px)] font-extrabold leading-[1.1] tracking-tight text-white">
              Rätt batteri till din maskin
              <br />
              <span className="text-amber">till Sveriges bästa pris</span>
            </h1>

            <p className="mb-8 max-w-[480px] text-[17px] leading-relaxed text-white/80">
              Truckar, städmaskiner, hissar eller solceller — vi har batteriet
              du behöver. Snabb leverans, vassa priser och riktig experthjälp
              om du har frågor. Inga mellanhänder, inga krångel.
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/kategori/traktion-industri"
                className="rounded-xl bg-amber-bg px-7 py-3.5 text-center font-heading text-sm font-bold text-navy shadow-sm transition-all hover:-translate-y-px hover:shadow-md sm:text-base"
              >
                Se alla batterier
              </Link>
              <Link
                href="/kontakt"
                className="rounded-xl border border-white/20 bg-white/10 px-7 py-3.5 text-center font-heading text-sm font-bold text-white backdrop-blur-sm transition-all hover:-translate-y-px hover:bg-white/20 sm:text-base"
              >
                Kontakta oss
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8">
              {[
                { val: "1–3 dgr", sub: "Leverans i hela Sverige" },
                { val: "Original", sub: "Sonnenschein-partner" },
                { val: "30 dgr", sub: "Öppet köp" },
              ].map((s, i) => (
                <div
                  key={i}
                  className={i > 0 ? "border-l border-white/20 pl-8" : ""}
                >
                  <div className="font-heading text-2xl font-extrabold text-white">
                    {s.val}
                  </div>
                  <div className="mt-0.5 text-[13px] font-medium text-white/60">
                    {s.sub}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
