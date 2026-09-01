import Link from "next/link"
import { ChevronRight, Droplets, AlertTriangle, MessageCircle } from "lucide-react"
import { publicProducts } from "@/lib/products"
import { breadcrumbJsonLd, jsonLdProps } from "@/lib/schema"
import { SITE_URL, EMAIL } from "@/lib/constants"
import TopBar from "@/components/TopBar"
import Header from "@/components/Header"
import CtaBanner from "@/components/CtaBanner"
import Footer from "@/components/Footer"
import ChattKnapp from "@/components/ChattKnapp"

const title = "Batterivatten — påfyllning av öppna traktionsbatterier | Batteriproffs"
const description =
  "Vilka batterier behöver batterivatten, hur ofta och hur mycket? Guide till vattenpåfyllning av öppna blybatterier, och varför det måste vara destillerat."

export const metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_URL}/batterivatten` },
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/batterivatten`,
    siteName: "Batteriproffs",
    locale: "sv_SE",
    type: "article",
  },
}

/** Bara öppna, fritt ventilerade blybatterier ska vattenfyllas. */
const oppna = publicProducts.filter((p) => /öppet|ventilerat/i.test(p.specs?.["Typ"] || ""))
const slutna = publicProducts.filter((p) => /gel|dry ?cell|vrla|agm/i.test(p.specs?.["Typ"] || ""))

