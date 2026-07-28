import Link from "next/link"
import { Phone, FileText, Wrench } from "lucide-react"
import { PHONE, PHONE_LINK, EMAIL } from "@/lib/constants"

/**
 * Två saker startsidan saknade helt:
 *
 * 1. Telefonnumret syntes bara i headern. I B2B är telefon den primära vägen
 *    för den osäkre köparen, och ordern från Eventcenter visar att riktiga
 *    företagsköp kommer in.
 * 2. Orden "offert" och "faktura" fanns inte någonstans på sidan. Den inköpare
 *    som söker de villkoren lämnade sajten utan att fråga.
 */
export default function HelpAndQuote() {
  return (
    <section className="border-b border-border bg-navy">
      <div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 sm:py-16">
        <div className="mb-10 max-w-[640px]">
          <div className="mb-2 text-xs font-bold uppercase tracking-widest text-amber">
            Hjälp att välja
          </div>
          <h2 className="mb-3 font-heading text-[clamp(22px,3vw,30px)] font-extrabold tracking-tight text-white">
            Osäker på vilket batteri maskinen tar?
          </h2>
          <p className="text-[15px] leading-relaxed text-white/75">
            Ring med maskinens modellbeteckning och märkspänning, eller
            fotografera etiketten på batteriet som sitter i nu. Vi svarar själva,
            och vi säljer bara batterier — ingen växel, inga mellanhänder.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {/* Telefon först — den snabbaste vägen till en order */}
          <a
            href={`tel:${PHONE_LINK}`}
            className="group flex flex-col rounded-2xl border border-white/12 bg-white/5 p-6 transition-colors hover:border-amber/40 hover:bg-white/8"
          >
            <Phone size={20} className="mb-3 text-amber" aria-hidden="true" />
            <div className="mb-1 font-heading text-base font-bold text-white">
              Ring oss
            </div>
            <div className="mb-3 text-sm leading-relaxed text-white/70">
              Vardagar 08:00–17:00. Vi reder ut spänning och mått på ett samtal.
            </div>
            <span className="mt-auto font-heading text-lg font-extrabold text-amber">
              {PHONE}
            </span>
          </a>

          {/* Offert och faktura — orden saknades helt på sidan tidigare */}
          <Link
            href="/kontakt"
            className="group flex flex-col rounded-2xl border border-white/12 bg-white/5 p-6 transition-colors hover:border-amber/40 hover:bg-white/8"
          >
            <FileText size={20} className="mb-3 text-amber" aria-hidden="true" />
            <div className="mb-1 font-heading text-base font-bold text-white">
              Offert och faktura
            </div>
            <div className="mb-3 text-sm leading-relaxed text-white/70">
              Större volym eller återkommande behov? Vi tar fram offert. Fakturaköp
              går via oss — hör av dig så löser vi det.
            </div>
            <span className="mt-auto font-heading text-sm font-bold text-amber">
              Begär offert →
            </span>
          </Link>

          {/* Maskinsidorna — lift och pallyftare nämndes aldrig på startsidan */}
          <Link
            href="/batteri-till"
            className="group flex flex-col rounded-2xl border border-white/12 bg-white/5 p-6 transition-colors hover:border-amber/40 hover:bg-white/8"
          >
            <Wrench size={20} className="mb-3 text-amber" aria-hidden="true" />
            <div className="mb-1 font-heading text-base font-bold text-white">
              Sök på din maskin
            </div>
            <div className="mb-3 text-sm leading-relaxed text-white/70">
              Nilfisk, Hako, Kärcher, JLG, Genie, Club Car och fler. Saxliftar,
              pallyftare och golfbilar med batteriet som passar.
            </div>
            <span className="mt-auto font-heading text-sm font-bold text-amber">
              Se alla maskiner →
            </span>
          </Link>
        </div>

        <p className="mt-6 text-sm text-white/60">
          Hellre skriva? <a href={`mailto:${EMAIL}`} className="font-semibold text-amber hover:underline">{EMAIL}</a>
        </p>
      </div>
    </section>
  )
}
