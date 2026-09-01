"use client"

import Link from "next/link"
import { ChevronRight, Wrench, PackageCheck, HelpCircle, MessageCircle } from "lucide-react"
import ProductCard from "@/components/ProductCard"
import FadeIn from "@/components/FadeIn"
import ChattKnapp from "@/components/ChattKnapp"

export default function MachinePageContent({ machine, products }) {
  return (
    <div className="bg-white">
      {/* Sidhuvud */}
      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-[1200px] px-4 pb-10 pt-8 sm:px-6">
          <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-xs text-text-mid">
            <Link href="/" className="hover:text-text-dark">Hem</Link>
            <ChevronRight size={13} className="text-text-light" />
            <Link href="/batteri-till" className="hover:text-text-dark">Batteri till maskin</Link>
            <ChevronRight size={13} className="text-text-light" />
            <span className="text-text-dark">{machine.name}</span>
          </nav>

          <div className="mb-2 text-xs font-bold uppercase tracking-widest text-amber-text">
            {machine.type}
          </div>
          <h1 className="mb-4 max-w-3xl font-heading text-[clamp(26px,4vw,38px)] font-extrabold leading-tight tracking-tight text-text-dark">
            Batteri till {machine.name}
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-text-mid">{machine.intro}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <ChattKnapp
              className="inline-flex items-center gap-2 rounded-xl bg-navy px-5 py-3 font-heading text-sm font-bold text-white transition-colors hover:bg-navy-light"
            >
              <MessageCircle size={15} />
              Osäker på modellen? Chatta med oss
            </ChattKnapp>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6">
        {/* Passande batterier */}
        <FadeIn>
          <div className="mb-6 flex items-center gap-2">
            <PackageCheck size={19} className="text-navy" />
            <h2 className="font-heading text-xl font-bold text-text-dark">
              {products.length === 1
                ? "Batteriet som passar"
                : `${products.length} batterier som passar`}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </FadeIn>

        {/* Egen brödtext, bara på sidor med uppmätt efterfrågan. Se lib/machines.js. */}
        {machine.sections?.length ? (
          <FadeIn delay={0.03}>
            <div className="mt-14 max-w-2xl">
              {machine.sections.map((sec) => (
                <div key={sec.h} className="mb-8 last:mb-0">
                  <h2 className="mb-3 font-heading text-xl font-bold text-text-dark">
                    {sec.h}
                  </h2>
                  {sec.p.map((stycke) => (
                    <p key={stycke} className="mb-3 text-sm leading-relaxed text-text-mid last:mb-0">
                      {stycke}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </FadeIn>
        ) : null}

        {/* Innan du beställer */}
        <FadeIn delay={0.05}>
          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-surface p-6">
              <div className="mb-3 flex items-center gap-2">
                <Wrench size={17} className="text-navy" />
                <h2 className="font-heading text-lg font-bold text-text-dark">
                  Kontrollera detta innan du beställer
                </h2>
              </div>
              <ul className="flex flex-col gap-2.5 text-sm leading-relaxed text-text-mid">
                <li>
                  <strong className="text-text-dark">Systemspänningen.</strong> Räkna antalet
                  batterier som sitter i maskinen i dag och multiplicera med deras märkspänning.
                  Sex 8V-batterier betyder ett 48V-system.
                </li>
                <li>
                  <strong className="text-text-dark">Batterifackets mått.</strong> Kapaciteten
                  hjälper inte om batteriet inte får plats. Mät längd, bredd och höjd inklusive poler.
                </li>
                <li>
                  <strong className="text-text-dark">Polernas placering.</strong> Plus och minus
                  måste sitta åt rätt håll för att kablaget ska räcka.
                </li>
                <li>
                  <strong className="text-text-dark">Byt hela uppsättningen.</strong> Ett nytt
                  batteri i serie med gamla åldras i takt med de gamla. Halva besparingen försvinner.
                </li>
              </ul>
              {/*
                Kopplingarna bygger på maskinens spänning och kapacitet, som går
                att belägga hos tillverkaren. Batterifackets mått gör det inte,
                varken Kärcher eller Nilfisk publicerar dem. Garantin nedan är
                det som bär den risken, och därför ska den stå här och inte bara
                på villkorssidan. Se kommentaren i lib/machines.js.
              */}
              <p className="mt-4 rounded-xl bg-white p-4 text-sm leading-relaxed text-text-mid">
                <strong className="text-text-dark">Passar det ändå inte byter vi.</strong>{" "}
                Har vi rekommenderat batteriet står vi för bytet och frakten åt båda hållen,
                utan returavdrag. Förpackningen ska vara obruten och batteriet får inte ha
                kopplats in. Villkoren står under{" "}
                <Link href="/villkor" className="text-navy underline">
                  passformsgarantin
                </Link>
                .
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6">
              <div className="mb-3 flex items-center gap-2">
                <HelpCircle size={17} className="text-navy" />
                <h2 className="font-heading text-lg font-bold text-text-dark">
                  Hittar du inte din modell?
                </h2>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-text-mid">
                Vi har fler batterier i lager än vad som listas här, och sitter det en annan
                variant i din maskin hittar vi oftast en direkt ersättare. Ring med
                maskinens modellbeteckning och märkspänningen, eller fotografera etiketten på
                det batteri som sitter i nu och mejla bilden.
              </p>
              <div className="flex flex-col gap-2 text-sm">
                <ChattKnapp
                  className="font-semibold text-navy hover:underline"
                >
                  Chatta med oss
                </ChattKnapp>
                <Link href="/kontakt" className="font-semibold text-navy hover:underline">
                  Skicka ett meddelande
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Frågorna kommer från Googles People Also Ask på sökfrasen, så de
            matchar det folk faktiskt undrar. FAQPage-schemat sätts i page.js. */}
        {machine.faq?.length ? (
          <FadeIn delay={0.1}>
            <div className="mt-14 max-w-2xl">
              <h2 className="font-heading text-xl font-bold text-text-dark">Vanliga frågor</h2>
              <dl className="mt-5 space-y-5">
                {machine.faq.map((f) => (
                  <div key={f.q}>
                    <dt className="font-heading font-bold text-text-dark">{f.q}</dt>
                    <dd className="mt-1.5 text-sm leading-relaxed text-text-mid">{f.a}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </FadeIn>
        ) : null}
      </div>
    </div>
  )
}