export default function BatteryWaterPage() {
  return (
    <>
      <script
        {...jsonLdProps(
          breadcrumbJsonLd([
            { name: "Hem", path: "/" },
            { name: "Batterivatten", path: "/batterivatten" },
          ])
        )}
      />
      <TopBar />
      <Header />

      <main id="innehall">
        <div className="bg-white">
          <div className="border-b border-border bg-surface">
            <div className="mx-auto max-w-[1200px] px-4 pb-10 pt-8 sm:px-6">
              <nav className="mb-5 flex items-center gap-1.5 text-xs text-text-mid">
                <Link href="/" className="hover:text-text-dark">Hem</Link>
                <ChevronRight size={13} className="text-text-light" />
                <span className="text-text-dark">Batterivatten</span>
              </nav>

              <div className="mb-2 text-xs font-bold uppercase tracking-widest text-amber-text">
                Guide
              </div>
              <h1 className="mb-4 max-w-3xl font-heading text-[clamp(26px,4vw,38px)] font-extrabold leading-tight tracking-tight text-text-dark">
                Batterivatten och påfyllning
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-text-mid">
                Ett öppet traktionsbatteri förlorar vatten varje gång det laddas. Fylls
                det inte på torrläggs plattornas ovankant, och den skadan går inte att
                reparera. Här är vad som gäller, hur ofta, och vilka av era batterier
                det berör.
              </p>
            </div>
          </div>

          <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6">
            {/* Vilka batterier det gäller — hämtat ur produktdatan */}
            <div className="mb-12 grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-amber/30 bg-amber/5 p-6">
                <div className="mb-3 flex items-center gap-2">
                  <Droplets size={19} className="text-amber-text" aria-hidden="true" />
                  <h2 className="font-heading text-base font-bold text-text-dark">
                    Ska vattenfyllas
                  </h2>
                </div>
                <p className="mb-4 text-sm leading-relaxed text-text-mid">
                  Öppna, fritt ventilerade blybatterier. De har avtagbara celllock och
                  förlorar vatten genom gasning vid varje laddning.
                </p>
                <ul className="space-y-1.5 text-sm">
                  {oppna.map((p) => (
                    <li key={p.slug}>
                      <Link href={`/produkt/${p.slug}`} className="font-medium text-navy hover:underline">
                        {p.shortName}
                      </Link>
                      <span className="ml-2 text-text-mid">{p.voltage} {p.capacity}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-border bg-surface p-6">
                <div className="mb-3 flex items-center gap-2">
                  <AlertTriangle size={19} className="text-text-mid" aria-hidden="true" />
                  <h2 className="font-heading text-base font-bold text-text-dark">
                    Ska ALDRIG öppnas
                  </h2>
                </div>
                <p className="mb-4 text-sm leading-relaxed text-text-mid">
                  Gel- och AGM-batterier är förseglade. De har ingen vätska att fylla på,
                  och bryter du upp ventilerna förstör du batteriet direkt.
                </p>
                <div className="text-sm text-text-mid">
                  {slutna.length} av {publicProducts.length} batterier i vårt sortiment är
                  av den här typen, bland annat hela Sonnenschein-serien och Dry
                  Cell-batterierna.
                </div>
              </div>
            </div>

            {/* Praktiken */}
            <h2 className="mb-6 font-heading text-xl font-bold text-text-dark">
              Så gör du
            </h2>
            <div className="mb-12 space-y-4">
              {[
                {
                  t: "Fyll alltid EFTER laddning, aldrig före",
                  d: "Elektrolyten stiger under laddning. Fyller du på ett urladdat batteri svämmar det över när det laddas, och du får ut syra på golvet och tappar kapacitet.",
                },
                {
                  t: "Bara destillerat eller avjoniserat vatten",
                  d: "Kranvatten innehåller kalk och mineraler som lägger sig på plattorna och sänker kapaciteten permanent. Det är den vanligaste och dyraste genvägen i branschen.",
                },
                {
                  t: "Till markeringen, inte till kanten",
                  d: "Vätskan ska stå cirka 10 till 15 mm över plattorna, eller till nivåmarkeringen om cellen har en. Överfyllt batteri gasar ut syra vid nästa laddning.",
                },
                {
                  t: "Kontrollera var fjärde till sjätte vecka",
                  d: "Vid daglig drift i skift kan det behövas varannan vecka. Ett batteri som plötsligt drar mycket mer vatten än vanligt är på väg att bli överladdat — kontrollera laddaren.",
                },
              ].map((x, i) => (
                <div key={x.t} className="flex gap-4 rounded-xl border border-border bg-surface p-5">
                  <div className="font-heading text-lg font-extrabold text-amber-text">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <div className="mb-1 font-heading text-[15px] font-bold text-text-dark">
                      {x.t}
                    </div>
                    <p className="text-sm leading-relaxed text-text-mid">{x.d}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-12 rounded-2xl border border-border bg-surface p-6">
              <h2 className="mb-2 font-heading text-base font-bold text-text-dark">
                Hur mycket går det åt?
              </h2>
              <p className="text-sm leading-relaxed text-text-mid">
                En tumregel för traktionsbatterier i daglig drift är ungefär en halv till
                en liter per battericell och år. Ett 24V-system med fyra 6V-batterier
                landar alltså runt tio till tjugo liter om året. Har ni flera maskiner
                lönar det sig att köpa dunk i stället för flaska.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-navy p-8">
              <h2 className="mb-3 font-heading text-xl font-bold text-white">
                Behöver ni batterivatten?
              </h2>
              <p className="mb-6 max-w-2xl text-[15px] leading-relaxed text-white/75">
                Vi levererar destillerat batterivatten i dunk tillsammans med
                batteribeställningar, och separat till er som redan har våra batterier.
                Hör av dig med antal maskiner så räknar vi på hur mycket ni gör av med.
              </p>
              <div className="flex flex-wrap gap-3">
                <ChattKnapp
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-bg px-6 py-3.5 font-heading text-sm font-bold text-navy transition-transform hover:-translate-y-px"
                >
                  <MessageCircle size={16} aria-hidden="true" />
                  Chatta med oss
                </ChattKnapp>
                <a
                  href={`mailto:${EMAIL}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-6 py-3.5 font-heading text-sm font-bold text-white transition-colors hover:bg-white/10"
                >
                  Mejla oss
                </a>
              </div>
            </div>
          </div>
        </div>

        <CtaBanner />
      </main>
      <Footer />
    </>
  )
}
