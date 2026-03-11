"use client"

import Link from "next/link"
import { USPS } from "@/lib/constants"
import { useVat } from "@/lib/vat-context"

export default function TopBar() {
  const { inclVat, toggleVat } = useVat()

  return (
    <div className="bg-gradient-to-r from-amber-bg to-amber-light text-text-dark">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-2 sm:px-6 sm:py-2.5">
        {/* USPs */}
        <div className="flex items-center gap-4 overflow-x-auto text-xs font-semibold sm:gap-6 sm:text-sm">
          {USPS.map((text, i) => (
            <span key={i} className="flex shrink-0 items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 15 15" fill="none" className="shrink-0">
                <circle cx="7.5" cy="7.5" r="7.5" fill="#1A1A1A" opacity="0.12" />
                <path d="M4.5 7.5l2 2 4-4" stroke="#1A1A1A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {text}
            </span>
          ))}
        </div>

        {/* Right: kundservice + VAT toggle */}
        <div className="hidden items-center gap-4 text-[13px] font-semibold sm:flex">
          <Link href="/kontakt" className="transition-opacity hover:opacity-70">
            Kundservice
          </Link>
          <span className="h-3.5 w-px bg-black/15" />
          <button
            onClick={toggleVat}
            className="flex items-center gap-2 transition-opacity hover:opacity-70"
          >
            <span className={inclVat ? "font-extrabold" : "opacity-60"}>
              Inkl. moms
            </span>
            <span className="opacity-40">/</span>
            <span className={!inclVat ? "font-extrabold" : "opacity-60"}>
              Exkl. moms
            </span>
            <span className="text-[11px] opacity-50">
              {inclVat ? "(privat)" : "(företag)"}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
