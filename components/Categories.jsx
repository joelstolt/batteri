"use client"

import Link from "next/link"
import { CATEGORIES } from "@/lib/constants"
import FadeIn from "./FadeIn"

export default function Categories() {
  return (
    <section className="bg-surface py-[72px]">
      <div className="mx-auto max-w-[1200px] px-6">
        <FadeIn>
          <div className="mb-10">
            <div className="mb-2 text-xs font-bold uppercase tracking-widest text-amber">
              Våra kategorier
            </div>
            <h2 className="font-heading text-[clamp(26px,3.5vw,38px)] font-extrabold tracking-tight text-text-dark">
              Välj efter användningsområde
            </h2>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((cat, i) => (
            <FadeIn key={cat.slug} delay={i * 0.08}>
              <Link
                href={`/kategori/${cat.slug}`}
                className="group block h-full rounded-[14px] border border-border bg-white p-6 transition-all duration-250 hover:-translate-y-[3px] hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)]"
                style={{
                  borderColor: undefined,
                }}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
                    style={{ background: `${cat.accent}0D` }}
                  >
                    {cat.icon}
                  </div>
                  <span
                    className="rounded-md px-2.5 py-1 text-xs font-semibold"
                    style={{
                      color: cat.accent,
                      background: `${cat.accent}0D`,
                    }}
                  >
                    {cat.count} produkter
                  </span>
                </div>
                <h3 className="mb-1.5 font-heading text-lg font-bold text-text-dark">
                  {cat.title}
                </h3>
                <p className="text-sm leading-snug text-text-mid">{cat.desc}</p>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
