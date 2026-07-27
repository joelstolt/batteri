"use client"

import { Shield, Zap, Users, Award, Truck, HeartHandshake, Clock, Wrench } from "lucide-react"
import FadeIn from "@/components/FadeIn"

export default function AboutContent() {
  return (
    <div className="bg-white">
      {/* Header */}
      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-[1200px] px-4 pb-8 pt-10 sm:px-6">
          <FadeIn>
            <div className="mb-2 text-xs font-bold uppercase tracking-widest text-amber-text">Om oss</div>
            <h1 className="mb-3 font-heading text-[clamp(28px,4vw,40px)] font-extrabold tracking-tight text-text-dark">
              Batteriproffs — din specialist inom traktionsbatterier
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-text-mid">
              Vi är en av Sveriges mest fokuserade leverantörer av professionella
              traktionsbatterier och laddare. Vårt uppdrag är enkelt: att göra det
              lätt att hitta rätt batteri till rätt maskin — till marknadens bästa pris.
            </p>
          </FadeIn>
        </div>
      </div>

      {/* Story + Stats */}
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
                  från knappceller till lastbilsbatterier. Resultatet blir ofta
                  ytlig kunskap och generiska rekommendationer.
                </p>
                <p>
                  Vi valde en annan väg. Batteriproffs fokuserar uteslutande på
                  traktionsbatterier för industri, städmaskiner, liftar, golfbilar
                  och elfordon. Vi säljer enbart produkter vi själva litar på — från
                  Nordmax, Discover och Sonnenschein.
                </p>
                <p>
                  Det smala fokuset gör att vi kan erbjuda djup produktkunskap,
                  vassare priser och snabbare leveranser. När du kontaktar oss
                  pratar du med någon som faktiskt förstår ditt användningsområde —
                  inte en ordertagare som läser från ett manus.
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="rounded-2xl bg-navy p-8 sm:p-10">
              <div className="mb-6 text-xs font-bold uppercase tracking-widest text-amber-text">
                Batteriproffs i siffror
              </div>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { num: "21+", label: "Batterimodeller i lager" },
                  { num: "3", label: "Premiumvarumärken" },
                  { num: "08–17", label: "Mån–Fre öppet" },
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

      {/* Expertise section */}
      <div className="border-t border-border bg-surface py-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <FadeIn>
            <div className="mb-10">
              <div className="mb-2 text-xs font-bold uppercase tracking-widest text-amber-text">
                Vår expertis
              </div>
              <h2 className="font-heading text-[clamp(24px,3.5vw,34px)] font-extrabold text-text-dark">
                Batterier är det enda vi gör
              </h2>
            </div>
          </FadeIn>

          <div className="grid gap-12 lg:grid-cols-2">
            <FadeIn>
              <div className="flex flex-col gap-4 text-base leading-relaxed text-text-mid">
                <p>
                  Batterier är kritiska komponenter. En städmaskin som stannar mitt i
                  ett skift, en golfbil som inte klarar 18 hål eller en lift som inte
                  startar — det kostar tid och pengar. Därför är det avgörande att välja
                  rätt batteri från början.
                </p>
                <p>
                  Vi hjälper dig genom hela processen: från att identifiera vilken
                  batterimodell som passar din maskin, till att välja rätt laddare
                  och ge tips om underhåll som förlänger livslängden. Vårt
                  produktsortiment spänner över våtbatterier, AGM/Dry Cell och
                  gelbatterier i spänningar från 6V till 12V.
                </p>
                <p>
                  Alla våra batterier levereras med fullständig teknisk dokumentation
                  och vi står alltid redo att svara på frågor — före, under och
                  efter köpet.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  { icon: <Wrench size={20} />, title: "Truckar & liftar", desc: "Saxliftar, personliftar, ledstaplare och industrituckar." },
                  { icon: <Zap size={20} />, title: "Städmaskiner", desc: "Åkbara och gångbakom-modeller från Nilfisk, Hako, Kärcher m.fl." },
                  { icon: <Users size={20} />, title: "Golfbilar & fritid", desc: "Club Car, E-Z-GO, Yamaha och andra elfordon." },
                  { icon: <Shield size={20} />, title: "Stationärt & sol", desc: "UPS, nödbelysning, solcellslagring och reservkraft." },
                ].map((item, i) => (
                  <div key={i} className="rounded-xl border border-border bg-white p-5">
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-amber-bg/10 text-amber">
                      {item.icon}
                    </div>
                    <h3 className="mb-1 text-sm font-bold text-text-dark">{item.title}</h3>
                    <p className="text-sm text-text-mid">{item.desc}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="border-t border-border py-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <FadeIn>
            <div className="mb-10 text-center">
              <div className="mb-2 text-xs font-bold uppercase tracking-widest text-amber-text">
                Våra värderingar
              </div>
              <h2 className="font-heading text-[clamp(24px,3.5vw,34px)] font-extrabold text-text-dark">
                Vad vi står för
              </h2>
            </div>
          </FadeIn>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: <Award size={22} />, title: "Expertis", desc: "Vi kan våra produkter in och ut. Varje rekommendation baseras på erfarenhet och produktkunskap — inte gissningar." },
              { icon: <HeartHandshake size={22} />, title: "Ärlighet", desc: "Vi säljer aldrig ett dyrare batteri än du behöver. Vårt mål är att du ska komma tillbaka." },
              { icon: <Shield size={22} />, title: "Kvalitet", desc: "Vi säljer enbart batterier från tillverkare vi litar på: Nordmax, Discover och Sonnenschein." },
              { icon: <Zap size={22} />, title: "Snabbhet", desc: "Batterier skickas direkt från leverantör. De flesta leveranser når dig inom 1–3 arbetsdagar." },
              { icon: <Users size={22} />, title: "Personligt", desc: "Ring eller mejla oss på vardagar 08–17. Vi tar oss tid att förstå ditt behov innan vi rekommenderar." },
              { icon: <Truck size={22} />, title: "Service", desc: "Snabb leverans 1–3 dagar, 30 dagars öppet köp och support som faktiskt hjälper dig." },
            ].map((val, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <div className="h-full rounded-2xl border border-border bg-surface p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
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

      {/* Sustainability */}
      <div className="border-t border-border bg-surface py-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <FadeIn>
              <div>
                <h2 className="mb-4 font-heading text-2xl font-extrabold text-text-dark">
                  Hållbarhet i fokus
                </h2>
                <div className="flex flex-col gap-4 text-base leading-relaxed text-text-mid">
                  <p>
                    Att byta batteri istället för att köpa en ny maskin är ett av de
                    mest hållbara valen du kan göra. Ett nytt batteri förlänger livslängden
                    på din städmaskin, truck eller golfbil med många år — till en bråkdel
                    av kostnaden.
                  </p>
                  <p>
                    Vi uppmuntrar våra kunder att välja rätt batteri och rätt laddare
                    från början. Korrekt laddning kan fördubbla batteriets livslängd,
                    vilket sparar både pengar och resurser. Alla blybatterier vi säljer
                    är dessutom till över 95% återvinningsbara.
                  </p>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  { val: "95%+", label: "Återvinningsgrad för blybatterier" },
                  { val: "2–3×", label: "Längre livslängd med rätt laddare" },
                  { val: "700+", label: "Cykler med Sonnenschein gel" },
                  { val: "1 000+", label: "Cykler med Discover Dry Cell" },
                ].map((stat, i) => (
                  <div key={i} className="rounded-xl border border-border bg-white p-5 text-center">
                    <div className="font-heading text-2xl font-extrabold text-text-dark">{stat.val}</div>
                    <div className="mt-1 text-sm text-text-mid">{stat.label}</div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Brands */}
      <div className="border-t border-border py-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <FadeIn>
            <div className="mb-10 text-center">
              <div className="mb-2 text-xs font-bold uppercase tracking-widest text-amber-text">
                Våra varumärken
              </div>
              <h2 className="font-heading text-[clamp(24px,3.5vw,34px)] font-extrabold text-text-dark">
                Tre varumärken vi står bakom
              </h2>
            </div>
          </FadeIn>

          <div className="grid gap-5 sm:grid-cols-3">
            {[
              {
                name: "Nordmax",
                type: "Våtbatterier (flooded)",
                desc: "Prisvärda traktionsbatterier för golfbilar, liftar och städmaskiner. Hög cykeltålighet, kompatibla med Trojan-format. Utformade för nordiska förhållanden.",
              },
              {
                name: "Discover",
                type: "Dry Cell (AGM)",
                desc: "Helt underhållsfria traktionsbatterier med patenterad hydropolymer-teknologi. Spillsäkra, vibrationståliga och läckagefria. Upp till 1 000 cykler.",
              },
              {
                name: "Sonnenschein",
                type: "Gelbatterier (dryfit)",
                desc: "Tysktillverkade premiumbatterier med över 130 års erfarenhet. Branschstandard inom industri och traktion. 700 cykler, helt underhållsfria.",
              },
            ].map((brand, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="h-full rounded-2xl border border-border bg-surface p-6">
                  <h3 className="mb-1 font-heading text-lg font-bold text-text-dark">{brand.name}</h3>
                  <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-amber-text">{brand.type}</div>
                  <p className="text-sm leading-relaxed text-text-mid">{brand.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="border-t border-border bg-surface py-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <FadeIn>
            <div className="rounded-2xl bg-navy p-8 text-center sm:p-12">
              <div className="mb-3 flex items-center justify-center gap-2">
                <Clock size={20} className="text-amber-bg" />
                <span className="text-sm font-semibold text-amber-bg">Mån–Fre 08:00–17:00</span>
              </div>
              <h2 className="mb-3 font-heading text-2xl font-extrabold text-white">
                Osäker på vilket batteri du behöver?
              </h2>
              <p className="mx-auto mb-6 max-w-lg text-base text-white/70">
                Berätta vilken maskin du har så hjälper vi dig hitta rätt batteri
                och laddare — snabbt, enkelt och utan kostnad.
              </p>
              <a
                href="/kontakt"
                className="inline-flex items-center gap-2 rounded-xl bg-amber-bg px-8 py-3.5 font-heading text-base font-bold text-navy transition-transform hover:-translate-y-px"
              >
                Kontakta oss
              </a>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  )
}
