import Link from "next/link"
import { PHONE, PHONE_LINK, EMAIL, ADDRESS } from "@/lib/constants"
import { Phone, Mail, Clock, Shield, Truck, RotateCcw, Award } from "lucide-react"

const COLUMNS = [
  {
    title: "Kategorier",
    links: [
      { label: "Traktion & Industri", href: "/kategori/traktion-industri" },
      { label: "Städmaskiner", href: "/kategori/stadmaskiner" },
      { label: "Stationära", href: "/kategori/stationara" },
      { label: "Fritid & Sol", href: "/kategori/fritid-solenergi" },
      // Navet för maskinsidorna — utan den här länken blir de föräldralösa
      { label: "Batteri till din maskin", href: "/batteri-till" },
    ],
  },
  {
    title: "Kundservice",
    links: [
      { label: "Kontakta oss", href: "/kontakt" },
      { label: "Vilket batteri har jag?", href: "/vilket-batteri" },
      { label: "Företagskund", href: "/foretagskund" },
      { label: "Vanliga frågor", href: "/faq" },
      { label: "Kunskapsbank", href: "/kunskap" },
      { label: "Gratis återvinning", href: "/atervinning" },
      { label: "Skötsel av batterier", href: "/skotsel" },
      { label: "Laddare till batteriet", href: "/laddare" },
      { label: "Batterivatten", href: "/batterivatten" },
      { label: "Frakt & leverans", href: "/villkor" },
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

/* ─── Trust bar icons ─── */

// Se kommentaren i lib/constants.js: inga påståenden som inte går att belägga,
// och inget öppet köp att lova på en kassa som bara släpper in företag.
const TRUST_FEATURES = [
  { icon: Truck, label: "Snabb leverans 1–3 dgr" },
  { icon: RotateCcw, label: "Passformsgaranti" },
  { icon: Shield, label: "Säker betalning" },
  { icon: Award, label: "Priser utan offert" },
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
              <div className="bg-navy-deep font-heading text-lg font-extrabold text-white">
                Batteri<span className="text-amber-bg">proffs</span>
              </div>
            </div>
            <p className="mb-5 max-w-[280px] text-sm leading-relaxed text-white/60">
              Professionella batterilösningar för företag och privatpersoner
              i hela Sverige — Sonnenschein, Nordmax och fler kvalitetsmärken.
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
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Clock className="h-3.5 w-3.5" />
                Mån–Fre 08:00–17:00
              </div>
              <div className="pt-1 text-xs leading-relaxed text-white/60">
                Joel Stolt · Org.nr 901108-0851
                <br />
                {ADDRESS.rad}
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
                  className="mb-2.5 block text-sm text-white/60 transition-colors hover:text-white"
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
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/60">
              Betalningsalternativ
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {[
                { name: "Visa", bg: "#1a1f71", text: "#fff" },
                { name: "Mastercard", bg: "#252525", text: "#fff" },
              ].map((m) => (
                <div
                  key={m.name}
                  className="flex h-8 items-center rounded-md px-3.5"
                  style={{ backgroundColor: m.bg }}
                >
                  <span className="text-[13px] font-bold" style={{ color: m.text }}>
                    {m.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/60">
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
          <div className="text-[13px] text-white/60">
            © {new Date().getFullYear()} Batteriproffs.se · Alla rättigheter förbehållna
          </div>
          <div className="flex gap-4">
            <Link
              href="/integritet"
              className="text-[13px] text-white/60 transition-colors hover:text-white"
            >
              Integritetspolicy
            </Link>
            <Link
              href="/villkor"
              className="text-[13px] text-white/60 transition-colors hover:text-white"
            >
              Villkor
            </Link>
            <a
              href="https://stoltmarketing.se"
              target="_blank"
              rel="noopener"
              className="text-[13px] text-white/60 transition-colors hover:text-white"
            >
              Hemsida av Stolt Marketing
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
