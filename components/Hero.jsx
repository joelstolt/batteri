"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { products } from "@/lib/products"
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
    <section className="border-b border-border bg-white">
      <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 sm:py-14">
        {/* Top: copy */}
        <motion.div
          className="max-w-[720px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber/40 bg-amber/10 px-3.5 py-1.5 font-heading text-xs font-bold uppercase tracking-wider text-amber">
            <span className="text-sm">🏆</span>
            Marknadens vassaste priser
          </div>

          <h1 className="mb-5 font-heading text-[clamp(32px,4.5vw,52px)] font-extrabold leading-[1.05] tracking-tight text-text-dark">
            Rätt batteri till din maskin
            <br />
            <span className="text-amber">till bästa pris i Sverige</span>
          </h1>

          <p className="max-w-[640px] text-[17px] leading-relaxed text-text-mid">
            Truckar, städmaskiner, hissar eller solceller — vi har batteriet
            du behöver. Snabb leverans, vassa priser och riktig experthjälp
            om du har frågor. Inga mellanhänder, inga krångel.
          </p>
        </motion.div>

        {/* 4 featured products */}
        <motion.div
          className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </motion.div>

        {/* CTA below products */}
        <motion.div
          className="mt-8 flex justify-center sm:mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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
    </section>
  )
}
