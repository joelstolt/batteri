"use client"

import Link from "next/link"
import {
  BatteryCharging,
  Snowflake,
  Gauge,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
} from "lucide-react"
import { PHONE, PHONE_LINK, EMAIL } from "@/lib/constants"
import FadeIn from "@/components/FadeIn"

const TOC = [
  { id: "grunder", label: "Grunderna" },
  { id: "laddning", label: "Laddning" },
  { id: "forvaring", label: "Förvaring" },
  { id: "misstag", label: "Vanliga misstag" },
  { id: "checklista", label: "Underhållschecklista" },
  { id: "felsokning", label: "Felsökning" },
]

const SECTIONS = [
  {
    id: "grunder",
    icon: Gauge,
    title: "Grunderna — så fungerar ditt batteri",
    body: [
      "Ett gel-batteri (som Sonnenschein dryfit) använder en gel-elektrolyt istället för flytande syra. Det gör batteriet helt underhållsfritt, läckagefritt och tåligt mot djupurladdning. Cyklisk användning — där batteriet laddas ur och upp gång på gång — är vad gel-tekniken är gjord för.",
      "Livslängden mäts oftast i cykler. Hur många cykler du får ut beror på tre saker: urladdningsdjup (DoD), laddningsrutiner och temperatur. Ett batteri som regelbundet djupurladdas till 100 % får färre cykler än ett som hålls vid 50 % DoD. Att lära sig de här tre faktorerna är det viktigaste du kan göra för att få maximal livslängd.",
    ],
  },
  {
    id: "laddning",
    icon: BatteryCharging,
    title: "Laddning — gör det rätt från början",
    body: [
      "Gel-batterier kräver en laddare med IU-karakteristik (konstantström följt av konstantspänning). Laddningsspänningen ska ligga på max 14,4 V för ett 12 V-batteri vid +20 °C, med temperaturkompensering på cirka -24 mV/°C. För hög spänning torkar ut gelen — för låg spänning leder till sulfatering.",
      "Ladda alltid batteriet så snart det går efter användning. Att låta ett urladdat gel-batteri stå oladdat i flera dagar är den vanligaste orsaken till för tidig död. Underhållsladdning (float) på ca 13,8 V är säkert att ha igång hela tiden när batteriet inte används.",
      "Använder du en bil-laddare för bilbatterier på ditt gel-batteri? Det är en av de snabbaste vägarna att förstöra ett dyrt batteri. Bilbatteriladdare ger ofta 14,8–15,5 V — det kokar bort gelen och batteriet är förstört på några månader.",
    ],
  },
  {
    id: "forvaring",
    icon: Snowflake,
    title: "Förvaring — viktigare än du tror",
    body: [
      "Förvaras batteriet under vintern? Ladda upp det helt först (100 %), koppla bort förbrukare och lagra svalt och torrt. Optimal förvaringstemperatur är 10–20 °C. För varmt accelererar självurladdning, för kallt påverkar inte cellerna men kondens kan bli ett problem.",
      "Ett fulladdat gel-batteri tappar cirka 2–3 % per månad i självurladdning vid 20 °C. Ladda underhåll en gång i månaden eller anslut en intelligent underhållsladdare. Att låta ett gel-batteri stå urladdat i 3–6 månader är ofta liktydigt med att slänga det.",
      "Förvara aldrig batterier direkt på betonggolv om det är fuktigt — använd en träpall eller skumplatta. Och håll dem upprätt, även om gel-batterier är läckagesäkra.",
    ],
  },
  {
    id: "misstag",
    icon: AlertTriangle,
    title: "5 vanliga misstag som dödar batteriet",
    list: [
      "Använda fel laddare (bilbatteri-laddare på gel = död batteri)",
      "Lämna batteriet urladdat över längre tid",
      "Djupurladda till under 10,5 V upprepade gånger",
      "Blanda gamla och nya batterier i samma bank",
      "Strunta i temperaturkompensering vid laddning",
    ],
  },
  {
    id: "checklista",
    icon: CheckCircle2,
    title: "Underhållschecklista",
    list: [
      "Visuell kontroll: leta efter sprickor, svullnad eller läckage",
      "Polskor: rengjorda, fettade och hårt åtdragna (inte galet)",
      "Spänningskontroll: 12,8–13,0 V vilospänning på fulladdat batteri",
      "Laddare: rätt profil och temperaturkompensering aktiv",
      "Anslutningar: inga oxiderade, lösa eller varma kablar",
      "Vid bank: balansera och mät varje cell minst en gång om året",
    ],
  },
  {
    id: "felsokning",
    icon: Wrench,
    title: "Snabb felsökning",
    body: [
      "Batteriet håller inte längre laddning? Mät vilospänningen efter 24 timmars vila. Under 12,4 V tyder på sulfatering eller cellfel. Mät också spänningen direkt under belastning — sjunker den snabbt under 11 V är batteriet sannolikt slut.",
      "Batteriet blir varmt under laddning? Sluta ladda omedelbart. Antingen är laddaren för aggressiv eller så är en cell internt kortsluten. Båda är farliga och behöver åtgärdas innan du fortsätter.",
      "Är du osäker — ring oss. Vi har hjälpt tusentals kunder felsöka batterier över telefon. Det kostar inget och vi säger ärligt om batteriet är värt att rädda eller om det är dags att byta.",
    ],
  },
]

