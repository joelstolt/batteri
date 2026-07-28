"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { publicProducts as products } from "@/lib/products"
import ProductCard from "@/components/ProductCard"

function getFeatured() {
  const featured = products.filter((p) => p.badge).slice(0, 4)
  if (featured.length < 4) {
    const remaining = products
      .filter((p) => !p.badge)
      .sort((a, b) => b.price - a.price)
      .slice(0, 4 - featured.length)
    featured.push(...remaining)
  }
  return featured
}

export default function Hero() {
  const featured = getFeatured()

  return (
    <section>
      {/*
        Mörk textdel. Poängen: originalgulan #F5A623 ger bara 2,03:1 mot vitt
        och underkänns, men 8,28:1 mot marinblått. På mörk botten får rubriken
        alltså varumärkets riktiga gula i stället för det dova guld som krävs
        på vit bakgrund. Samma princip som logotypen i headern redan bygger på.
      */}
      <div className="bg-navy">
        <div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 sm:py-20">
          <motion.div
            className="max-w-[760px]"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber/40 bg-amber/10 px-3.5 py-1.5 font-heading text-xs font-bold uppercase tracking-wider text-amber">
              <span className="text-sm">🏆</span>
              Marknadens vassaste priser
            </div>

            <h1 className="mb-5 font-heading text-[clamp(32px,4.5vw,52px)] font-extrabold leading-[1.05] tracking-tight text-white">
              Batteri till truck, lift och städmaskin
              <br />
              {/* Löftet fanns redan i WhyUs långt ned på sidan. En stillastående
                  truck kostar pengar per timme — det slår "priset syns på sajten",
                  som dessutom är metakommentar om hemsidan snarare än om varan. */}
              <span className="text-amber">beställ före 14, skickas samma dag</span>
            </h1>

            <p className="max-w-[640px] text-[17px] leading-relaxed text-white/75">
              Traktionsbatterier och gelbatterier till truckar, saxliftar,
              pallyftare, städmaskiner och UPS. Vi publicerar priserna öppet,
              levererar på 1–3 arbetsdagar och svarar själva i telefon när du
              behöver hjälp att välja rätt.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Ljus produktdel — korten behåller sin vita bakgrund */}
      <div className="border-b border-border bg-white">
        <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 sm:py-12">
          <motion.div
            className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            {featured.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </motion.div>

          <motion.div
            className="mt-8 flex justify-center sm:mt-10"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href="/kategori/alla"
              className="rounded-xl bg-amber-bg px-8 py-3.5 text-center font-heading text-sm font-bold text-navy shadow-sm transition-all hover:-translate-y-px hover:shadow-md sm:text-base"
            >
              Se alla batterier
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
