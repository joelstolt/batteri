import TopBar from "@/components/TopBar"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export const metadata = {
  alternates: { canonical: "https://www.batteriproffs.se/villkor" },
  title: "Köpvillkor & Leveransvillkor — Batteriproffs",
  description:
    "Villkor för beställning, leverans, betalning, retur och reklamation hos Batteriproffs. Försäljning till företag.",
}

// Ankare per sektion så USP-raden och andra länkar kan peka rakt på t.ex.
// #3-frakt-och-leverans. scroll-mt lämnar plats för den fasta headern.
function ankare(title) {
  return title
    .toLowerCase()
    .replace(/[åä]/g, "a")
    .replace(/ö/g, "o")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function Section({ title, children }) {
  return (
    <section id={ankare(title)} className="scroll-mt-32">
      <h2 className="mb-3 font-heading text-xl font-bold text-text-dark">{title}</h2>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  )
}

export default function VillkorPage() {
  return (
    <>
      <TopBar />
      <Header />
      <main id="innehall">        <div className="bg-white">
          <div className="border-b border-border bg-surface">
            <div className="mx-auto max-w-[800px] px-4 pb-8 pt-10 sm:px-6">
              <div className="mb-2 text-xs font-bold uppercase tracking-widest text-amber-text">
                Villkor
              </div>
              <h1 className="font-heading text-3xl font-extrabold text-text-dark sm:text-4xl">
                Köpvillkor &amp; Leveransvillkor
              </h1>
              <p className="mt-3 text-sm text-text-mid">
                Senast uppdaterad: augusti 2026
              </p>
            </div>
          </div>

          <div className="mx-auto max-w-[800px] px-4 py-10 text-base leading-relaxed text-text-mid sm:px-6">
            <div className="flex flex-col gap-10">
              <Section title="Allmänt">
                <p>
                  Dessa villkor gäller för alla beställningar som görs på{" "}
                  <strong>batteriproffs.se</strong>. Webbutiken säljer{" "}
                  <strong>till företag</strong>: kassan kräver ett giltigt
                  organisationsnummer och köpet sker i din näringsverksamhet. På sådana
                  köp gäller köplagen (1990:931), som är dispositiv. Det som står här
                  gäller alltså framför lagens utfyllande regler, om inte annat har
                  avtalats skriftligt.
                </p>
                <p>
                  Skulle ett köp ändå komma till stånd med dig som konsument, till
                  exempel efter en överenskommelse per telefon, gäller konsumentköplagen
                  och distansavtalslagen. De reglerna är tvingande och tar då över de
                  villkor nedan som säger något annat.
                </p>
                <p>
                  Säljare och din avtalspart är Joel Stolt (enskild firma), org.nr
                  901108-0851, momsreg.nr SE901108085101, Väringavägen 10, 281 42
                  Hässleholm. Godkänd för F-skatt. Batterierna levereras i vissa fall
                  direkt från vår leverantör, men avtalet har du alltid med oss och det
                  är hit du vänder dig i alla frågor om din order.
                  Vid frågor om en order, retur eller reklamation når du oss enklast via:
                </p>
                <ul className="ml-5 list-disc space-y-1">
                  <li>E-post: <a className="text-navy underline" href="mailto:info@batteriproffs.se">info@batteriproffs.se</a></li>
                  <li>Telefon: <a className="text-navy underline" href="tel:+46766867752">076-686 77 52</a></li>
                  <li>Öppettider: Måndag–fredag 08:00–17:00</li>
                </ul>
              </Section>

              <Section title="1. Priser, erbjudanden och produktinformation">
                <p>
                  Samtliga priser anges i svenska kronor (SEK) inklusive 25 % moms och
                  eventuell miljöavgift. Kampanjer och tidsbegränsade erbjudanden gäller
                  så länge lagret räcker, om inget annat framgår direkt vid produkten.
                </p>
                <p>
                  Vi förbehåller oss rätten att justera priser, sortiment och kampanjer
                  löpande utan föregående meddelande. Måttuppgifter och tekniska
                  specifikationer är vägledande och kan avvika något från produktens
                  fysiska utförande. Skulle ett uppenbart pris- eller skrivfel ha smugit
                  sig in är vi inte bundna av en beställning som baseras på felet, om
                  kunden insett eller borde ha insett att uppgiften inte stämde.
                </p>
                <p>
                  <strong>Produktbilder:</strong> Vissa bilder används i illustrativt
                  syfte och kan vara framställda med hjälp av AI eller bildbanksmaterial.
                  Bilderna är vägledande och kan skilja sig från produktens faktiska
                  utseende, färg eller mått.
                </p>
              </Section>

              <Section title="2. Beställning">
                <p>
                  Du lägger en order genom att fullfölja köpflödet i kassan och bekräfta
                  betalningen. När du klickat på betalningsknappen är beställningen
                  bindande och du blir betalningsskyldig.
                </p>
                <p>
                  En orderbekräftelse skickas direkt till den e-postadress du angett —
                  spara den, där finns informationen du behöver vid eventuella ärenden.
                </p>
                <p>
                  <strong>Ändring eller avbokning:</strong> Vill du justera eller avboka
                  din order? Hör av dig på{" "}
                  <a className="text-navy underline" href="mailto:info@batteriproffs.se">info@batteriproffs.se</a>{" "}
                  eller{" "}
                  <a className="text-navy underline" href="tel:+46766867752">076-686 77 52</a>{" "}
                  så snart som möjligt. Ändringar kan göras fram till dess att ordern
                  tagits ut för packning.
                </p>
              </Section>

              <Section title="3. Frakt och leverans">
                <p>
                  Beställningar skickas med PostNord, i de flesta fall direkt från vår
                  leverantör. Order som läggs på vardagar före kl 14:00 skickas normalt
                  samma dag och är vanligtvis framme inom 1–3 arbetsdagar i hela Sverige.
                  Leveranstiden är en uppskattning och ingen garanti — vid restnotering,
                  pallbokning eller hög belastning hos transportören kan det ta längre.
                  Blir din order försenad hör vi av oss.
                </p>
                <p>
                  <strong>Fraktkostnad:</strong> 695 kr inkl. moms per försändelse i
                  hela Sverige. För särskilt tunga eller skrymmande artiklar (t.ex.
                  produkter klassade som farligt gods eller som inte kan hanteras
                  manuellt) kan en högre frakt tillämpas — det framgår alltid innan du
                  slutför köpet.
                </p>
                <p>
                  Stämmer inte innehållet i leveransen med orderbekräftelsen, eller är
                  paketet synbart skadat vid mottagandet, kontaktar du oss på{" "}
                  <a className="text-navy underline" href="mailto:info@batteriproffs.se">info@batteriproffs.se</a>{" "}
                  snarast så ordnar vi en lösning utan extra kostnad för dig.
                </p>
                <p>
                  Vi ansvarar för försändelsen tills den är fysiskt mottagen av dig. Vid
                  förseningar utanför vår kontroll (force majeure) friskriver vi oss
                  från skadeståndsansvar, men håller dig informerad. Vid väsentliga
                  förseningar har du rätt att häva köpet utan kostnad. Leverans sker
                  under alla förhållanden senast 30 dagar efter beställningen.
                </p>
                <p>
                  <strong>Outhämtade paket:</strong> Om du inte hämtar ut ditt paket
                  skickas det tillbaka till oss och du debiteras{" "}
                  <strong>349 kr</strong> för returfrakt och hantering, som dras av vid
                  eventuell återbetalning. Batterier väger mellan 19 och 63 kg och en
                  outhämtad försändelse innebär frakt i båda riktningarna, vilket är
                  skälet till avgiften. Att låta bli att hämta ut paketet räknas inte
                  som en retur och befriar dig inte från betalningsskyldigheten. Kan du
                  inte ta emot leveransen, hör av dig i förväg så bokar vi om utan
                  kostnad.
                </p>
              </Section>

              <Section title="4. Betalning">
                <p>
                  Hos Batteriproffs betalar du säkert med kort (Visa eller Mastercard).
                  Kortbetalningen hanteras krypterat av Stripe, en PCI&nbsp;DSS Level
                  1-certifierad betalpartner. Vi lagrar aldrig dina kortuppgifter.
                </p>
                <p>
                  <strong>Beloppet reserveras när du genomför köpet och dras först
                  när batteriet skickas.</strong> Du betalar alltså för en vara som är
                  på väg, inte för ett löfte. Kan vi mot förmodan inte leverera din
                  order släpps reservationen och du har aldrig blivit debiterad.
                </p>
              </Section>

              <Section title="5. Retur">
                <p>
                  Vid köp i näringsverksamhet finns ingen ångerrätt. Den rätten följer av
                  distansavtalslagen och gäller bara konsumenter. Vi tar ändå emot
                  returer enligt villkoren nedan, som en service och inte som en
                  skyldighet.
                </p>
                <p>
                  <strong>Kontakta oss alltid först.</strong> Hör av dig till{" "}
                  <a className="text-navy underline" href="mailto:info@batteriproffs.se">info@batteriproffs.se</a>{" "}
                  inom <strong>14 dagar</strong> från det att du tog emot leveransen.
                  Först när vi godkänt returen skriftligt får varan skickas tillbaka, och
                  då får du returadress och instruktioner av oss. En retur som skickas
                  utan godkännande i förväg kan vi inte ta emot.
                </p>
                <p>
                  <strong>Batteriet måste vara obrukat och förpackningen obruten.</strong>{" "}
                  Ett batteri som kopplats in, laddats, monterats eller på annat sätt
                  tagits i bruk kan inte returneras. Det gäller även provkoppling. Ett
                  traktionsbatteri som varit i drift går inte att sälja vidare som nytt,
                  och det är också skälet till att branschen i övrigt inte erbjuder
                  företag returrätt alls.
                </p>
                <p>
                  <strong>Returavdrag 30 %.</strong> Vid godkänd retur av en felfri vara
                  gör vi ett avdrag på 30 % av varans värde. Avdraget motsvarar det som
                  vår leverantör drar av oss för kontroll, provning och åter i lager.
                  Fraktkostnaden återbetalas inte, och du står själv för returfrakten
                  samt för risken under transporten. Välj ett spårbart fraktsätt och
                  packa batteriet omsorgsfullt, helst i originalemballaget.
                </p>
                <p>
                  <strong>Undantag:</strong> specialbeställda produkter och artiklar som
                  tagits hem särskilt på din begäran kan inte returneras.
                </p>
                <p>
                  Återbetalning sker inom 14 dagar från det att vi tagit emot varan och
                  kontrollerat den, via samma betalningsmetod som användes vid köpet.
                  Kommer varan tillbaka i sämre skick än vad som avtalats förbehåller vi
                  oss rätten till ett större avdrag eller att neka återbetalning.
                </p>
              </Section>

              <Section title="6. Passformsgaranti">
                <p>
                  Har du fått hem ett batteri som inte passar din maskin löser vi det.
                  Det är den risk som faktiskt finns när man köper traktionsbatterier på
                  nätet, och den ska inte ligga hos dig.
                </p>
                <p>
                  <strong>Har vi rekommenderat batteriet</strong>, via batterifinnaren,
                  telefon eller mejl, och det ändå inte passar, byter vi till rätt modell
                  och står för frakten åt båda hållen. Inget returavdrag.
                </p>
                <p>
                  <strong>Har du beställt på egen hand</strong> och råkat välja fel modell
                  byter vi ändå utan returavdrag. Då står du för returfrakten.
                </p>
                <p>
                  Garantin förutsätter att förpackningen är obruten och att batteriet
                  aldrig kopplats in, och att du hör av dig inom 14 dagar från leveransen.
                  Uppge maskinens märke och modell så hittar vi rätt batteri direkt. Är du
                  osäker före köpet, ring{" "}
                  <a className="text-navy underline" href="tel:+46766867752">076-686 77 52</a>{" "}
                  i stället, det är alltid billigare för oss båda än en retur.
                </p>
              </Section>

              <Section title="7. Reklamation och garanti">
                <p>
                  Vid köp i näringsverksamhet gäller köplagen. Du ska undersöka varan när
                  du tar emot den och reklamera ett fel inom skälig tid från det att du
                  märkt eller borde ha märkt det. Yttersta gräns för att åberopa ett fel
                  är två år från mottagandet, om inte annat följer av en garanti.
                  Reklamationsrätten omfattar ursprungliga fabrikationsfel,
                  transportskador och produkter som avviker från det avtalade.
                </p>
                <p>
                  <strong>Vid sidan av detta gäller tillverkarens produktgaranti</strong>,
                  som är det som betyder mest på ett traktionsbatteri. Garantitiden och
                  vad den täcker framgår av respektive tillverkare. Hör av dig så tar vi
                  reda på exakt vad som gäller för din modell.
                </p>
                <p>
                  Transportskador och felleveranser anmäler du så snart som möjligt, helst
                  samma dag som leveransen. Fotografera emballaget innan du packar upp om
                  något ser skadat ut, det gör ärendet mot transportören enklare för oss
                  båda.
                </p>
                <p>
                  När en reklamation godkänns ersätter vi produkten med en ny, eller
                  återbetalar köpet om det inte är möjligt. Hör av dig{" "}
                  <em>innan</em> du skickar produkten i retur så får du instruktioner. Vid
                  godkänd reklamation står Batteriproffs för både returfrakt och frakt för
                  ersättningsvaran.
                </p>
                <p>
                  Skador på person eller egendom som orsakas av en produkt täcks av den
                  produktansvarsförsäkring som vi och våra leverantörer har tecknat.
                </p>
                <p>
                  <strong>Reklamationskontakt:</strong>
                  <br />
                  E-post:{" "}
                  <a className="text-navy underline" href="mailto:info@batteriproffs.se">info@batteriproffs.se</a>
                  <br />
                  Telefon:{" "}
                  <a className="text-navy underline" href="tel:+46766867752">076-686 77 52</a>
                </p>
              </Section>

              <Section title="8. Tvister">
                <p>
                  Svensk rätt tillämpas på avtalet. Blir vi oense försöker vi i första
                  hand lösa det direkt, hör alltid av dig till oss först. Går det inte
                  prövas tvisten av allmän domstol.
                </p>
                <p>
                  Har köpet gjorts av dig som konsument gäller i stället att vi följer
                  rekommendationer från Allmänna reklamationsnämnden (ARN).
                  Du når ARN på{" "}
                  <a
                    className="text-navy underline"
                    href="https://www.arn.se"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    arn.se
                  </a>{" "}
                  eller via post: Allmänna reklamationsnämnden, Box 174, 101&nbsp;23
                  Stockholm. Du kan även använda EU-kommissionens onlineportal för
                  tvistlösning på{" "}
                  <a
                    className="text-navy underline"
                    href="https://ec.europa.eu/consumers/odr/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ec.europa.eu/consumers/odr
                  </a>
                  .
                </p>
              </Section>

              <Section title="9. Förbehåll och immateriella rättigheter">
                <p>
                  Vi har rätt att häva ett avtal utan ersättningsskyldighet om kunden
                  insett eller borde ha insett att en uppgift på batteriproffs.se var
                  felaktig — det gäller särskilt vid felaktiga prisuppgifter eller
                  lagersaldon.
                </p>
                <p>
                  Vid avvikelser mellan information på batteriproffs.se och i andra
                  kanaler är det uppgifterna på webbplatsen som gäller.
                </p>
                <p>
                  Vi är inte bundna av detta avtal vid force majeure — t.ex.
                  myndighetsbeslut, lagändring, arbetsmarknadskonflikt, krig, brand,
                  översvämning, naturkatastrof eller annan extraordinär händelse utanför
                  vår kontroll.
                </p>
                <p>
                  Allt material på batteriproffs.se — logotyp, produktbilder, texter och
                  programkod — skyddas av upphovsrätts- och varumärkeslagstiftningen och
                  får inte kopieras, spridas eller på annat sätt nyttjas av tredje part
                  utan vårt skriftliga tillstånd. Färgåtergivningen kan variera mellan
                  olika skärmar och utgör inte i sig grund för reklamation.
                </p>
              </Section>

              <Section title="Retur i korthet">
                <div className="rounded-xl border border-border bg-surface p-6 text-sm">
                  <ul className="ml-5 list-disc space-y-2">
                    <li>
                      Ingen ångerrätt vid företagsköp. Vi tar ändå emot retur i 14 dagar.
                    </li>
                    <li>
                      Mejla{" "}
                      <a className="text-navy underline" href="mailto:info@batteriproffs.se">
                        info@batteriproffs.se
                      </a>{" "}
                      och invänta vårt godkännande innan du skickar något.
                    </li>
                    <li>Obruten förpackning, aldrig inkopplat eller laddat.</li>
                    <li>Returavdrag 30 % av varans värde. Frakten återbetalas inte.</li>
                    <li>Du står för returfrakten och risken under transporten.</li>
                    <li>
                      Passar batteriet inte din maskin gäller passformsgarantin i stället,
                      utan returavdrag.
                    </li>
                  </ul>
                </div>
              </Section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
