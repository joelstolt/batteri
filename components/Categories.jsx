"use client"

import Link from "next/link"
import Image from "next/image"
import { CATEGORIES } from "@/lib/constants"
import FadeIn from "./FadeIn"

const CATEGORY_IMAGES = {
  "traktion-industri": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop",
  "stadmaskiner": "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=600&h=400&fit=crop",
  "stationara": "https://images.unsplash.com/photo-1586920740099-f3ceb65bc51e?w=600&h=400&fit=crop",
  "fritid-solenergi": "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&h=400&fit=crop",
}

export default function Categories() {
  return (
    <section className="bg-surface py-14 sm:py-[72px]">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <FadeIn>
          <div className="mb-8 sm:mb-10">
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
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white transition-all duration-200 hover:-translate-y-1 hover:border-border-dark hover:shadow-lg"
              >
                {/* Image */}
                <div className="relative h-40 shrink-0 overflow-hidden sm:h-44">
                  <Image
                    src={CATEGORY_IMAGES[cat.slug]}
                    alt={cat.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  {/* Product count badge */}
                  <div className="absolute right-3 top-3 rounded-md bg-white/90 px-2.5 py-1 text-[11px] font-bold text-text-dark backdrop-blur-sm">
                    {cat.count} produkter
                  </div>
                  {/* Title overlay on image */}
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="font-heading text-lg font-bold text-white drop-shadow-md">
                      {cat.title}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <div className="flex flex-1 flex-col px-4 py-4">
                  <p className="mb-3 text-sm leading-snug text-text-mid">
                    {cat.desc}
                  </p>
                  <span className="mt-auto flex items-center gap-1.5 text-sm font-semibold text-navy transition-colors group-hover:text-accent">
                    Visa produkter
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="transition-transform group-hover:translate-x-1">
                      <path d="M5 3l5 5-5 5" />
                    </svg>
                  </span>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
