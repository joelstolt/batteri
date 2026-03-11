import Link from "next/link"
import { PHONE, EMAIL } from "@/lib/constants"

const COLUMNS = [
  {
    title: "Kategorier",
    links: [
      { label: "Traktion & Industri", href: "/kategori/traktion-industri" },
      { label: "Städmaskiner", href: "/kategori/stadmaskiner" },
      { label: "Stationära", href: "/kategori/stationara" },
      { label: "Fritid & Sol", href: "/kategori/fritid-solenergi" },
      { label: "Tillbehör", href: "/kategori/tillbehor" },
    ],
  },
  {
    title: "Information",
    links: [
      { label: "Om oss", href: "/om-oss" },
      { label: "Kontakta oss", href: "/kontakt" },
      { label: "Leveransvillkor", href: "/leveransvillkor" },
      { label: "Köpvillkor", href: "/kopvillkor" },
    ],
  },
  {
    title: "Kontakt",
    links: [
      { label: PHONE, href: `tel:+46701234567` },
      { label: EMAIL, href: `mailto:${EMAIL}` },
      { label: "Mån–Fre 8–17", href: null },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-navy-deep pb-8 pt-14">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="grid gap-10 border-b border-white/6 pb-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-bg to-amber text-lg text-navy">
                ⚡
              </div>
              <div className="font-heading text-lg font-extrabold text-white">
                Batteri<span className="text-amber-bg">proffs</span>
              </div>
            </div>
            <p className="max-w-[280px] text-sm leading-relaxed text-white/40">
              Auktoriserad Sonnenschein-partner. Professionella batterilösningar
              för företag och privatpersoner i hela Sverige.
            </p>
          </div>

          {/* Link columns */}
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <div className="mb-4 font-heading text-sm font-bold text-white">
                {col.title}
              </div>
              {col.links.map((link) =>
                link.href ? (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="mb-2.5 block text-sm text-white/40 transition-colors hover:text-white/70"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <span
                    key={link.label}
                    className="mb-2.5 block text-sm text-white/40"
                  >
                    {link.label}
                  </span>
                )
              )}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-6">
          <div className="text-[13px] text-white/25">
            © 2026 Batteriproffs.se · Alla rättigheter förbehållna
          </div>
          <div className="flex gap-4">
            {["Integritetspolicy", "Cookies", "Villkor"].map((t) => (
              <Link
                key={t}
                href="#"
                className="text-[13px] text-white/25 transition-colors hover:text-white/50"
              >
                {t}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
