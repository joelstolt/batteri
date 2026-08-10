"use client"

import Link from "next/link"
import {
  Phone,
  ChevronRight,
  PackageCheck,
  Lightbulb,
  HelpCircle,
  Info,
  AlertTriangle,
  Building2,
} from "lucide-react"
import { PHONE, PHONE_LINK } from "@/lib/constants"
import { paketpris } from "@/lib/anvandning"
import ProductCard from "@/components/ProductCard"
import FadeIn from "@/components/FadeIn"

export default function AnvandningPageContent({ sida, produkter }) {
  const paket = (sida.paket || [])
    .map((p) => ({ ...p, pris: paketpris(p.slug, p.antal) }))
    .filter((p) => p.pris)

  return (
    <div className="bg-white">
      {/* Sidhuvud */}
      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-[1200px] px-4 pb-10 pt-8 sm:px-6">
          <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-xs text-text-mid">
            <Link href="/" className="hover:text-text-dark">Hem</Link>
            <ChevronRight size={13} className="text-text-light" />
            <span className="text-text-dark">{sida.h1}</span>
          </nav>

          <div className="mb-2 text-xs font-bold uppercase tracking-widest text-amber-text">
            {sida.eyebrow}
          </div>
          <h1 className="mb-4 max-w-3xl font-heading text-[clamp(26px,4vw,38px)] font-extrabold leading-tight tracking-tight text-text-dark">
            {sida.h1}
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-text-mid">{sida.intro}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={`tel:${PHONE_LINK}`}
              className="inline-flex items-center gap-2 rounded-xl bg-navy px-5 py-3 font-heading text-sm font-bold text-white transition-colors hover:bg-navy-light"
            >
              <Phone size={15} />
              Osäker på vilket som passar? Ring {PHONE}
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6">
        {/* Vad vi inte säljer. Står högt upp med flit: en kund som är fel ute
            ska få veta det innan hon lägger tid på sortimentet. */}
        {sida.varning && (
          <FadeIn>
            <div className="mb-10 flex gap-3 rounded-2xl border border-amber-bg bg-amber-50 p-5">
              <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-text" />
              <p className="text-sm leading-relaxed text-text-dark">{sida.varning}</p>
            </div>
          </FadeIn>
        )}

        {/* Produkterna */}
        <FadeIn>
          <div className="mb-6 flex items-center gap-2">
            <PackageCheck size={19} className="text-navy" />
            <h2 className="font-heading text-xl font-bold text-text-dark">
              {produkter.length} batterier för det här
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {produkter.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </FadeIn>

        {/* Paketpris, för de sidor där man byter flera batterier samtidigt */}
        {paket.length > 0 && (
          <FadeIn delay={0.05}>
            <div className="mt-12 rounded-2xl border border-border bg-surface p-6">
              <h2 className="mb-1.5 font-heading text-lg font-bold text-text-dark">
                Vad ett helt batteribyte kostar
              </h2>
              <p className="mb-5 text-sm leading-relaxed text-text-mid">
                Alla batterier i en golfbil ska bytas samtidigt. Här är priset för hela
                uppsättningen, exklusive frakt.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {paket.map((p) => (
                  <div key={p.rubrik} className="rounded-xl bg-white p-5">
                    <div className="font-heading text-base font-bold text-text-dark">
                      {p.rubrik}
                    </div>
                    <div className="mt-0.5 text-sm text-text-mid">
                      {p.pris.antal} × {p.pris.produkt.shortName}, {p.beskrivning}
                    </div>
                    <div className="mt-3 font-heading text-2xl font-extrabold text-text-dark">
                      {p.pris.totalt}
                    </div>
                    <div className="text-xs text-text-light">
                      {p.pris.styck} per batteri, inkl. moms
                    </div>
                    <Link
                      href={`/produkt/${p.pris.produkt.slug}`}
                      className="mt-3 inline-block text-sm font-semibold text-navy hover:underline"
                    >
                      Se batteriet
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        )}

        {/* Så väljer du */}
        <FadeIn delay={0.05}>
          <div className="mt-14">
            <div className="mb-6 flex items-center gap-2">
              <Lightbulb size={19} className="text-navy" />
              <h2 className="font-heading text-xl font-bold text-text-dark">
                Så väljer du rätt
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {sida.valj.map((v) => (
                <div key={v.rubrik} className="rounded-2xl border border-border bg-surface p-6">
                  <h3 className="mb-2 font-heading text-base font-bold text-text-dark">
                    {v.rubrik}
                  </h3>
                  <p className="text-sm leading-relaxed text-text-mid">{v.text}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Varför just de här batterierna står på sidan. Transparensen är
            avsiktlig: skillnaden mellan belagd passform och lämplig spec ska
            synas för kunden, inte bara stå i en kodkommentar. */}
        {sida.specnot && (
          <FadeIn delay={0.05}>
            <div className="mt-8 flex gap-3 rounded-2xl border border-border bg-surface p-5">
              <Info size={17} className="mt-0.5 shrink-0 text-navy" />
              <p className="text-sm leading-relaxed text-text-mid">
                <strong className="text-text-dark">Varför de här batterierna. </strong>
                {sida.specnot}
              </p>
            </div>
          </FadeIn>
        )}

        {/* Vanliga frågor */}
        <FadeIn delay={0.05}>
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="mb-5 flex items-center gap-2">
                <HelpCircle size={19} className="text-navy" />
                <h2 className="font-heading text-xl font-bold text-text-dark">Vanliga frågor</h2>
              </div>
              <div className="flex flex-col gap-4">
                {sida.faq.map((f) => (
                  <div key={f.q} className="rounded-2xl border border-border bg-surface p-6">
                    <h3 className="mb-2 font-heading text-base font-bold text-text-dark">{f.q}</h3>
                    <p className="text-sm leading-relaxed text-text-mid">{f.a}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {/* Kassan kräver orgnr. Det ska stå innan kunden fyller varukorgen,
                  inte upptäckas i kassan. Samma problem löstes en gång på
                  /foretagskund, se kommentaren i den filen. */}
              <div className="rounded-2xl border border-border bg-surface p-6">
                <div className="mb-3 flex items-center gap-2">
                  <Building2 size={17} className="text-navy" />
                  <h2 className="font-heading text-base font-bold text-text-dark">
                    Vi säljer till företag
                  </h2>
                </div>
                <p className="mb-3 text-sm leading-relaxed text-text-mid">
                  Kassan är byggd för företag och kräver organisationsnummer. Är du
                  privatperson går beställningen inte att slutföra på sajten, men ring
                  eller mejla så löser vi köpet manuellt.
                </p>
                <Link href="/foretagskund" className="text-sm font-semibold text-navy hover:underline">
                  Så handlar företag hos oss
                </Link>
              </div>

              <div className="rounded-2xl border border-border bg-surface p-6">
                <h2 className="mb-3 font-heading text-base font-bold text-text-dark">
                  Passar det inte byter vi
                </h2>
                <p className="mb-3 text-sm leading-relaxed text-text-mid">
                  Har vi rekommenderat batteriet står vi för bytet och frakten åt båda
                  hållen, utan returavdrag. Förpackningen ska vara obruten och batteriet
                  får inte ha kopplats in.
                </p>
                <Link href="/villkor" className="text-sm font-semibold text-navy hover:underline">
                  Läs passformsgarantin
                </Link>
              </div>

              {sida.relaterade?.length > 0 && (
                <div className="rounded-2xl border border-border bg-surface p-6">
                  <h2 className="mb-3 font-heading text-base font-bold text-text-dark">
                    Läs vidare
                  </h2>
                  <ul className="flex flex-col gap-2 text-sm">
                    {sida.relaterade.map((r) => (
                      <li key={r.href}>
                        <Link href={r.href} className="font-semibold text-navy hover:underline">
                          {r.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