export default function SkotselContent() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-[1200px] px-4 pb-10 pt-10 sm:px-6">
          <FadeIn>
            <div className="mb-2 text-xs font-bold uppercase tracking-widest text-amber-text">
              Guide
            </div>
            <h1 className="mb-3 max-w-3xl font-heading text-[clamp(28px,4vw,40px)] font-extrabold leading-[1.15] tracking-tight text-text-dark">
              Skötsel av batterier — så får du dubbla livslängden
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-text-mid">
              En gedigen guide till laddning, förvaring och underhåll av gel-,
              AGM- och blybatterier. Skriven av oss på Batteriproffs efter
              20+ år i branschen.
            </p>
          </FadeIn>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[220px_1fr]">
          {/* TOC */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <FadeIn>
              <div className="mb-3 text-xs font-bold uppercase tracking-wider text-text-light">
                Innehåll
              </div>
              <nav className="flex flex-col gap-1.5 border-l border-border pl-4">
                {TOC.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="text-sm text-text-mid transition-colors hover:text-navy"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </FadeIn>
          </aside>

          {/* Sections */}
          <article className="max-w-[760px] space-y-14">
            {SECTIONS.map((s, i) => (
              <FadeIn key={s.id} delay={i * 0.05}>
                <section id={s.id} className="scroll-mt-24">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy/5">
                      <s.icon className="h-5 w-5 text-navy" strokeWidth={2} />
                    </div>
                    <h2 className="font-heading text-[22px] font-extrabold leading-tight tracking-tight text-text-dark sm:text-2xl">
                      {s.title}
                    </h2>
                  </div>

                  {s.body && (
                    <div className="space-y-4">
                      {s.body.map((p, idx) => (
                        <p
                          key={idx}
                          className="text-[15.5px] leading-relaxed text-text-mid"
                        >
                          {p}
                        </p>
                      ))}
                    </div>
                  )}

                  {s.list && (
                    <ul className="space-y-2.5">
                      {s.list.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex gap-3 text-[15.5px] leading-relaxed text-text-mid"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </FadeIn>
            ))}

            {/* CTA */}
            <FadeIn delay={0.3}>
              <div className="rounded-2xl bg-navy p-8 sm:p-10">
                <HelpCircle
                  className="mb-4 h-8 w-8 text-amber-bg"
                  strokeWidth={1.5}
                />
                <h3 className="mb-2 font-heading text-xl font-extrabold text-white">
                  Osäker på vad ditt batteri behöver?
                </h3>
                <p className="mb-6 max-w-md text-sm leading-relaxed text-white/60">
                  Ring eller mejla oss med ditt användningsområde och nuvarande
                  setup. Vi ger dig ett rakt svar — utan säljsnack.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <a
                    href={`tel:${PHONE_LINK}`}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-bg px-6 py-3 text-sm font-bold text-navy transition-all hover:brightness-110"
                  >
                    Ring {PHONE}
                  </a>
                  <a
                    href={`mailto:${EMAIL}`}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-white/5"
                  >
                    Skicka mejl
                  </a>
                  <Link
                    href="/faq"
                    className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white/70 transition-all hover:text-white"
                  >
                    Se FAQ
                  </Link>
                </div>
              </div>
            </FadeIn>
          </article>
        </div>
      </div>
    </div>
  )
}
