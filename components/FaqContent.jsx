"use client"

import { useState } from "react"
import { ChevronDown, Package, Truck, CreditCard, RotateCcw, Zap, HelpCircle } from "lucide-react"
import { PHONE, PHONE_LINK, EMAIL } from "@/lib/constants"
import FadeIn from "@/components/FadeIn"
import Link from "next/link"

const FAQ_SECTIONS = [
  {
    title: "Beställning & produkter",
    icon: Package,
    items: [
      {
        q: "Vilka batterier säljer ni?",
        a: "Vi är specialiserade på professionella Sonnenschein gel-batterier. Vårt sortiment täcker fyra huvudkategorier: traktionsbatterier (truckar, golfbilar, entreprenadmaskiner), städmaskinbatterier, stationära batterier (larm, hissar, UPS, sprinklersystem) och fritid/solenergi (husbil, båt, solceller, off-grid).",
      },
      {
        q: "Hur vet jag vilket batteri jag behöver?",
        a: "Det enklaste sättet är att kontakta oss med information om din maskin eller ditt användningsområde. Du kan också använda vår Battery Finder på startsidan för att filtrera efter område och spänning. Har du ett befintligt batteri? Notera modellnumret (t.ex. GF 12 105V) så hjälper vi dig hitta rätt ersättning.",
      },
      {
        q: "Säljer ni till privatpersoner?",
        a: "Ja, vi säljer till både företag och privatpersoner. Alla priser på sidan visas exklusive moms. Momsen (25%) läggs till i kassan.",
      },
      {
        q: "Kan jag få en offert för en större beställning?",
        a: "Absolut. Kontakta oss via telefon eller mejl med information om vilka batterier och antal du behöver, så skickar vi en offert. Vid större volymer kan vi erbjuda bättre priser.",
      },
    ],
  },
  {
    title: "Frakt & leverans",
    icon: Truck,
    items: [
      {
        q: "Vad kostar frakten?",
        a: "Vi erbjuder fri frakt på beställningar över 2 000 kr. Under det tillkommer en fraktavgift som beräknas i kassan baserat på vikt och destination. Batterier är tunga produkter, så fraktkostnaden varierar beroende på beställningen.",
      },
      {
        q: "Hur lång är leveranstiden?",
        a: "De flesta beställningar levereras inom 1–3 arbetsdagar. Beställningar lagda före kl. 14 på vardagar skickas normalt samma dag. Vid leverans av pallar eller tyngre gods kan det ta 2–5 arbetsdagar.",
      },
      {
        q: "Vilka fraktbolag använder ni?",
        a: "Vi skickar via PostNord, DHL och Schenker beroende på paketets storlek och vikt. Mindre paket skickas oftast med PostNord, medan pallar och tyngre gods går via DHL eller Schenker.",
      },
      {
        q: "Levererar ni till hela Sverige?",
        a: "Ja, vi levererar till hela Sverige inklusive Gotland. Kontakta oss för leverans till andra nordiska länder.",
      },
    ],
  },
  {
    title: "Betalning",
    icon: CreditCard,
    items: [
      {
        q: "Vilka betalningsalternativ finns?",
        a: "Vi erbjuder betalning via Visa, Mastercard, Klarna (faktura och delbetalning) och Swish. Alla betalningar hanteras säkert via Stripe.",
      },
      {
        q: "Kan jag betala med faktura?",
        a: "Ja, via Klarna kan du välja att betala med faktura (30 dagar). För företagskunder kan vi i vissa fall erbjuda direktfaktura — kontakta oss för att diskutera villkoren.",
      },
      {
        q: "Är det säkert att handla hos er?",
        a: "Ja. Vi använder Stripe som betalningsleverantör, vilket innebär att alla transaktioner är krypterade och uppfyller PCI DSS-standarden. Vi lagrar aldrig dina kortuppgifter.",
      },
    ],
  },
  {
    title: "Retur & reklamation",
    icon: RotateCcw,
    items: [
      {
        q: "Vad är er returpolicy?",
        a: "Vi erbjuder 30 dagars öppet köp i enlighet med distanshandelslagen. Produkten ska vara oanvänd och i originalförpackning. Kontakta oss innan du skickar tillbaka en vara så skickar vi en retursedel.",
      },
      {
        q: "Vad gör jag om batteriet är skadat vid leverans?",
        a: "Kontakta oss inom 24 timmar med bilder på skadan och fraktsedeln. Vi ordnar ersättning eller full återbetalning. Dokumentera alltid eventuella transportskador direkt vid leverans.",
      },
      {
        q: "Finns det garanti på batterierna?",
        a: "Ja, alla Sonnenschein-batterier levereras med tillverkargaranti. Garantitiden varierar beroende på modell och användningsområde — se produktsidan för specifik information eller kontakta oss.",
      },
    ],
  },
  {
    title: "Teknik & underhåll",
    icon: Zap,
    items: [
      {
        q: "Vad är skillnaden på gel- och AGM-batterier?",
        a: "Gel-batterier (som Sonnenschein) har elektrolyten bunden i en gel, vilket gör dem helt underhållsfria, läckagefria och tåliga mot djupurladdning. AGM-batterier har elektrolyten absorberad i glasfibermatta. Gel-batterier har generellt längre livslängd och bättre prestanda vid cyklisk användning.",
      },
      {
        q: "Hur lång livslängd har ett gel-batteri?",
        a: "Sonnenschein dryfit-batterier har en designlivslängd på 6–12 år beroende på modell och användningsmönster. Livslängden påverkas av urladdningsdjup, temperatur och laddningsrutiner. Korrekt laddning och underhåll förlänger livslängden betydligt.",
      },
      {
        q: "Behöver jag en speciell laddare?",
        a: "Gel-batterier kräver en laddare med korrekt laddningsprofil (IU-kurva). Laddaren ska ha en laddningsspänning på max 14.4V för 12V-batterier och temperaturkompensering. Vi rekommenderar att du kontaktar oss för vägledning om rätt laddare.",
      },
    ],
  },
]

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="text-[15px] font-semibold text-text-dark pr-4">
          {question}
        </span>
        <div
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
            open ? "bg-navy rotate-180" : "bg-surface"
          }`}
        >
          <ChevronDown
            className={`h-4 w-4 transition-colors ${open ? "text-white" : "text-text-mid"}`}
            strokeWidth={2.5}
          />
        </div>
      </button>
      <div
        className={`grid transition-all duration-200 ease-in-out ${
          open ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="text-[15px] leading-relaxed text-text-mid pr-12">
            {answer}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function FaqContent() {
  return (
    <div className="bg-white">
      {/* Header */}
      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-[1200px] px-4 pb-8 pt-10 sm:px-6">
          <FadeIn>
            <div className="mb-2 text-xs font-bold uppercase tracking-widest text-amber">
              Support
            </div>
            <h1 className="mb-3 font-heading text-[clamp(28px,4vw,40px)] font-extrabold tracking-tight text-text-dark">
              Vanliga frågor
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-text-mid">
              Här hittar du svar på de vanligaste frågorna om beställning, frakt, 
              betalning och våra produkter. Hittar du inte svaret?{" "}
              <Link href="/kontakt" className="font-semibold text-navy underline decoration-navy/30 underline-offset-2 transition-colors hover:text-accent">
                Kontakta oss
              </Link>
              .
            </p>
          </FadeIn>
        </div>
      </div>

      {/* FAQ sections */}
      <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-[800px]">
          {FAQ_SECTIONS.map((section, i) => (
            <FadeIn key={section.title} delay={i * 0.08}>
              <div className="mb-12 last:mb-0">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy/5">
                    <section.icon className="h-4.5 w-4.5 text-navy" strokeWidth={2} />
                  </div>
                  <h2 className="font-heading text-lg font-extrabold text-text-dark">
                    {section.title}
                  </h2>
                </div>
                <div className="rounded-xl border border-border bg-white">
                  {section.items.map((item) => (
                    <FaqItem key={item.q} question={item.q} answer={item.a} />
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* CTA */}
        <FadeIn delay={0.3}>
          <div className="mx-auto mt-16 max-w-[800px] rounded-2xl bg-navy p-8 text-center sm:p-10">
            <HelpCircle className="mx-auto mb-4 h-8 w-8 text-amber-bg" strokeWidth={1.5} />
            <h3 className="mb-2 font-heading text-xl font-extrabold text-white">
              Hittade du inte svaret?
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-white/50">
              Ring oss eller skicka ett mejl så hjälper vi dig inom kort.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={`tel:${PHONE_LINK}`}
                className="inline-flex items-center gap-2 rounded-full bg-amber-bg px-6 py-3 text-sm font-bold text-navy transition-all hover:brightness-110"
              >
                Ring {PHONE}
              </a>
              <a
                href={`mailto:${EMAIL}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-white/5"
              >
                Skicka mejl
              </a>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
