"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { NAV_CATEGORIES, PHONE, PHONE_LINK } from "@/lib/constants"
import { useCart } from "@/lib/cart-context"
import SearchModal from "./SearchModal"

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { totalItems, setIsOpen } = useCart()

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handle)
    return () => window.removeEventListener("scroll", handle)
  }, [])

  return (
    <>
    <header
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(11,29,58,0.98)" : "#0B1D3A",
        backdropFilter: "blur(20px)",
        borderBottom: scrolled
          ? "1px solid rgba(255,255,255,0.06)"
          : "1px solid transparent",
        boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.15)" : "none",
      }}
    >
      {/* Main header row */}
      <div className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-[42px] w-[42px] items-center justify-center rounded-[10px] bg-gradient-to-br from-amber-bg to-amber text-[22px] text-navy shadow-[0_2px_12px_rgba(253,184,19,0.25)]">
            ⚡
          </div>
          <div>
            <div className="font-heading text-[22px] font-extrabold leading-tight tracking-tight text-white">
              Batteri<span className="text-amber-bg">proffs</span>
            </div>
            <div className="text-[10px] font-medium tracking-wider text-white/50">
              Professionella batterilösningar
            </div>
          </div>
        </Link>

        {/* Search bar */}
        <div className="hidden flex-[0_1_420px] md:flex">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex h-11 w-full items-center gap-2 rounded-l-xl border-2 border-r-0 border-white/12 bg-white/6 px-4 text-left text-sm text-white/35 transition-colors hover:border-white/20 hover:bg-white/10"
          >
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="6.5" cy="6.5" r="5"/><path d="M10 10l3.5 3.5"/></svg>
            Sök batteri, modellnr eller användningsområde...
          </button>
          <button
            onClick={() => setSearchOpen(true)}
            className="flex h-11 w-12 items-center justify-center rounded-r-xl bg-gradient-to-br from-amber-bg to-amber transition-opacity hover:opacity-85"
          >
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="#0B1D3A"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <circle cx="8" cy="8" r="6" />
              <path d="M13 13l4 4" />
            </svg>
          </button>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <a
            href={`tel:${PHONE_LINK}`}
            className="hidden items-center gap-2 rounded-[10px] px-3.5 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/6 hover:text-white lg:flex"
          >
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 3.5A1.5 1.5 0 013.5 2h2.29a1 1 0 01.95.68l.7 2.12a1 1 0 01-.26 1.05l-1 .87a10 10 0 004.6 4.6l.87-1a1 1 0 011.05-.26l2.12.7a1 1 0 01.68.95v2.29a1.5 1.5 0 01-1.5 1.5A13 13 0 012 3.5z" />
            </svg>
            {PHONE}
          </a>
          <button
            onClick={() => setIsOpen(true)}
            className="relative flex h-11 items-center gap-2.5 rounded-xl bg-gradient-to-br from-amber-bg to-amber px-5 text-[15px] font-bold text-navy shadow-[0_2px_12px_rgba(253,184,19,0.2)] transition-transform hover:-translate-y-px"
          >
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="#0B1D3A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="17" r="1.5" />
              <circle cx="17" cy="17" r="1.5" />
              <path d="M1 1h3l2.4 12.2a1 1 0 001 .8h9.2a1 1 0 001-.8L19 5H6" />
            </svg>
            <span className="hidden sm:inline">Varukorg</span>
            {totalItems > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-navy text-[10px] font-bold text-white">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Nav row */}
      <div className="border-t border-white/6">
        <div className="mx-auto flex h-[46px] max-w-[1200px] items-center px-6">
          <button className="flex h-[46px] items-center gap-2 border-b-2 border-amber-bg bg-white/6 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10">
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M2 4h12M2 8h12M2 12h12" />
            </svg>
            Alla batterier
            <svg
              width="12"
              height="12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M3 4.5l3 3 3-3" />
            </svg>
          </button>

          <div className="hidden md:flex">
            {NAV_CATEGORIES.map((item) => (
              <Link
                key={item.slug}
                href={`/kategori/${item.slug}`}
                className="flex h-[46px] items-center border-b-2 border-transparent px-4 text-sm font-medium text-white/65 transition-all hover:border-white/30 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex-1" />

          <div className="hidden items-center gap-1.5 text-xs font-semibold text-amber-bg lg:flex">
            <svg width="14" height="14" fill="#FDB813" viewBox="0 0 20 20">
              <path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.28l-4.77 2.51.91-5.32L2.27 6.7l5.34-.78L10 1z" />
            </svg>
            Auktoriserad Sonnenschein-partner
          </div>
        </div>
      </div>
    </header>

    <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
