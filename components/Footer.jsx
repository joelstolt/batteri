import Link from "next/link"
import { PHONE, PHONE_LINK, EMAIL } from "@/lib/constants"
import { Phone, Mail, Clock, Shield, Truck, RotateCcw, Award } from "lucide-react"

const COLUMNS = [
  {
    title: "Kategorier",
    links: [
      { label: "Traktion & Industri", href: "/kategori/traktion-industri" },
      { label: "Städmaskiner", href: "/kategori/stadmaskiner" },
      { label: "Stationära", href: "/kategori/stationara" },
      { label: "Fritid & Sol", href: "/kategori/fritid-solenergi" },
    ],
  },
  {
    title: "Kundservice",
    links: [
      { label: "Kontakta oss", href: "/kontakt" },
      { label: "Vanliga frågor", href: "/faq" },
      { label: "Frakt & leverans", href: "/villkor" },
      { label: "Retur & reklamation", href: "/villkor" },
    ],
  },
  {
    title: "Information",
    links: [
      { label: "Om Batteriproffs", href: "/om-oss" },
      { label: "Köpvillkor", href: "/villkor" },
      { label: "Integritetspolicy", href: "/integritet" },
      { label: "Företagskund", href: "/kontakt" },
    ],
  },
]

/* ─── Payment icons (inline SVG) ─── */

function VisaIcon() {
  return (
    <svg viewBox="0 0 48 32" className="h-8 w-12" aria-label="Visa">
      <rect width="48" height="32" rx="4" fill="#fff" />
      <path d="M19.6 21.6h-3l1.8-11h3l-1.8 11zm12.8-10.7c-.6-.2-1.5-.5-2.7-.5-3 0-5.1 1.5-5.1 3.7 0 1.6 1.5 2.5 2.6 3 1.2.6 1.6.9 1.6 1.4 0 .7-.9 1.1-1.8 1.1-1.2 0-1.9-.2-2.9-.6l-.4-.2-.4 2.5c.7.3 2 .6 3.4.6 3.2 0 5.2-1.5 5.3-3.8 0-1.3-.8-2.2-2.5-3-1.1-.5-1.7-.9-1.7-1.4 0-.5.6-1 1.7-1 1-.1 1.7.2 2.3.4l.3.1.3-2.3zm7.8-.3h-2.3c-.7 0-1.3.2-1.6.9l-4.5 10.1h3.2l.6-1.7h3.9l.4 1.7h2.8l-2.5-11zm-3.7 7.1c.3-.6 1.2-3.1 1.2-3.1l.4-1.1.2 1 .7 3.2h-2.5zm-22.3-7.1l-2.8 7.5-.3-1.5c-.5-1.7-2.2-3.5-4-4.4l2.7 9.4h3.2l4.7-11h-3.5z" fill="#1a1f71" />
      <path d="M13.1 10.9H8.4l-.1.2c3.8.9 6.3 3.1 7.3 5.8l-1.1-5.1c-.2-.7-.7-.9-1.4-.9z" fill="#f9a533" />
    </svg>
  )
}

function MastercardIcon() {
  return (
    <svg viewBox="0 0 48 32" className="h-8 w-12" aria-label="Mastercard">
      <rect width="48" height="32" rx="4" fill="#fff" />
      <circle cx="19" cy="16" r="9" fill="#eb001b" />
      <circle cx="29" cy="16" r="9" fill="#f79e1b" />
      <path d="M24 9.1c2.2 1.8 3.6 4.5 3.6 7.4s-1.4 5.6-3.6 7.4c-2.2-1.8-3.6-4.5-3.6-7.4s1.4-5.6 3.6-7.4z" fill="#ff5f00" />
    </svg>
  )
}

function KlarnaIcon() {
  return (
    <svg viewBox="0 0 48 32" className="h-8 w-12" aria-label="Klarna">
      <rect width="48" height="32" rx="4" fill="#FFB3C7" />
      <g fill="#0A0B09" transform="translate(9,10) scale(0.38)">
        <path d="M11.5 0H7v31.4h4.5V0z" />
        <path d="M27.5 0c0 6.1-2.7 11.7-7.5 15.4l-2.6 2 10.8 14H22L11.2 17.3v14.1H7V0h4.2v6.7C15.8 3.1 19.4 0 23.6 0h3.9z" />
        <path d="M33 7.1h-4.5v24.3H33V7.1zM53 7.1c-4.5 0-8.2 2.2-10 5.6V7.1h-4.3v24.3h4.5V20.1c0-5 3.4-8.7 8.3-8.7 5 0 7.7 3.3 7.7 8.5v11.5h4.5V19c0-7.3-4-11.9-10.7-11.9z" />
        <circle cx="30.7" cy="2.5" r="2.8" />
      </g>
    </svg>
  )
}

