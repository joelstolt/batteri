"use client"

import FadeIn from "./FadeIn"

const CHECKPOINTS = [
  {
    title: "Normalt 1–3 dagars leverans",
    desc: "Order lagd före 14:00 skickas normalt samma dag och är oftast framme inom 1–3 arbetsdagar. Vid restnotering eller pallbokning kan det ta längre — vi hör av oss om något drar ut.",
  },
  {
    // Inte "direkt från tillverkaren": vi köper via distributör. Det som ÄR
    // sant och går att kontrollera är prisnivån och att priserna står öppet.
    title: "Öppna priser, långt under märkespriset",
    desc: "Priset står på varje produkt, inga offertformulär. Ett likvärdigt batteri till Trojan T-105 kostar 2 195 kr hos oss — jämför gärna med vad märkesåterförsäljarna tar.",
  },
  {
    title: "Svar direkt, dygnet runt",
    desc: "Chatten kan hela sortimentet: pris, passform, frakt. Behövs en människa tar vi över i chatten eller svarar per mejl inom några timmar på vardagar.",
  },
  {
    title: "Byggt för företagsköp",
    desc: "Pris exkl. moms med ett klick, orgnr och referens på kvittot, lossningsval för pallgods. Större beställning? Chatta med oss för volympriser.",
  },
]

const NUMBERS = [
  { num: "01", title: "Öppna priser", desc: "Står på varje produkt, långt under märkespriset" },
  { num: "02", title: "Snabbast ut", desc: "Skickas normalt samma dag vid order före kl. 14" },
  { num: "03", title: "Svar direkt", desc: "Chatten svarar dygnet runt, en människa tar över vid behov" },
]

export default function WhyUs() {
  return (
    <section className="border-t border-border bg-surface py-20">
      <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-4 sm:gap-16 sm:px-6 lg:grid-cols-2">
        {/* Left — Text */}
        <FadeIn>
          <div>
            <div className="mb-2 text-xs font-bold uppercase tracking-widest text-amber-text">
              Varför Batteriproffs?
            </div>
            {/*
              Inga superlativ. Rubriken var "Bästa pris. Snabbast leverans." och
              brödtexten lovade "de bästa priserna" fram till 2026-08-03. Sånt
              går inte att belägga och bidrog till Googles
              Felaktig framställning-flagga. Öppna priser är däremot ett
              påstående vem som helst kan kontrollera på tio sekunder.
            */}
            <h2 className="mb-5 font-heading text-[clamp(26px,3.5vw,36px)] font-extrabold tracking-tight text-text-dark">
              Öppna priser. Smalt sortiment.
              <br />
              Kompetens på riktigt.
            </h2>
            <p className="mb-7 text-base leading-relaxed text-text-mid">
              Vi säljer inte tusen olika produkter, vi säljer industribatterier
              och sätter ut priset direkt på sajten. Tysktillverkade gel-batterier
              från Sonnenschein, underhållsfria och byggda för daglig drift.
            </p>

            <div className="flex flex-col gap-4">
              {CHECKPOINTS.map((item, i) => (
                <FadeIn key={i} delay={i * 0.06}>
                  <div className="flex items-start gap-3.5">
                    <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-navy/5">
                      <svg
                        width="14"
                        height="14"
                        fill="none"
                        stroke="#0B1D3A"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M2 7l3.5 3.5L12 4" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-heading text-[15px] font-bold text-text-dark">
                        {item.title}
                      </div>
                      <div className="text-sm leading-snug text-text-mid">
                        {item.desc}
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Right — Dark card */}
        <FadeIn delay={0.2}>
          <div className="relative overflow-hidden rounded-2xl bg-navy p-10">
            {/* Glow */}
            <div className="pointer-events-none absolute -right-10 -top-10 h-[200px] w-[200px] rounded-full bg-[radial-gradient(circle,rgba(253,184,19,0.06),transparent)]" />

            <div className="mb-6 text-xs font-bold uppercase tracking-widest text-amber-text">
              Tre löften
            </div>

            {NUMBERS.map((item, i) => (
              <div
                key={i}
                className={`flex items-start gap-4 py-5 ${
                  i > 0 ? "border-t border-white/6" : ""
                }`}
              >
                <div className="w-10 flex-shrink-0 font-heading text-[28px] font-extrabold leading-none text-white/8">
                  {item.num}
                </div>
                <div>
                  <div className="mb-1 font-heading text-[17px] font-bold text-white">
                    {item.title}
                  </div>
                  <div className="text-sm leading-snug text-white/75">
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
