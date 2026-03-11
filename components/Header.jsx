"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Search, Phone, ChevronRight, Star } from "lucide-react"
import { NAV_CATEGORIES, PHONE, PHONE_LINK, CATEGORIES } from "@/lib/constants"
import { useCart } from "@/lib/cart-context"
import SearchModal from "./SearchModal"

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { totalItems, setIsOpen } = useCart()
  const pathname = usePathname()

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handle)
    return () => window.removeEventListener("scroll", handle)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [mobileMenuOpen])

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
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-3 px-4 sm:h-[72px] sm:px-6">
          {/* Left: hamburger + logo */}
          <div className="flex items-center gap-2.5">
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/10 md:hidden"
              aria-label="Meny"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-gradient-to-br from-amber-bg to-amber text-lg text-navy shadow-[0_2px_12px_rgba(253,184,19,0.25)] sm:h-[42px] sm:w-[42px] sm:rounded-[10px] sm:text-[22px]">
                ⚡
              </div>
              <div>
                <div className="font-heading text-lg font-extrabold leading-tight tracking-tight text-white sm:text-[22px]">
                  Batteri<span className="text-amber-bg">proffs</span>
                </div>
                <div className="hidden text-[10px] font-medium tracking-wider text-white/50 sm:block">
                  Professionella batterilösningar
                </div>
              </div>
            </Link>
          </div>

          {/* Center: Search bar — desktop only */}
          <div className="hidden flex-[0_1_420px] md:flex">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex h-11 w-full items-center gap-2 rounded-l-xl border-2 border-r-0 border-white/12 bg-white/6 px-4 text-left text-sm text-white/35 transition-colors hover:border-white/20 hover:bg-white/10"
            >
              <Search size={15} strokeWidth={2} />
              Sök batteri, modellnr eller användningsområde...
            </button>
            <button
              onClick={() => setSearchOpen(true)}
              className="flex h-11 w-12 items-center justify-center rounded-r-xl bg-gradient-to-br from-amber-bg to-amber transition-opacity hover:opacity-85"
            >
              <Search size={18} strokeWidth={2.5} className="text-navy" />
            </button>
          </div>

          {/* Right: search (mobile) + phone + cart */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Search icon — mobile only */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 md:hidden"
              aria-label="Sök"
            >
              <Search size={20} />
            </button>

            {/* Phone — desktop only */}
            <a
              href={`tel:${PHONE_LINK}`}
              className="hidden items-center gap-2 rounded-[10px] px-3 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/6 hover:text-white lg:flex"
            >
              <Phone size={15} />
              {PHONE}
            </a>

            {/* Cart button */}
            <button
              onClick={() => setIsOpen(true)}
              className="relative flex h-10 items-center gap-2 rounded-xl bg-gradient-to-br from-amber-bg to-amber px-3.5 text-sm font-bold text-navy shadow-[0_2px_12px_rgba(253,184,19,0.2)] transition-transform hover:-translate-y-px sm:h-11 sm:px-5 sm:text-[15px]"
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

        {/* Desktop nav row */}
        <div className="hidden border-t border-white/6 md:block">
          <div className="mx-auto flex h-[46px] max-w-[1200px] items-center px-6">
            <button className="flex h-[46px] items-center gap-2 border-b-2 border-amber-bg bg-white/6 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10">
              <Menu size={16} />
              Alla batterier
              <ChevronRight size={12} className="rotate-90" />
            </button>

            {NAV_CATEGORIES.map((item) => (
              <Link
                key={item.slug}
                href={`/kategori/${item.slug}`}
                className={`flex h-[46px] items-center border-b-2 px-4 text-sm font-medium transition-all hover:border-white/30 hover:text-white ${
                  pathname === `/kategori/${item.slug}`
                    ? "border-amber-bg text-white"
                    : "border-transparent text-white/65"
                }`}
              >
                {item.label}
              </Link>
            ))}

            <div className="flex-1" />

            <div className="hidden items-center gap-1.5 text-xs font-semibold text-amber-bg lg:flex">
              <Star size={12} fill="#FDB813" className="text-amber-bg" />
              Auktoriserad Sonnenschein-partner
            </div>
          </div>
        </div>
      </header>

      {/* ===== MOBILE MENU OVERLAY ===== */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Menu panel */}
          <div className="absolute left-0 top-16 bottom-0 w-[300px] overflow-y-auto bg-navy shadow-2xl">
            {/* Categories */}
            <div className="border-b border-white/6 px-5 py-4">
              <div className="mb-3 text-[11px] font-bold uppercase tracking-widest text-white/30">
                Kategorier
              </div>
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/kategori/${cat.slug}`}
                  className={`flex items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-white/6 ${
                    pathname === `/kategori/${cat.slug}`
                      ? "bg-white/6 text-white"
                      : "text-white/70"
                  }`}
                >
                  <span className="text-lg">{cat.icon}</span>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{cat.title}</div>
                    <div className="text-[11px] text-white/40">{cat.desc}</div>
                  </div>
                  <ChevronRight size={14} className="text-white/20" />
                </Link>
              ))}
            </div>

            {/* Links */}
            <div className="border-b border-white/6 px-5 py-4">
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-white/70 transition-colors hover:bg-white/6 hover:text-white"
              >
                <Search size={16} />
                Sök produkter
              </Link>
              <a
                href={`tel:${PHONE_LINK}`}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-white/70 transition-colors hover:bg-white/6 hover:text-white"
              >
                <Phone size={16} />
                {PHONE}
              </a>
            </div>

            {/* Partner badge */}
            <div className="px-5 py-5">
              <div className="flex items-center gap-2 rounded-lg bg-white/4 px-4 py-3 text-xs font-semibold text-amber-bg">
                <Star size={14} fill="#FDB813" className="text-amber-bg" />
                Auktoriserad Sonnenschein-partner
              </div>
            </div>
          </div>
        </div>
      )}

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
