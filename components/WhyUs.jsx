"use client"

import FadeIn from "./FadeIn"

const CHECKPOINTS = [
  {
    title: "Experter, inte ordertagare",
    desc: "Vi hjälper dig välja rätt — inte bara det dyraste.",
  },
  {
    title: "Sonnenschein-certifierade",
    desc: "Auktoriserad partner med direkt tillgång till hela sortimentet.",
  },
  {
    title: "Företag & privat",
    desc: "B2B-priser med exkl. moms. Privatpersoner lika välkomna.",
  },
  {
    title: "Snabbt & fraktfritt",
    desc: "Fri frakt över 2 000 kr. Leverans inom 1–3 dagar.",
  },
]

const NUMBERS = [
  { num: "01", title: "Nischad", desc: "Vi fokuserar på industri- och specialbatterier" },
  { num: "02", title: "Personlig", desc: "Du pratar med en expert, inte en chatbot" },
  { num: "03", title: "Snabb", desc: "Order före 14:00 skickas samma dag" },
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
              Vi säljer inte allt.
              <br />
              Vi säljer rätt.
            </h2>
            <p className="mb-7 text-base leading-relaxed text-text-mid">
              De flesta batteributiker kastar tusentals produkter mot väggen och
              hoppas att något fastnar. Vi har valt en annan väg — nischad kompetens
              inom traktion, stationärt och gel-batterier.
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
              Vår skillnad
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
