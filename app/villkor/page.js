import TopBar from "@/components/TopBar"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export const metadata = {
  alternates: { canonical: "https://www.batteriproffs.se/villkor" },
  title: "Köpvillkor & Leveransvillkor — Batteriproffs",
  description:
    "Villkor för beställning, leverans, betalning, ångerrätt och reklamation hos Batteriproffs.",
}

function Section({ title, children }) {
  return (
    <section>
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
                Senast uppdaterad: april 2026
              </p>
            </div>
          </div>

          <div className="mx-auto max-w-[800px] px-4 py-10 text-base leading-relaxed text-text-mid sm:px-6">
            <div className="flex flex-col gap-10">
              <Section title="Allmänt">
                <p>
                  Dessa villkor gäller för alla beställningar som görs på{" "}
                  <strong>batteriproffs.se</strong>. De omfattar både privatpersoner som
                  fyllt 18 år och företag, om inte annat har avtalats skriftligt.
                </p>
                <p>
                  Webbplatsen drivs av Joel Stolt (enskild firma), org.nr 901108-0851.
                  Vid frågor om en order, retur eller reklamation når du oss enklast via:
                </p>
                <ul className="ml-5 list-disc space-y-1">
                  <li>E-post: <a className="text-navy underline" href="mailto:info@batteriproffs.se">info@batteriproffs.se</a></li>
                  <li>Telefon: <a className="text-navy underline" href="tel:+46735546968">073-554 69 68</a></li>
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
                  <a className="text-navy underline" href="tel:+46735546968">073-554 69 68</a>{" "}
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
                  som ett giltigt utövande av ångerrätten. Kan du inte ta emot
                  leveransen, hör av dig i förväg så bokar vi om utan kostnad.
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

              <Section title="5. Ångerrätt">
                <p>
                  Som privatkund har du <strong>30 dagars ångerrätt</strong> räknat från
                  den dag du tog emot varan — det är längre än lagens minimikrav på 14
                  dagar. Du får undersöka produkten i den utsträckning som varit rimlig
                  i en fysisk butik utan att förlora ångerrätten. Om produkten har
                  tagits i bruk, monterats eller laddats anses den använd i en
                  omfattning som påverkar värdet.
                </p>
                <p>
                  <strong>Undantag:</strong> Ångerrätten gäller inte vid specialbeställda
                  produkter, t.ex. batteripack som tillverkats efter dina egna
                  specifikationer.
                </p>
                <p>
                  För att åberopa ångerrätten meddelar du oss inom 30 dagar — enklast via{" "}
                  <a className="text-navy underline" href="mailto:info@batteriproffs.se">info@batteriproffs.se</a>.
                  Du kan också använda Konsumentverkets standardblankett (se längst ner
                  på sidan). Därefter har du 14 dagar på dig att skicka tillbaka varan.
                </p>
              </Section>

              <Section title="6. Returer">
                <p>
                  Du står själv för returfrakten samt risken under transporten — vi
                  rekommenderar därför ett spårbart fraktalternativ. Packa produkten
                  omsorgsfullt, gärna i originalförpackningen, så att den inte skadas på
                  vägen.
                </p>
                <p>
                  Återbetalning sker inom 14 dagar från det att vi mottagit varan eller
                  fått bevis på att returen är skickad. Pengarna återförs alltid via
                  samma betalningsmetod som användes vid köpet. Om varan returneras i
                  försämrat skick förbehåller vi oss rätten att göra ett värdeavdrag
                  eller, vid mer omfattande skador, neka återbetalning.
                </p>
                <p>
                  Kontakta oss på{" "}
                  <a className="text-navy underline" href="mailto:info@batteriproffs.se">info@batteriproffs.se</a>{" "}
                  innan du skickar din retur — vi återkommer med returadress och
                  instruktioner.
                </p>
              </Section>

              <Section title="7. Reklamation och garanti">
                <p>
                  Konsumentköplagen ger dig som privatkund rätt att reklamera en
                  felaktig vara i tre år från mottagandet. Reklamationsrätten omfattar
                  ursprungliga fabrikationsfel, transportskador och produkter som
                  avviker från det avtalade. Vid sidan av detta gäller respektive
                  tillverkares produktgaranti.
                </p>
                <p>
                  Vid reklamation efter sex månader är det du som kund som ska kunna
                  visa att felet fanns från början. När en reklamation godkänns
                  reparerar vi produkten, ersätter den med en ny eller — om det inte är
                  möjligt — återbetalar köpet.
                </p>
                <p>
                  Anmäl alltid felet så snart som möjligt; en anmälan inom två månader
                  från upptäckt fel betraktas alltid som inom rimlig tid. Hör av dig
                  till oss <em>innan</em> du skickar produkten i retur så får du
                  instruktioner. Vid godkänd reklamation står Batteriproffs för både
                  returfrakt och frakt för en eventuell ersättningsvara.
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
                  <a className="text-navy underline" href="tel:+46735546968">073-554 69 68</a>
                </p>
              </Section>

              <Section title="8. Tvister">
                <p>
                  Skulle vi inte vara överens om utfallet av ett ärende följer vi i
                  första hand rekommendationer från Allmänna reklamationsnämnden (ARN).
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

              <Section title="Ångerblankett">
                <p>
                  Vill du häva ett köp kan du använda Konsumentverkets standardblankett
                  nedan, eller helt enkelt mejla oss formlöst — då rekommenderar vi att
                  du sparar ett kvitto på meddelandet (t.ex. en kopia av mejlet).
                </p>
                <div className="rounded-xl border border-border bg-surface p-6 text-sm">
                  <p className="mb-3 font-semibold text-text-dark">Mottagare</p>
                  <p className="mb-5">
                    Batteriproffs
                    <br />
                    E-post:{" "}
                    <a className="text-navy underline" href="mailto:info@batteriproffs.se">
                      info@batteriproffs.se
                    </a>
                  </p>

                  <p className="mb-2 font-semibold text-text-dark">Konsumentens uppgifter</p>
                  <p className="mb-1">Namn: ______________________________________________</p>
                  <p className="mb-1">Eventuell medköpare: ________________________________</p>
                  <p className="mb-1">Adress: ____________________________________________</p>
                  <p className="mb-1">Telefon: ___________________________________________</p>
                  <p className="mb-5">E-post: ____________________________________________</p>

                  <p className="mb-2 font-semibold text-text-dark">Beställning som ångras</p>
                  <p className="mb-1">Produkt(er) / tjänst(er): __________________________</p>
                  <p className="mb-1">Beställningsdatum: _________________________________</p>
                  <p className="mb-5">Mottagningsdatum: __________________________________</p>

                  <p className="mb-1">Ort: _______________________________________________</p>
                  <p className="mb-1">Datum: _____________________________________________</p>
                  <p className="mb-1">Underskrift (vid pappersblankett): _________________</p>
                  <p>Eventuell medköpare: ________________________________</p>
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
