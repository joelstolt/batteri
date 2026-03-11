"use client"

import { Shield, Zap, Users, Award, Truck, HeartHandshake } from "lucide-react"
import FadeIn from "@/components/FadeIn"

export default function AboutContent() {
  return (
    <div className="bg-white">
      {/* Header */}
      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-[1200px] px-4 pb-8 pt-10 sm:px-6">
          <FadeIn>
            <div className="mb-2 text-xs font-bold uppercase tracking-widest text-amber">Om oss</div>
            <h1 className="mb-3 font-heading text-[clamp(28px,4vw,40px)] font-extrabold tracking-tight text-text-dark">
              Specialister, inte generalister
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-text-mid">
              Batteriproffs grundades med en enkel idé: att bli Sveriges bästa 
              leverantör av professionella batterilösningar. Inte störst — bäst.
            </p>
          </FadeIn>
        </div>
      </div>

      {/* Story */}
      <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
        <div className="grid gap-16 lg:grid-cols-2">
          <FadeIn>
            <div>
              <h2 className="mb-5 font-heading text-2xl font-extrabold text-text-dark">
                Varför vi finns
              </h2>
              <div className="flex flex-col gap-4 text-base leading-relaxed text-text-mid">
                <p>
                  De flesta som säljer batterier online försöker täcka allt — 
                  från knappcellsbatterier till lastbilsbatterier. Resultatet 
                  blir ofta ytlig kunskap och generiska rekommendationer.
                </p>
                <p>
                  Vi valde en annan väg. Vi specialiserar oss på professionella 
                  gel-batterier för traktion, städmaskiner, stationära system 
                  och solenergi. Som auktoriserad Sonnenschein-partner har vi 
                  direkt tillgång till hela sortimentet och den tekniska 
                  kompetens som krävs.
                </p>
                <p>
                  När du ringer oss pratar du med någon som faktiskt förstår 
                  ditt användningsområde — inte en ordertagare som läser 
                  från ett manus.
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="rounded-2xl bg-navy p-8 sm:p-10">
              <div className="mb-6 text-xs font-bold uppercase tracking-widest text-amber-bg">
                Batteriproffs i siffror
              </div>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { num: "500+", label: "Levererade ordrar" },
                  { num: "20+", label: "Batterimodeller" },
                  { num: "100%", label: "Sonnenschein-sortiment" },
                  { num: "1–3", label: "Dagars leverans" },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="font-heading text-3xl font-extrabold text-white">{s.num}</div>
                    <div className="mt-1 text-sm text-white/50">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Values */}
      <div className="border-t border-border bg-surface py-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <FadeIn>
            <div className="mb-10 text-center">
              <div className="mb-2 text-xs font-bold uppercase tracking-widest text-amber">
                Våra värderingar
              </div>
              <h2 className="font-heading text-[clamp(24px,3.5vw,34px)] font-extrabold text-text-dark">
                Vad vi står för
              </h2>
            </div>
          </FadeIn>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: <Award size={22} />, title: "Expertis", desc: "Vi kan våra produkter in och ut. Varje rekommendation baseras på erfarenhet, inte gissningar." },
              { icon: <HeartHandshake size={22} />, title: "Ärlighet", desc: "Vi säljer aldrig ett dyrare batteri än du behöver. Vårt mål är att du ska komma tillbaka." },
              { icon: <Shield size={22} />, title: "Kvalitet", desc: "Sonnenschein gel-batterier tillverkas i Tyskland med marknadens strängaste kvalitetskrav." },
              { icon: <Zap size={22} />, title: "Snabbhet", desc: "Order före 14:00 skickas samma dag. De flesta leveranser når dig inom 1–3 arbetsdagar." },
              { icon: <Users size={22} />, title: "Personligt", desc: "Du pratar alltid med en människa. Vi tar oss tid att förstå ditt behov innan vi rekommenderar." },
              { icon: <Truck size={22} />, title: "Service", desc: "Fri frakt över 2 000 kr, 30 dagars öppet köp och support som faktiskt hjälper." },
            ].map((val, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <div className="h-full rounded-2xl border border-border bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-bg/10 text-amber">
                    {val.icon}
                  </div>
                  <h3 className="mb-2 font-heading text-base font-bold text-text-dark">{val.title}</h3>
                  <p className="text-sm leading-relaxed text-text-mid">{val.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>

      {/* Sonnenschein partner */}
      <div className="border-t border-border py-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <FadeIn>
            <div className="rounded-2xl border border-border bg-surface p-8 text-center sm:p-12">
              <div className="mb-3 text-4xl">🇩🇪</div>
              <h2 className="mb-3 font-heading text-2xl font-extrabold text-text-dark">
                Auktoriserad Sonnenschein-partner
              </h2>
              <p className="mx-auto mb-6 max-w-lg text-base text-text-mid">
                Sonnenschein är en del av Exide Technologies — en av världens 
                största batteritillverkare. Deras gel-batterier med Dryfit®-teknologi 
                är branschstandard inom traktion och industri. Som auktoriserad 
                partner har vi direkt tillgång till hela sortimentet.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-text-mid">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green" />
                  Tillverkade i Tyskland
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green" />
                  Underhållsfria
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green" />
                  Dryfit® Gel Technology
                </span>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  )
}