function SwishIcon() {
  return (
    <svg viewBox="0 0 48 32" className="h-8 w-12" aria-label="Swish">
      <rect width="48" height="32" rx="4" fill="#fff" />
      <g transform="translate(8,4) scale(0.32)">
        <path d="M72.4 18.8c-8.5-4.9-18-7.2-26.9-5.5-8.9 1.7-16.6 6.6-21.8 13.9-5.2 7.3-7.2 16.3-5.9 25.4 1.4 9.1 5.8 17.3 12.5 23.1l16.6-19.2c-2.4-2.1-4-5-4.5-8.2-.5-3.2.3-6.4 2.1-9 1.8-2.6 4.6-4.4 7.8-5 3.2-.6 6.6.2 9.6 2l10.5-17.5z" fill="#52ae30" />
        <path d="M16.8 49.5c8.5 4.9 18 7.2 26.9 5.5 8.9-1.7 16.6-6.6 21.8-13.9 5.2-7.3 7.2-16.3 5.9-25.4-1.4-9.1-5.8-17.3-12.5-23.1L42.3 11.8c2.4 2.1 4 5 4.5 8.2.5 3.2-.3 6.4-2.1 9-1.8 2.6-4.6 4.4-7.8 5-3.2.6-6.6-.2-9.6-2L16.8 49.5z" fill="#ee4042" />
      </g>
    </svg>
  )
}

/* ─── Trust bar icons ─── */

const TRUST_FEATURES = [
  { icon: Truck, label: "Fri frakt över 2 000 kr" },
  { icon: RotateCcw, label: "30 dagars öppet köp" },
  { icon: Shield, label: "Säker betalning" },
  { icon: Award, label: "Sonnenschein-partner" },
]

export default function Footer() {
  return (
    <footer className="bg-navy-deep">
      {/* ── Trust bar ── */}
      <div className="border-b border-white/6">
        <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-4 px-4 py-6 sm:px-6 lg:grid-cols-4">
          {TRUST_FEATURES.map((item) => (
            <div key={item.label} className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-bg/10">
                <item.icon className="h-4 w-4 text-amber-bg" strokeWidth={2} />
              </div>
              <span className="text-[13px] font-medium leading-tight text-white/60">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="mx-auto max-w-[1200px] px-4 pt-12 sm:px-6">
        <div className="grid gap-10 border-b border-white/6 pb-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          {/* Brand + contact */}
          <div>
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-bg to-amber text-lg text-navy">
                ⚡
              </div>
              <div className="font-heading text-lg font-extrabold text-white">
                Batteri<span className="text-amber-bg">proffs</span>
              </div>
            </div>
            <p className="mb-5 max-w-[280px] text-sm leading-relaxed text-white/40">
              Auktoriserad Sonnenschein-partner. Professionella batterilösningar
              för företag och privatpersoner i hela Sverige.
            </p>
            <div className="space-y-2.5">
              <a
                href={`tel:${PHONE_LINK}`}
                className="flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white/80"
              >
                <Phone className="h-3.5 w-3.5" />
                {PHONE}
              </a>
              <a
                href={`mailto:${EMAIL}`}
                className="flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white/80"
              >
                <Mail className="h-3.5 w-3.5" />
                {EMAIL}
              </a>
              <div className="flex items-center gap-2 text-sm text-white/40">
                <Clock className="h-3.5 w-3.5" />
                Mån–Fre 08:00–17:00
              </div>
            </div>
          </div>

          {/* Link columns */}
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <div className="mb-4 font-heading text-sm font-bold text-white">
                {col.title}
              </div>
              {col.links.map((link) => (
                <Link
                  key={link.label + link.href}
                  href={link.href}
                  className="mb-2.5 block text-sm text-white/40 transition-colors hover:text-white/70"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* ── Payment & Shipping ── */}
        <div className="grid gap-8 border-b border-white/6 py-8 sm:grid-cols-2">
          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/30">
              Betalningsalternativ
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <VisaIcon />
              <MastercardIcon />
              <KlarnaIcon />
              <SwishIcon />
            </div>
          </div>

          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/30">
              Leverans
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {["PostNord", "DHL", "Schenker"].map((name) => (
                <div
                  key={name}
                  className="flex h-8 items-center rounded-md border border-white/8 bg-white/5 px-3.5"
                >
                  <span className="text-[13px] font-semibold text-white/50">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-6">
          <div className="text-[13px] text-white/25">
            © {new Date().getFullYear()} Batteriproffs.se · Alla rättigheter förbehållna
          </div>
          <div className="flex gap-4">
            <Link
              href="/integritet"
              className="text-[13px] text-white/25 transition-colors hover:text-white/50"
            >
              Integritetspolicy
            </Link>
            <Link
              href="/villkor"
              className="text-[13px] text-white/25 transition-colors hover:text-white/50"
            >
              Villkor
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
