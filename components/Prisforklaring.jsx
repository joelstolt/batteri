import Link from "next/link"
import ChattKnapp from "@/components/ChattKnapp"

/**
 * Varför priset är hälften mot marknaden.
 *
 * Den viktigaste förtroendetexten på sajten. En inköpare som ser 2 195 kr mot
 * Batteriexpressens 4 728 kr tänker inte "vilket fynd" utan "vad är det för fel
 * på det". Omdömen svarar inte på den frågan, för misstanken är strukturell.
 *
 * Fyra skäl, alla sanna och bekräftade av Joel:
 *  1. Det ÄR inte Trojan. Likvärdiga batterier från Nordmax, Discover och
 *     Sonnenschein. Största enskilda posten, och den är verifierbar ur
 *     produktdatan.
 *  2. Över tjugo års relation med samma leverantör ger inköpspriset.
 *  3. Ingen fysisk försäljning.
 *  4. Ny aktör som tar tunnare marginal för att synas.
 *
 * Att skriva ut punkt 1 skyddar dessutom mot tvister: en kund som trodde att
 * hon köpte Trojan och får Nordmax är ett problem. En kund som visste att hon
 * köpte en likvärdig produkt är en nöjd kund.
 *
 * Serverkomponent. Ren text, ingen interaktivitet, noll klient-JS.
 */

const SKAL = [
  {
    rubrik: "Det är inte ett Trojan",
    text: "Vi säljer likvärdiga batterier från Nordmax, Discover och Sonnenschein. Samma mått, samma spänning, samma kapacitet, byggda för samma användning. Trojan är ett amerikanskt varumärke med lång historia i branschen, och en stor del av prisskillnaden är det namnet snarare än batteriet.",
  },
  {
    rubrik: "Vi har köpt från samma leverantör i över tjugo år",
    text: "Den relationen ger inköpspriser som en ny aktör inte kommer i närheten av. Vi låter skillnaden gå vidare till dig i stället för att lägga den på marginalen.",
  },
  {
    rubrik: "Vi säljer bara på nätet",
    text: "Ingen butikslokal, inga säljare ute på vägarna. Det är kostnader som annars hamnar i priset på batteriet.",
  },
  {
    rubrik: "Vi är nya och vill bli hittade",
    text: "Vi nöjer oss med mindre per batteri för att fler ska upptäcka oss. Det är ett medvetet val, inte ett tecken på att något är fel med produkten.",
  },
]

/** Kort version, för produktsidan där tvivlet uppstår. */
export function PrisforklaringKort() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-8" aria-labelledby="varfor-billigt">
      <div className="rounded-2xl border border-border bg-surface/60 p-6">
        <h2 id="varfor-billigt" className="font-heading text-lg font-bold text-navy">
          Varför är det billigare än Trojan?
        </h2>
        <p className="mt-2.5 leading-relaxed text-text-dark">
          För att det inte är ett Trojan. Det här är ett likvärdigt batteri med samma
          mått, spänning och kapacitet, byggt för samma användning. Trojan är ett
          amerikanskt premiumvarumärke och en stor del av prisskillnaden är namnet,
          inte batteriet.
        </p>
        <p className="mt-2.5 leading-relaxed text-text-dark">
          Passar det inte i din maskin byter vi det utan returavdrag, så länge
          förpackningen är obruten och du hör av dig inom 14 dagar.
        </p>
        <p className="mt-3.5 text-sm">
          <Link href="/om-oss" className="font-heading font-bold text-accent hover:underline">
            Hela förklaringen till våra priser →
          </Link>
        </p>
      </div>
    </section>
  )
}

/** Full version, för startsidan och om-oss. */
export default function Prisforklaring() {
  return (
    <section className="bg-surface/60 py-14 sm:py-16" aria-labelledby="prisforklaring">
      <div className="mx-auto max-w-3xl px-5">
        <h2
          id="prisforklaring"
          className="font-heading text-2xl font-bold text-navy sm:text-3xl"
        >
          Varför våra priser ser för bra ut
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-text-mid">
          Ett Trojan T-105 kostar runt 4 700 kr hos de flesta svenska återförsäljare.
          Vår motsvarighet kostar 2 195 kr. Det är en tillräckligt stor skillnad för
          att man ska undra var haken sitter, så vi förklarar den.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {SKAL.map((s) => (
            <div key={s.rubrik} className="rounded-xl border border-border bg-white p-5">
              <h3 className="font-heading font-bold text-navy">{s.rubrik}</h3>
              <p className="mt-1.5 leading-relaxed text-text-mid">{s.text}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 leading-relaxed text-text-dark">
          Vad du får är ett batteri som passar i samma utrymme, i samma maskin, med
          samma spänning och kapacitet, till ungefär halva priset. Vad du inte får är
          namnet Trojan på etiketten. Tycker du att namnet är värt mellanskillnaden ska
          du köpa Trojan.
        </p>
        <p className="mt-3 leading-relaxed text-text-dark">
          Är du osäker på om ett likvärdigt batteri passar just din maskin, chatta med oss med
          maskinens fabrikat och modell. Vi svarar själva.
        </p>

        <ChattKnapp
          className="mt-6 inline-block rounded-lg bg-navy px-5 py-2.5 font-heading text-sm font-bold text-white"
        >
          Chatta med oss
        </ChattKnapp>
      </div>
    </section>
  )
}
