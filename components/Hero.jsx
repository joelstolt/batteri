"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Phone } from "lucide-react"
import HeroSearch from "@/components/HeroSearch"
import { PHONE, PHONE_LINK } from "@/lib/constants"

/**
 * Heron gör två saker: säger vad vi säljer med orden folk söker på, och låter
 * besökaren hitta sitt batteri direkt.
 *
 * Produktbilden är inte dekoration. Utan den var heron ett platt marinblått
 * fält med text och en vit ruta — ingenting visade att sajten säljer batterier.
 * Bilden är en av tre produktfoton med transparent bakgrund, vilket är det
 * enda som ser bra ut mot mörkt.
 */
export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy">
      {/* Mjuk ljuskägla bakom innehållet så ytan inte blir helt platt.
          Ren CSS-gradient — kostar ingenting i prestanda. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(253,184,19,0.10),transparent_55%)]"
      />

      <div className="relative mx-auto max-w-[1200px] px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_340px] lg:gap-14">
          <motion.div
            className="max-w-[720px]"
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

            <p className="mb-8 max-w-[620px] text-[17px] leading-relaxed text-white/75">
              Traktionsbatterier och gelbatterier till truckar, saxliftar,
              pallyftare, städmaskiner och UPS. Priserna står öppet på sajten,
              leverans normalt på 1–3 arbetsdagar, och vi svarar själva i telefon
              när du behöver hjälp att välja rätt.
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

          {/* Produkten. Dold på mobil — där är lodrätt utrymme värt mer än
              dekoration, och sökfältet ska nås utan att scrolla. */}
          <motion.div
            className="relative hidden lg:block"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="absolute inset-0 -m-8 rounded-full bg-[radial-gradient(circle,rgba(253,184,19,0.14),transparent_65%)]" />
            <Image
              src="/produkter/gf12105v.png"
              alt="Sonnenschein gelbatteri 12V 105Ah"
              width={340}
              height={340}
              priority
              sizes="340px"
              className="relative mx-auto h-auto w-full max-w-[320px] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.45)]"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
