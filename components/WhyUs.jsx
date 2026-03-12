"use client"

import FadeIn from "./FadeIn"

const CHECKPOINTS = [
  {
    title: "Sveriges vassaste priser",
    desc: "Vi köper direkt från tillverkaren — inga mellanhänder, inga onödiga påslag. Du får proffs-kvalitet till rätt pris.",
  },
  {
    title: "Leverans inom 1–3 dagar",
    desc: "Beställ före 14:00 så skickas din order samma dag. Fri frakt på allt över 2 000 kr.",
  },
  {
    title: "Ring och prata med en expert",
    desc: "Hos oss svarar någon som faktiskt kan batterier — inte en ordertagare som läser från ett manus.",
  },
  {
    title: "B2B & privat, samma service",
    desc: "Visa pris exkl. moms med ett klick. Större beställning? Ring oss för volympriser.",
  },
]

const NUMBERS = [
  { num: "01", title: "Bästa pris", desc: "Direkt från tillverkare, utan mellanhänder" },
  { num: "02", title: "Snabbast ut", desc: "Samma dag-leverans vid order före kl. 14" },
  { num: "03", title: "Riktig hjälp", desc: "Prata med en människa som kan din maskin" },
]

export default function WhyUs() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-4 sm:gap-16 sm:px-6 lg:grid-cols-2">
        {/* Left — Text */}
        <FadeIn>
          <div>
            <div className="mb-2 text-xs font-bold uppercase tracking-widest text-amber">
              Varför Batteriproffs?
            </div>
            <h2 className="mb-5 font-heading text-[clamp(26px,3.5vw,36px)] font-extrabold tracking-tight text-text-dark">
              Bästa pris. Snabbast leverans.
              <br />
              Kompetens på riktigt.
            </h2>
            <p className="mb-7 text-base leading-relaxed text-text-mid">
              Vi säljer inte tusen olika produkter — vi säljer de bästa 
              industribatterierna till de bästa priserna. Tysktillverkade 
              gel-batterier som håller längre och presterar bättre.
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

            <div className="mb-6 text-xs font-bold uppercase tracking-widest text-amber-bg">
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
