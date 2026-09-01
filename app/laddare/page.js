import Link from "next/link"
import { ChevronRight, Zap, AlertTriangle, MessageCircle } from "lucide-react"
import { publicProducts } from "@/lib/products"
import { breadcrumbJsonLd, jsonLdProps } from "@/lib/schema"
import { SITE_URL, EMAIL } from "@/lib/constants"
import TopBar from "@/components/TopBar"
import Header from "@/components/Header"
import CtaBanner from "@/components/CtaBanner"
import Footer from "@/components/Footer"
import ChattKnapp from "@/components/ChattKnapp"

const title = "Laddare till traktionsbatteri och truckbatteri | Batteriproffs"
const description =
  "Vilken laddare passar ditt traktionsbatteri? Systemspänning, laddprofil och laddström förklarat, plus rätt laddare till varje batteri i vårt sortiment."

export const metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_URL}/laddare` },
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/laddare`,
    siteName: "Batteriproffs",
    locale: "sv_SE",
    type: "article",
  },
}

/** Grupperar sortimentet på systemspänning — det är så man väljer laddare. */
function perSpanning() {
  const grupper = {}
  for (const p of publicProducts) {
    if (!p.recommendedCharger) continue
    ;(grupper[p.voltage] ||= []).push(p)
  }
  return Object.entries(grupper).sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
}

export default function ChargerPage() {
  const grupper = perSpanning()

  return (
    <>
      <script
        {...jsonLdProps(
          breadcrumbJsonLd([
            { name: "Hem", path: "/" },
            { name: "Laddare", path: "/laddare" },
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
                <span className="text-text-dark">Laddare</span>
              </nav>

              <div className="mb-2 text-xs font-bold uppercase tracking-widest text-amber-text">
                Guide
              </div>
              <h1 className="mb-4 max-w-3xl font-heading text-[clamp(26px,4vw,38px)] font-extrabold leading-tight tracking-tight text-text-dark">
                Laddare till traktionsbatteri och truckbatteri
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-text-mid">
                Fel laddare är den vanligaste orsaken till att ett traktionsbatteri
                dör i förtid. Här är de tre sakerna som avgör vilken du behöver, och
                vilken laddare som passar varje batteri i vårt sortiment.
              </p>
            </div>
          </div>

          <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6">
            {/* Det som faktiskt avgör valet */}
            <h2 className="mb-6 font-heading text-xl font-bold text-text-dark">
              Tre saker avgör vilken laddare du behöver
            </h2>
            <div className="mb-12 grid gap-4 lg:grid-cols-3">
              {[
                {
                  n: "01",
                  t: "Systemspänningen",
                  d: "Räkna antalet batterier i maskinen och multiplicera med deras märkspänning. Fyra 6V-batterier i serie är ett 24V-system, sex 8V är 48V. Laddaren ska matcha systemet, inte det enskilda batteriet.",
                },
                {
                  n: "02",
                  t: "Laddprofilen",
                  d: "Gel, AGM och öppet blybatteri laddas med olika spänningskurvor. En laddare i fel läge kokar bort elektrolyten ur ett gelbatteri eller underladdar ett öppet. Kolla att laddaren har rätt profil.",
                },
                {
                  n: "03",
                  t: "Laddströmmen",
                  d: "Tumregeln är 10 till 20 procent av batteriets kapacitet i ampere. Ett 240 Ah-batteri vill ha 24 till 48 A. För låg ström hinner inte ladda färdigt över natten, för hög sliter på cellerna.",
                },
              ].map((x) => (
                <div key={x.n} className="rounded-2xl border border-border bg-surface p-6">
                  <div className="mb-2 font-heading text-2xl font-extrabold text-amber-text">
                    {x.n}
                  </div>
                  <div className="mb-2 font-heading text-base font-bold text-text-dark">
                    {x.t}
                  </div>
                  <p className="text-sm leading-relaxed text-text-mid">{x.d}</p>
                </div>
              ))}
            </div>

            {/* Varning — det här kostar kunder pengar varje år */}
            <div className="mb-12 flex gap-4 rounded-2xl border border-amber/30 bg-amber/5 p-6">
              <AlertTriangle size={22} className="mt-0.5 flex-shrink-0 text-amber-text" aria-hidden="true" />
              <div>
                <div className="mb-1 font-heading text-base font-bold text-text-dark">
                  Ladda aldrig ett gelbatteri på blyprofil
                </div>
                <p className="text-sm leading-relaxed text-text-mid">
                  Ett gelbatteri är slutet och kan inte fyllas på. Laddas det med för
                  hög spänning gasar det bort elektrolyt som aldrig kommer tillbaka, och
                  kapaciteten sjunker permanent. Det är den enskilt vanligaste orsaken
                  till att ett dyrt gelbatteri håller tre år i stället för åtta.
                </p>
              </div>
            </div>

            {/* Rätt laddare per batteri — hämtat ur produktdatan */}
            <h2 className="mb-2 font-heading text-xl font-bold text-text-dark">
              Rätt laddare till varje batteri i sortimentet
            </h2>
            <p className="mb-6 max-w-2xl text-sm leading-relaxed text-text-mid">
              Rekommendationerna nedan utgår från batteriets kemi och vanligaste
              systemuppbyggnad. Har du en annan konfiguration, hör av dig så räknar vi
              på just din uppsättning.
            </p>

            <div className="space-y-8">
              {grupper.map(([spanning, produkter]) => (
                <div key={spanning}>
                  <h3 className="mb-3 flex items-center gap-2 font-heading text-base font-bold text-text-dark">
                    <Zap size={16} className="text-amber-text" aria-hidden="true" />
                    {spanning}-batterier
                  </h3>
                  <div className="overflow-hidden rounded-xl border border-border">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-surface">
                          <th className="px-5 py-3 text-left font-semibold text-text-dark">Batteri</th>
                          <th className="px-5 py-3 text-left font-semibold text-text-dark">Typ</th>
                          <th className="px-5 py-3 text-left font-semibold text-text-dark">Rekommenderad laddare</th>
                        </tr>
                      </thead>
                      <tbody>
                        {produkter.map((p, i) => (
                          <tr key={p.slug} className={i % 2 ? "bg-surface/40" : "bg-white"}>
                            <td className="px-5 py-3 align-top">
                              <Link href={`/produkt/${p.slug}`} className="font-medium text-navy hover:underline">
                                {p.shortName}
                              </Link>
                            </td>
                            <td className="px-5 py-3 align-top text-text-mid">
                              {p.specs?.["Typ"]?.split(",")[0] || "—"}
                            </td>
                            <td className="px-5 py-3 align-top text-text-mid">
                              {p.recommendedCharger}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA — vi säljer inte laddare i webbshoppen, men vi tar fram rätt */}
            <div className="mt-12 rounded-2xl border border-border bg-navy p-8">
              <h2 className="mb-3 font-heading text-xl font-bold text-white">
                Behöver du laddaren också?
              </h2>
              <p className="mb-6 max-w-2xl text-[15px] leading-relaxed text-white/75">
                Laddare ligger inte i webbshoppen ännu, men vi tar fram rätt modell till
                din uppsättning och skickar den tillsammans med batterierna. Uppge
                systemspänning och batterityp så återkommer vi med pris.
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
