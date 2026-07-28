"use client"

import { motion } from "framer-motion"
import { Phone } from "lucide-react"
import HeroSearch from "@/components/HeroSearch"
import { PHONE, PHONE_LINK } from "@/lib/constants"

/**
 * Heron gör två saker: säger vad vi säljer med orden folk söker på, och ger
 * något att klicka på direkt.
 *
 * Tidigare låg 4 produktkort och en knapp här nere, vilket sköt undan
 * uppmärksamheten från rubriken och gav besökaren en produktvägg innan hen
 * hunnit förstå vad sajten är. Produkterna ligger nu i egen sektion längre ned.
 */
export default function Hero() {
  return (
    <section className="bg-navy">
      <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 sm:py-24">
        <motion.div
          className="max-w-[780px]"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber/40 bg-amber/10 px-3.5 py-1.5 font-heading text-xs font-bold uppercase tracking-wider text-amber">
            <span className="text-sm">🏆</span>
            Marknadens vassaste priser
          </div>

          <h1 className="mb-5 font-heading text-[clamp(32px,4.5vw,52px)] font-extrabold leading-[1.05] tracking-tight text-white">
            Batteri till truck, lift och städmaskin
            <br />
            {/* "normalt" är inte utfyllnad. Leverantören skickar direkt till kund
                i nio fall av tio, så avsändningsdagen är inget Batteriproffs
                kontrollerar. Utan reservationen är det ett garantilöfte i sidans
                mest framträdande text — och samma löfte står i köpvillkoren. */}
            <span className="text-amber">beställ före 14, skickas normalt samma dag</span>
          </h1>

          <p className="mb-8 max-w-[640px] text-[17px] leading-relaxed text-white/75">
            Traktionsbatterier och gelbatterier till truckar, saxliftar,
            pallyftare, städmaskiner och UPS. Priserna står öppet på sajten,
            leverans normalt på 1–3 arbetsdagar, och vi svarar själva i telefon när du
            behöver hjälp att välja rätt.
          </p>

          {/* Sökfältet i stället för knappar. Besökaren skriver sin maskin och
              får batteriet med pris direkt — hela långsvans-strategin gjord
              användbar, i stället för ännu ett påstående. */}
          <HeroSearch />

          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <span className="text-white/70">
              Priset står på varje produkt. Inga offertformulär.
            </span>
            <a
              href={`tel:${PHONE_LINK}`}
              className="inline-flex items-center gap-2 font-heading font-bold text-amber hover:underline"
            >
              <Phone size={15} aria-hidden="true" />
              Hellre ringa? {PHONE}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
