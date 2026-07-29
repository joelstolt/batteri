import Link from "next/link"
import { breadcrumbJsonLd, faqJsonLd, jsonLdProps } from "@/lib/schema"
import { pageMeta } from "@/lib/seo"
import { PHONE, PHONE_LINK, EMAIL } from "@/lib/constants"
import { replacements } from "@/lib/replacements"
import TopBar from "@/components/TopBar"
import Header from "@/components/Header"
import BatteryFinder from "@/components/BatteryFinder"
import CtaBanner from "@/components/CtaBanner"
import Footer from "@/components/Footer"

/**
 * "Vilket batteri har jag?"
 *
 * Batterifinnaren fanns bara som sektion på startsidan. Frågan är hela
 * köpresans startpunkt för den här målgruppen — man vet vilken maskin man har,
 * inte vilket batteri som sitter i — och den förtjänar en egen URL som kan
 * rankas och länkas till från kundtjänst.
 */
export const metadata = pageMeta({
  path: "/vilket-batteri",
  title: "Vilket batteri har jag? Så tar du reda på rätt batteri | Batteriproffs",
  description:
    "Vet du inte vilket batteri din maskin har? Läs av typskylten, mät utrymmet eller sök på maskinmodell. Vi hjälper dig hitta rätt batteri.",
})

const FRAGOR = [
  {
    q: "Var hittar jag batteriets uppgifter?",
    a: "På batteriets ovansida eller långsida sitter en etikett med spänning i volt, kapacitet i amperetimmar och ett artikelnummer. Fotografera den. Sitter batteriet monterat räcker det oftast att fotografera ovansidan.",
  },
  {
    q: "Vad gör jag om etiketten är oläslig?",
    a: "Mät batteriet i stället: längd, bredd och höjd inklusive poler, i millimeter. Räkna också antalet batterier och hur de är kopplade. Med måtten och maskinens fabrikat och modell hittar vi rätt.",
  },
  {
    q: "Hur vet jag vilken spänning systemet har?",
    a: "Titta på maskinens typskylt, den sitter oftast vid förarplatsen eller i batteriutrymmet. Står det 24V och du har fyra batterier är de sannolikt 6V kopplade i serie. 24V med två batterier betyder 12V-batterier.",
  },
  {
    q: "Måste det nya batteriet ha exakt samma mått?",
    a: "Det får inte vara större än utrymmet, och polerna måste sitta så att kablarna når. Ett batteri som är något lägre går oftast bra, men kontrollera att fästet eller spännbandet fortfarande håller det på plats.",
  },
  {
    q: "Kan jag byta till ett batteri med högre kapacitet?",
    a: "Ofta ja, om måtten stämmer. Högre amperetimmar ger längre driftstid. Kontrollera att laddaren klarar den högre kapaciteten, annars blir laddtiden lång.",
  },
]

const STEG = [
  {
    n: "1",
    titel: "Läs av batteriet",
    text: "Fotografera etiketten på batteriet som sitter i nu. Där står spänning, kapacitet och artikelnummer. Det är den snabbaste vägen till rätt svar.",
  },
  {
    n: "2",
    titel: "Läs av maskinen",
    text: "Notera fabrikat och modell från typskylten, plus systemets spänning. Har du en Nilfisk SC401 eller en Hako Scrubmaster vet vi direkt vad som passar.",
  },
  {
    n: "3",
    titel: "Mät utrymmet",
    text: "Längd, bredd och höjd i millimeter, plus hur många batterier som får plats. Behövs bara om etiketten är oläslig eller batteriet saknas.",
  },
]

export default function VilketBatteriPage() {
  return (
    <>
      <script {...jsonLdProps(faqJsonLd(FRAGOR))} />
      <script
        {...jsonLdProps(
          breadcrumbJsonLd([
            { name: "Hem", path: "/" },
            { name: "Vilket batteri har jag?", path: "/vilket-batteri" },
          ])
        )}
      />
      <TopBar />
      <Header />
      <main id="innehall">
        <section className="mx-auto max-w-2xl px-5 pt-12 sm:pt-16">
          <h1 className="font-heading text-3xl font-bold leading-tight text-navy sm:text-4xl">
            Vilket batteri har jag?
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-text-mid">
            De flesta vet vilken maskin de har, inte vilket batteri som sitter i den.
            Här är tre sätt att ta reda på det, i tur och ordning efter hur snabbt de
            går.
          </p>

          <div className="mt-8 space-y-4">
            {STEG.map((s) => (
              <div key={s.n} className="flex gap-4 rounded-xl border border-border bg-white p-5">
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-bg font-heading text-sm font-bold text-navy"
                >
                  {s.n}
                </span>
                <div>
                  <h2 className="font-heading font-bold text-navy">{s.titel}</h2>
                  <p className="mt-1.5 leading-relaxed text-text-mid">{s.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-border bg-surface/60 p-6">
            <h2 className="font-heading text-lg font-bold text-navy">
              Snabbaste vägen: ring oss
            </h2>
            <p className="mt-2 leading-relaxed text-text-mid">
              Har du uppgifterna framför dig tar det en minut i telefon. Vi svarar
              själva, ingen växel och ingen chattbot.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={`tel:${PHONE_LINK}`}
                className="rounded-lg bg-navy px-5 py-2.5 font-heading text-sm font-bold text-white"
              >
                Ring {PHONE}
              </a>
              <a
                href={`mailto:${EMAIL}`}
                className="rounded-lg border border-border bg-white px-5 py-2.5 font-heading text-sm font-bold text-navy"
              >
                Mejla bild på etiketten
              </a>
            </div>
          </div>
        </section>

        <BatteryFinder />

        <section className="mx-auto max-w-2xl px-5 py-12">
          <h2 className="font-heading text-2xl font-bold text-navy">
            Vet du vilken maskin du har?
          </h2>
          <p className="mt-3 leading-relaxed text-text-dark">
            Vi har färdiga sidor för trettio vanliga maskiner, med exakt vilket
            batteri som passar och hur många som behövs.
          </p>
          <Link
            href="/batteri-till"
            className="mt-4 inline-block rounded-lg bg-navy px-5 py-2.5 font-heading text-sm font-bold text-white"
          >
            Se alla maskiner
          </Link>

          {replacements.length > 0 && (
            <>
              <h2 className="mt-10 font-heading text-2xl font-bold text-navy">
                Vet du artikelnumret?
              </h2>
              <p className="mt-3 leading-relaxed text-text-dark">
                Har du numret på batteriet som sitter i nu, se vad vi ersätter det med.
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {replacements.map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={`/ersatter/${r.slug}`}
                      className="inline-block rounded-lg border border-border bg-white px-4 py-2 text-sm font-semibold text-navy hover:border-border-dark"
                    >
                      {r.original}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}

          <h2 className="mt-12 font-heading text-2xl font-bold text-navy">
            Vanliga frågor
          </h2>
          <dl className="mt-5 space-y-5">
            {FRAGOR.map((f) => (
              <div key={f.q}>
                <dt className="font-heading font-bold text-navy">{f.q}</dt>
                <dd className="mt-1.5 leading-relaxed text-text-dark">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>
        <CtaBanner />
      </main>
      <Footer />
    </>
  )
}
