import Link from "next/link"
import { breadcrumbJsonLd, jsonLdProps } from "@/lib/schema"
import { pageMeta } from "@/lib/seo"
import { EMAIL } from "@/lib/constants"
import TopBar from "@/components/TopBar"
import Header from "@/components/Header"
import CtaBanner from "@/components/CtaBanner"
import Footer from "@/components/Footer"
import ChattKnapp from "@/components/ChattKnapp"

/**
 * Gratis återvinning.
 *
 * Konkurrentanalysen visade att branschen inte bygger förtroende på omdömen —
 * ingen av sex B2B-aktörer visar några — utan på garantier, certifieringar och
 * just återvinning. Både Midac och Batteriexpressen gör en poäng av den. Det
 * här är den signalen, och den kostar ingenting eftersom tjänsten redan finns.
 *
 * OBS: logistiken är medvetet öppet formulerad. Joel har bekräftat att
 * återvinningen är gratis, men inte vem som står för frakten eller om batteriet
 * hämtas eller lämnas. Skriv aldrig in ett hämtningslöfte här utan att det är
 * bekräftat — det är ett leveranslöfte i förklädnad.
 */
export const metadata = pageMeta({
  path: "/atervinning",
  title: "Gratis återvinning av gamla batterier | Batteriproffs",
  description:
    "Vi tar hand om ditt uttjänta blybatteri utan kostnad. Blybatterier är miljöfarligt avfall men går att återvinna nästan i sin helhet. Så går det till.",
})

const STEG = [
  {
    n: "1",
    titel: "Säg till när du beställer",
    text: "Chatta eller mejla oss i samband med din order och berätta hur många gamla batterier du har och var de står. Har du redan beställt går det bra att höra av sig i efterhand.",
  },
  {
    n: "2",
    titel: "Vi bestämmer upplägget",
    text: "Beroende på var du finns och hur många batterier det gäller kommer vi överens om hur de tas om hand. Vi återkommer med besked.",
  },
  {
    n: "3",
    titel: "Batteriet går till materialåtervinning",
    text: "Bly, plast och syra separeras och återförs i produktion. Ett blybatteri är en av de mest återvunna produkterna som finns.",
  },
]

export default function AtervinningPage() {
  return (
    <>
      <script
        {...jsonLdProps(
          breadcrumbJsonLd([
            { name: "Hem", path: "/" },
            { name: "Återvinning", path: "/atervinning" },
          ])
        )}
      />
      <TopBar />
      <Header />
      <main id="innehall">
        <section className="mx-auto max-w-2xl px-5 py-12 sm:py-16">
          <h1 className="font-heading text-3xl font-bold leading-tight text-navy sm:text-4xl">
            Vi tar hand om ditt gamla batteri, utan kostnad
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-text-mid">
            Blybatterier är klassade som miljöfarligt avfall och får inte slängas som
            vanligt avfall. De är samtidigt nästan helt återvinningsbara. Köper du ett
            nytt batteri av oss återvinner vi det gamla gratis.
          </p>

          <div className="mt-10 space-y-4">
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

          <section className="mt-12">
            <h2 className="font-heading text-xl font-bold text-navy">
              Varför det spelar roll
            </h2>
            <p className="mt-3 leading-relaxed text-text-dark">
              Ett uttjänt blybatteri innehåller bly och svavelsyra. Hamnar det på fel
              ställe läcker båda ut. Går det till återvinning separeras materialen och
              används i nya batterier. Blyet kan återvinnas om och om igen utan att
              tappa kvalitet.
            </p>
            <p className="mt-3 leading-relaxed text-text-dark">
              Som företag har ni dessutom ett ansvar för att farligt avfall hanteras
              och dokumenteras rätt. Att lämna batteriet till oss är enklare än att
              lösa det själv.
            </p>
          </section>

          <aside className="mt-12 rounded-2xl border border-border bg-surface/60 p-6">
            <h2 className="font-heading text-lg font-bold text-navy">Hör av dig</h2>
            <p className="mt-2 leading-relaxed text-text-mid">
              Berätta hur många batterier det gäller och var de står, så återkommer vi
              med hur vi tar hand om dem.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <ChattKnapp
                className="rounded-lg bg-navy px-5 py-2.5 font-heading text-sm font-bold text-white"
              >
                Chatta med oss
              </ChattKnapp>
              <a
                href={`mailto:${EMAIL}`}
                className="rounded-lg border border-border bg-white px-5 py-2.5 font-heading text-sm font-bold text-navy"
              >
                Mejla oss
              </a>
            </div>
          </aside>

          <p className="mt-8 text-sm text-text-light">
            Läs mer om{" "}
            <Link href="/skotsel" className="font-semibold text-accent hover:underline">
              skötsel som förlänger batteriets liv
            </Link>{" "}
            eller i vår{" "}
            <Link href="/kunskap" className="font-semibold text-accent hover:underline">
              kunskapsbank
            </Link>
            .
          </p>
        </section>
        <CtaBanner />
      </main>
      <Footer />
    </>
  )
}
