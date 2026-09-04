"use client"

import { useVat } from "@/lib/vat-context"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { MessageCircle, ArrowRight } from "lucide-react"
import HeroSearch from "@/components/HeroSearch"
import ChattKnapp from "@/components/ChattKnapp"
import { publicProducts } from "@/lib/products"

/** Utgångsläget: det batteri som bär "Populär"-märket. */
const START = publicProducts.find((p) => p.badge) || publicProducts[0]

function formatPris(n) {
  return new Intl.NumberFormat("sv-SE").format(n)
}

/**
 * Heron gör två saker: säger vad vi säljer med orden folk söker på, och låter
 * besökaren hitta sitt batteri direkt.
 *
 * Produktkortet till höger följer sökningen. Skriver besökaren "nilfisk sc401"
 * byts kortet till batteriet som passar, med pris. En stillastående bild var
 * både tråkig och opersonlig; ett kort som svarar visar i handling både
 * sortimentet och att priserna står öppet.
 */
export default function Hero() {
  const { displayPrice, vatLabel } = useVat()
  const [visad, setVisad] = useState(null)
  const onForhandsvisning = useCallback((t) => setVisad(t), [])

  // Kortet visar det besökaren söker på, annars startprodukten. Ett vitt kort
  // i stället för en fri bild — bara tre av tjugo produktfoton är urklippta,
  // resten har vit botten och hade sett trasiga ut direkt mot marinblått.
  const kort = visad?.bild
    ? { bild: visad.bild, titel: visad.titel, under: visad.undertitel, pris: visad.pris, href: visad.href }
    : {
        bild: START.images[0],
        titel: START.shortName,
        under: `${START.voltage} · ${START.capacity}`,
        pris: START.price,
        href: `/produkt/${START.slug}`,
      }

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
              Öppna priser · verifierade köp
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
              städmaskiner och UPS. Priserna står öppet, leverans normalt 1–3
              arbetsdagar, och chatten hjälper dig välja rätt.
            </p>

            {/* Sökfältet i stället för knappar. Besökaren skriver sin maskin och
                får batteriet med pris direkt — hela långsvans-strategin gjord
                användbar, i stället för ännu ett påstående. */}
            <HeroSearch onForhandsvisning={onForhandsvisning} />

            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              <span className="text-white/70">
                Priset står på varje produkt. Inga offertformulär.
              </span>
              <ChattKnapp className="inline-flex items-center gap-2 font-heading font-bold text-amber hover:underline">
                <MessageCircle size={15} aria-hidden="true" />
                Frågor? Chatta med oss
              </ChattKnapp>
            </div>
          </motion.div>

          {/* Produktkortet följer sökningen. Dolt på mobil — där är lodrätt
              utrymme värt mer än dekoration, och sökfältet ska nås utan att
              scrolla. Fast höjd så inget hoppar när kortet byts. */}
          <div className="relative hidden lg:block">
            <div
              aria-hidden="true"
              className="absolute inset-0 -m-6 rounded-full bg-[radial-gradient(circle,rgba(253,184,19,0.14),transparent_65%)]"
            />
            <AnimatePresence mode="wait">
              <motion.div
                key={kort.href}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="relative"
              >
                <Link
                  href={kort.href}
                  className="group block overflow-hidden rounded-2xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
                >
                  <div className="relative flex h-[220px] items-center justify-center bg-surface p-6">
                    <Image
                      src={kort.bild}
                      alt={kort.titel}
                      width={260}
                      height={260}
                      priority
                      sizes="260px"
                      className="h-full w-auto object-contain"
                    />
                  </div>
                  <div className="p-5">
                    <div className="truncate font-heading text-base font-bold text-text-dark">
                      {kort.titel}
                    </div>
                    <div className="mt-0.5 truncate text-sm text-text-mid">{kort.under}</div>
                    {kort.pris && (
                      <div className="mt-3 flex items-end justify-between">
                        <div>
                          <div className="font-heading text-2xl font-extrabold text-text-dark">
                            {formatPris(displayPrice(kort.pris))} kr
                          </div>
                          <div className="text-[11px] text-text-light">{vatLabel}</div>
                        </div>
                        <span className="flex items-center gap-1 text-sm font-bold text-navy group-hover:underline">
                          Se batteriet
                          <ArrowRight size={14} aria-hidden="true" />
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
