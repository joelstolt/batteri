# Batteriproffs — läge 2026-07-29

Skrivet som överlämning. En ny session ska kunna läsa den här filen och fortsätta
utan att gräva i historiken.

- **Källa:** `clients/batteriproffs`, repo `joelstolt/batteri`
- **Stack:** Next 16 App Router, React 19, Tailwind v4, Vercel
- **Deploy:** auto vid push till `main`. Ingen CLI, ingen manuell deploy.
- **Live:** https://www.batteriproffs.se
- **Allt i den här filen är pushat och live**, utom där annat står.

## Bolagsstrukturen (klarlagd 2026-07-29)

Det här var länge fel i den här filen, så läs det noga:

- **Säljare och avtalspart mot kunden är Joel Stolts enskilda firma**, org.nr =
  hans personnummer. Inget aktiebolag. Kunden betalar dit.
- **Battericentralen står bakom Batteriproffs** och skickar batterierna från sin
  leverantör. De är alltså leverantör, inte säljare. **Varumärkena ska hållas
  isär — skriv aldrig ut kopplingen i kundtext.** Att inte nämna den är en sak,
  att förneka den vore en annan.
- Prisfördelen kommer av att inköp sker till Battericentralens pris, byggt på
  över tjugo års leverantörsrelation. Så formuleras det på sajten, utan att
  peka någonstans.
- **AB bildas när verksamheten gått 25 000 kr i vinst.** Fram tills dess ligger
  allt på den enskilda firman.
- **Privatkunder öppnas FÖRST när AB:t finns.** Konsumentköplagens tre års
  reklamationsrätt med omvänd bevisbörda ska inte landa på en privatperson.
  Kassan är därför företag-bara med flit, inte av glömska.
- ⚠️ **Momsreg.nr i `lib/constants.js` är härlett ur personnumret och måste
  verifieras av Joel.** Sajten tar ut 25 % moms på varje order.
- Tidigare påstod den här filen "delägare: Joel, Isak, Lukas". En enskild firma
  kan inte ha delägare. Reds ut när AB:t bildas.

## Affären, som den faktiskt ser ut

Det här styr formuleringar och funktionsval, så läs det innan du skriver copy:

- Helt digital verksamhet. Ingen butik, inga kundbesök, ingen upphämtning.
- **Leverantören skickar direkt till kund i 9 av 10 fall (dropship).** Därför:
  - Batteriproffs kvalificerar **inte** för en Google Business Profile.
  - Inga leveranslöften får formuleras som garantier. Det står "normalt", medvetet.
  - Spårningsnummer beror på att leverantören lämnar det vidare. Ej bekräftat.
- Firmaadress (ej besöksadress): Väringavägen 10, 281 42 Hässleholm.
- Kassan är **företag bara** och **kort bara**. Båda medvetna beslut av Joel.
  Faktura är uppskjuten, inte bortvald.
- Frakt: **695 kr platt**. Ligger kvar tills Joel förhandlat med leverantören.
- Delägare: Joel, Isak, Lukas.
- **Prisläget är verifierat:** T-105-motsvarigheten 2 195 kr mot Batteriexpressens
  4 728 kr. Även med full frakt (2 890 kr) billigast i Sverige. "Marknadens
  vassaste priser" är belagt, inte skryt.

## Vad som finns

20 produkter i `lib/products.js` (hårdkodade). Sanity är inkopplat men innehåller
**noll produkter** — rör det inte, det är en fälla att börja läsa därifrån.

Sidor: startsida, 20 produktsidor, kategorier, 30 maskinsidor under
`/batteri-till/<slug>`, 3 ersättningssidor under `/ersatter/<slug>`, `/laddare`,
`/batterivatten`, `/skotsel`, `/faq`, `/om-oss`, `/kontakt`, `/villkor`,
`/integritet`, `/kassa`, `/tack`, `/konto`, `/admin`.

API: `create-payment-intent`, `order-details`, `order`, `order/ship`,
`stripe/webhook`, `contact`, `google-feed.xml`, `admin/orders`,
`konto/{logga-in,verifiera,ordrar,logga-ut}`.

## Ordrar: var de bor

Det finns ingen orderdatabas och behövs ingen. **PaymentIntentens metadata ÄR
ordern** — köpare, rader, frakt och totalsumma skrivs dit av `order-details`
direkt efter betalningen. `lib/orders.js` är enda stället som översätter en
PaymentIntent till en order, så admin, kundkontot och leveransmejlet aldrig kan
tolka samma fält olika.

- **`/admin`** — orderlista bakom `ADMIN_TOKEN`, som klistras in i formuläret och
  sparas i sessionStorage. Spårningsmejlet skickas med en knapp i stället för
  handknackad curl. `/api/order/ship` skriver numera tillbaka `tracking`,
  `carrier` och `shipped_at` på ordern, så leveransstatus finns kvar.
- **`/konto`** — kundens egna ordrar. Inloggning via mejlad länk, inget lösenord
  och inget kontoregister: adressen på ordern är kontot. Ordrarna hittas med
  Stripe-sökning på `metadata['buyer_email']`. Innehåller "beställ igen".
- **Signeringsnyckeln härleds ur `ADMIN_TOKEN`** med HMAC och en etikett per
  användning (magisk länk respektive session), så de inte går att byta mot
  varandra. Inga nya miljövariabler. **Konsekvens: roterar du `ADMIN_TOKEN`
  loggas alla kunder ut.** De begär bara en ny länk. Vill du koppla isär dem är
  nästa steg en egen `KONTO_SECRET` i `lib/konto-auth.js`.
- **Stripes sökindex ligger någon minut efter.** En helt färsk order kan saknas i
  kundkontot en kort stund. Adminvyn använder `list` och drabbas inte.

Env i Vercel: `NEXT_PUBLIC_STRIPE`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`,
`RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `ADMIN_TOKEN`.

**Mätvärden (Lighthouse, live):** Prestanda 96, Tillgänglighet 100,
Best practices 100, SEO 100, Agentic browsing 100. LCP ~1,0 s.

## Filer att känna till innan du ändrar något

| Fil | Varför den spelar roll |
|---|---|
| `lib/products.js` | 20 produkter. `publicProducts` = de utan `hidden`. **Alla listningsytor måste använda `publicProducts`**, annars läcker testprodukten ut. |
| `lib/machines.js` | 29 maskiner, härledda ur `fitsTo`. Lägg till maskin genom att lägga till i `fitsTo`. |
| `lib/replacements.js` | Härleds ur spec-fältet `Ersätter`. |
| `lib/search-index.js` | Herons sökregister. `sokbar()` måste användas av UI:t också, annars säger rutan "ingen träff" på frågor som aldrig söktes. |
| `lib/checkout.js` | B2B-validering (orgnr, Luhn). Delas av klient och server — validera aldrig bara i klienten. |
| `lib/references.js` | Adam Olsson + Lasse Karlsson, `godkand: false`. Visas inte. Flippa först vid skriftligt OK. |
| `lib/constants.js` | Telefon, adress, öppettider. Ändra på ett ställe. Kategoriernas `count` **härleds ur `publicProducts`** — hårdkoda den aldrig igen, den hade halkat efter sortimentet och ljög på startsidan. |
| `lib/orders.js` | Enda översättningen PaymentIntent → order. Läser **två** radformat: `{name,qty,price}` för ordrar före 2026-07-29 och `{s,n,q,p}` efter. Båda måste fungera för all framtid, gamla ordrar ligger kvar oförändrade i Stripe. `orderIdFor` får aldrig ändras — numret står i utskickade mejl. |
| `lib/konto-auth.js` | Signering av inloggningslänk och session. Nyckeln härleds ur `ADMIN_TOKEN`. |
| `lib/admin-auth.js` | Tokenkoll för admin-endpointerna. Konstanttidsjämförelse plus eget tak per IP. |
| `lib/queries.js` | **Läses inte av något.** Sanity-lagret, urkopplat ur kassan 2026-07-29. Koppla inte in det igen utan att först bestämma vilken källa som äger priset. |
| `app/globals.css` | Färgtokens med uppmätt kontrast i kommentar. `--color-amber-heading` bara till stora rubriker. Rör inte utan att mäta om. |

## Fällor som redan kostat tid

- **Stripe Link** hänger kassan. `payment_method_types: ["card"]` tar bort Link som
  betalsätt men **inte** Link-signupen — den sitter på kontot. Avstängd via
  `payment_method_configurations` på båda konfigurationerna. `confirmPayment` kan
  dessutom kasta, så den har try/catch + 45-sekunders vakthund.
- **Rate limiting i minnet fungerar inte på Vercel** (instanser skalar ut). Löst
  med en WAF-regel, `fixed_window` 20/60 s per IP på `/api/*`. `token_bucket`
  kräver Enterprise.
- **`NextResponse` går inte att återanvända** mellan anrop — kroppen läses en gång.
  Skapa svaret i en funktion.
- **Bygget fångar inte allt.** Både Link-buggen och NextResponse-buggen syntes
  först vid skarpt test mot live.
- **axe rapporterar falska kontrastfel** på `position: sticky` utan egen bakgrund.
- **DataForSEO utelämnar `score`** på color-contrast — kör `full_data: true`.
- **Stripe kapar varje metadatavärde vid 500 tecken.** Orderrader packas därför
  med korta nycklar, och får de ändå inte plats läggs `{o: N}` sist som säger hur
  många rader som ströks. Tidigare slicades JSON:en rakt av, blev osyntaxbar och
  hela radlistan försvann tyst vid ungefär tretton artiklar.
- **`hidden: true` betyder "syns inte utåt", inte "går inte att sälja".** Kassan
  slår därför upp priset i hela `products`, inte `publicProducts` — det är så
  provköpet på 5 kr fungerar. Byt inte till `publicProducts` där.

## Kvar — Joels bord

- Bekräfta avskärningstiden "före 14" med leverantören. Den står i H1 och i villkoren.
- Får ni spårningsnumret av leverantören? Kassan lovar att det mejlas, och
  `/api/order/ship` kräver att numret matas in för hand.
- Adam och Lasse: få deras godkännande i skrift, plus företag eller roll.
- Kreditera testköpet på 5 kr.
- Koppla bankkonto till Stripe.
- Kontrollera att `CONTACT_TO_EMAIL` går till Isak och Lukas, inte bara Joel.
- Foton på er tre. (Animerade figurer avfärdade: illustrerade människor sänker
  trovärdigheten mot en industriell B2B-köpare.)

## Kvar — bygge

Kundkonto och orderhantering är **byggt** (se "Ordrar: var de bor" ovan). Kvar
på den funktionen: `inStock` är hårdkodat i `lib/products.js` och speglar inte
leverantörens saldo, så "beställ igen" lägger i varukorgen utan att kunna lova
lager.

Övrigt i kö, i ungefärlig ordning:

1. **Ersättningssidor — störst effekt per krona, men BLOCKERAD på passformskoll.**
   Bara 3 av 20 produkter har spec-fältet `Ersätter` ifyllt, så det finns bara
   tre `/ersatter/`-sidor. Sökdata: "trojan t-105" 40/mån, "trojan batteri"
   30/mån, "trojan t-125" 20/mån, t-875/t-605/t-145/l16 10/mån var, alla med
   konkurrensindex 100 och CPC 1,96–5,46 USD. Högsta köpintention som finns.
   Måtten antyder fler matchningar (evgc6a-a-m8 är 6V 220 Ah i 260×180, alltså
   GC2-format som T-105; evgc8a-a-m8 är GC8 som T-875), **men det får inte
   skrivas in utan att leverantören bekräftat passformen.** En felaktig
   ersättningsuppgift betyder att en kund köper ett batteri som inte passar i
   liften. Fråga leverantören, fyll sedan i `Ersätter` — sidorna genererar sig
   själva ur fältet.
2. **Viktbaserad frakt — BLOCKERAD på samma mejl som punkt 1.** 12 av 20 artiklar
   saknar vikt. Den går att uppskatta ur GF-seriens Wh/kg-mönster (34–39 Wh/kg)
   men landar på ±10 %, alltså ±4 kg på ett 40-kilosbatteri. **Publicera aldrig
   en uppskattad vikt som produktspec** — kunder planerar lyft och hantering
   efter den. Be leverantören om vikterna i samma mejl som Trojan-numren.
3. Stafflade priser (mängdrabatt) — normalt i B2B, saknas.
4. Datablad som PDF per produkt.
5. Prisjakt-feed.

## Google Merchant Center: blockerat på "Felaktig framställning"

**Alla 20 artiklar står som Inte godkänd.** Konto 5819396648. Orsaken är
policyn Felaktig framställning (Misrepresentation) på KONTONIVÅ, inte feedfel —
feeden har alla obligatoriska attribut och är granskad.

Google skriver att problemet upptäcktes **genom automatiska kontroller**. Det
utesluter i praktiken hypotesen att en granskare fastnade i den företagsbara
kassan. Automatflaggan träffar profilen: ny domän, ingen handelshistorik, inga
omdömen, och priser långt under marknaden. Deras system kan inte skilja det från
en bedrägerisajt.

**Grundorsak vi hittade 2026-07-29: SNI-koden sa Dataprogrammering.** Firman var
registrerad på 62.100 medan sajten säljer batterier. Googles automatik jämför
offentliga företagsuppgifter mot sajten, och den diskrepansen är precis vad
"anledning att tro att kunder blir vilseledda" pekar på.

**Åtgärdat:** ändringsanmälan inskickad till Skatteverket 2026-07-29, kvittens
20260729-543298. Ny fördelning 62.100 Dataprogrammering 80 %, **46.649
Partihandel med diverse andra maskiner och diverse annan utrustning 20 %**.
Notera att SNI2025 numrerat om allt — gamla 46.690 finns inte längre.

**Ordningen härifrån, och den får inte kastas om:**

1. Vänta tills 46.649 syns på registerutdraget (Skatteverket → Mina sidor →
   Företagsinformation → Registerutdrag). **Ladda inte ned det innan** — då
   laddar man upp ett dokument som säger att man är programmerare.
2. Kör identitetsverifieringen hos Google. Den blockerar omprövning helt.
   Kräver registerutdraget plus pass eller körkort.
3. Fyll i Företagsinformation komplett i Merchant Center, och lägg in
   returpolicyn DÄR (räcker inte att den står på sajten).
4. Först då: begär granskning.

En avslagen omprövning gör nästa svårare, så gå inte i förtid.

**Redan åtgärdat som stärker ärendet:** villkoren namnger säljaren med org.nr
och momsnr, kvittot har säljaruppgifter och momsspecifikation, FAQ:n motsäger
inte längre kassan, och prisförklaringen svarar på varför priserna ser för bra
ut. Det som fortfarande saknas är Googles andra punkt: omdömen eller
certifikat. Omdömessystemet är byggt men tomt.

## Marginalen styr kanalvalet

Marginalen är **15–20 % på varje produkt** (Joel, 2026-07-29). Priserna i
`lib/products.js` är inkl. moms, så marginalen räknas på nettot.

CPC på batteritermerna ligger på 1,45–2,60 USD, alltså ca 20 kr per klick.
Marginal vid 15 % och hur många klick den bär: nm105-6et 263 kr = 13 klick,
gf-12-160v 791 kr = 40 klick. En normal e-handelskonvertering på 2 % kräver
50 klick per order. **Betald trafik går alltså back på hela sortimentet vid
normal konvertering.** Sökningar på artikelnummer kan konvertera betydligt
högre, men det är omätt: butiken har två genomförda ordrar totalt.

Konsekvens: **organiskt är inte det långsamma alternativet utan det enda som
bär.** För Google Shopping (100 kr/dag, produktval stod öppet): kör bara de sju
produkterna över ~4 000 kr, släck resten, och behandla första månaderna som
inköp av konverteringsdata. Köpspårning finns redan i Umami.

## Gratis återvinning

Bekräftat av Joel 2026-07-29. `/atervinning`, en FAQ-post och ett stycke i
prisartikeln. Det är den trygghetssignal branschen faktiskt använder — ingen av
sex B2B-konkurrenter visar omdömen, men både Midac och Batteriexpressen gör en
poäng av återvinningen.

**Logistiken är medvetet öppet formulerad.** Att den är gratis är bekräftat, men
inte vem som står för frakten eller om batteriet hämtas eller lämnas. Skriv
aldrig in ett hämtningslöfte utan besked — det är ett leveranslöfte i förklädnad,
och sådana får enligt affärsreglerna högst upp aldrig formuleras som garantier.
**Joel: bekräfta upplägget så skärps texten.**

## Tre FAQ-svar var fel (rättade 2026-07-29)

Värt att känna till för att samma sak inte ska smyga sig in igen: FAQ-texten
skrevs innan kassan och momsvisningen fick sina slutliga beslut, och hann bli
inaktuell utan att någon märkte det.

- Sa att ni säljer till privatpersoner. Kassan kräver giltigt organisationsnummer
  med Luhn-kontroll, så en privatperson fyllde varukorgen och gick in i en vägg.
- Sa att priser visas exklusive moms. `lib/vat-context.js` har `inclVat: true`.
- Sa "specialiserade på Sonnenschein gel". Gäller 7 av 20 artiklar.

**Regel: ändras kassan, momsvisningen eller sortimentet, läs om `lib/faq.js`.**

## Omdömen (byggt 2026-07-29)

**Påhittade omdömen är uteslutet.** Svartlistad marknadsföring enligt
marknadsföringslagen sedan Omnibus 2022, förbjudet utan bedömning i det
enskilda fallet. Frågan har kommit upp och svaret är nej, oavsett hur naturligt
det skulle se ut. Se även [[reference_batteribransch_omdomen]]: noll av sex
B2B-konkurrenter visar omdömen alls.

Systemet som finns i stället:

- Omdömet lagras i metadatan på den PaymentIntent köpet gjordes med, nyckel
  `omd_<slug>`. Ingen ny databas, och omdömet kan inte existera utan ett
  verifierat köp att hänga på.
- Kunden skriver det i `/konto`, bara på artiklar som finns på en egen order.
  Servern kollar session, ägarskap OCH att artikeln fanns på just den ordern.
  Ett omdöme per artikel och order.
- Moderering i `/admin`, fliken Omdömen. Nekade raderas inte, bara döljs.
- Produktsidan är **ISR med `revalidate = 3600`**. Omdömen måste ligga i
  server-HTML, annars är de osynliga för Google och AI-botarna. Publicerat
  omdöme syns inom en timme.
- **`aggregateRating` sätts bara när det finns riktiga omdömen och visar det
  faktiska snittet.** Aldrig avrundat uppåt. Batteriexperten märker upp femma
  på sidor som innehåller ettor, och det är den enda punkt där de går att sätta
  dit. Gör aldrig samma sak här.

**Sjudagarsmejlet hade aldrig skickats.** `lib/review-email.js` pekade på
`GOOGLE_REVIEW_URL`, som aldrig var satt och aldrig kunde bli det (dropship utan
besöksadress kvalificerar inte för Google Business Profile). Funktionen
returnerade null på första raden. Pekar nu på kontot.

## Betalning: vad som gäller och varför

**Kort dras direkt vid köp.** `create-payment-intent` sätter inget
`capture_method`, alltså automatisk dragning. Villkoren påstod tidigare att
beloppet "reserveras och dras när ordern skickas" — det stämde aldrig, och
texten är rättad 2026-07-29. **Ändrar någon till manuell capture måste
villkorstexten ändras tillbaka samtidigt.**

Manuell capture övervägdes och valdes bort. Den hade INTE ökat
bedrägeririsken — ordningen är alltid reservation, dragning, leverans — men en
kortreservation förfaller efter sju dygn, och leverantörens leveranstakt är
obekräftad. Ta upp igen när avskärningstiden "före 14" är verifierad.

**Förskottsfaktura mot bankgiro 5218-3480** finns i `/admin`, fliken Fakturor.
För kunder vars attestrutin kräver ett fakturaunderlag men som inte kan betala
med kort. Ingen kredit lämnas.

- Fakturan är ett **Stripe Invoice-objekt**, samma logik som att ordrar ligger
  på PaymentIntents. Ger fakturanummer och status utan ny databas.
- Betalningen sker utanför Stripe, så fakturan markeras för hand med
  `paid_out_of_band`. Stripe kan aldrig veta det av sig själv.
- Mejlet går via Resend i sajtens mall. **Använd aldrig Stripes fakturautskick**
  — den mallen visar Stripes betalalternativ i stället för bankgirot.
- Förfallotid **10 dagar**. Trettio är standard för kreditfaktura men fel här:
  många bolag betalar veckovis, så sju missar en betalkörning medan trettio
  låter ordern ligga en månad medan priset kan ändras.
- **Momsberäkningen i `lib/fakturor.js` måste följa `create-payment-intent`.**
  Verifierad mot nio fall. Divergerar de får kunden en faktura som inte stämmer
  med kassan.
- Skicka aldrig batteriet innan betalningen syns på bankgirot.

**Riktig faktura med 30 dagar** kräver en betalpartner (Ledyer, Svea, Walley)
som köper fordran och tar kreditrisken. Kostar runt 3 %, vilket är en fjärdedel
av marginalen på de billiga artiklarna. Kräver omsättningshistorik, som saknas.
Var beredd på krav om **personlig borgen** — det flyttar risken till Joel, Isak
och Lukas privat i stället för att ta bort den.

## Kundkontots session

90 dagar, inte 30. B2B-kunder beställer kvartalsvis och med en månad hade varje
besök krävt en ny mejlrunda. Omdömesmejlet förifyller adressen i länken men bär
**ingen token** — företagsadresser hamnar i delade inkorgar och vidarebefordras,
och ett mejl ska inte vara en inloggning.

## Sidor från konkurrentgenomgången (2026-07-29)

`/vilket-batteri`, `/foretagskund`, plus FAQ om att ändra order och om
outhämtade paket.

**Outhämtade paket är en oprissatt risk.** Batterierna väger 19–63 kg, så en
retur kostar frakt i två riktningar mot en marginal på ett par hundra kronor.
Villkoret säger nu att kostnaden debiteras, utan schablonbelopp.
**Joel: sätt ett fast belopp** (Batteriexperten tar 249 kr, upp till 500 kr för
varor som skickas direkt från leverantör — alltså precis er modell).

## Kunskapsbanken

`/kunskap` med tre artiklar, ämnesvalda på DataForSEO-data. "Vad kostar ett
truckbatteri" har bara 10 sökningar/mån men konkurrensindex **14**, alltså nästan
fri väg.

**Priser hårdkodas ALDRIG i artikeltexten.** De slås upp ur `lib/products.js` via
`prisFor()` i `lib/kunskap.js`, så prisändringar slår igenom av sig själva. En
prisguide med inaktuella priser är precis den sida en inköpare mäter er
trovärdighet mot. Artiklarna är serverkomponenter utan klient-JS.

## Första skarpa B2B-ordern (2026-08-04)

SRVAB, 8 285 kr, 2 st Discover EV31A-A till Stockholm. Ordern avslöjade fyra
buggar, alla fixade och deployade samma dag.

- **Orderbekräftelsen visade tom produktrad.** Metadatan lagrar raderna kompakt
  som `{s,n,q,p}` för att rymmas i Stripes teckengräns, men `buildOrderBody` i
  webhooken läste `i.name/i.qty/i.price`. `parsaItems` i `lib/orders.js` hade
  rätt översättning men var inte exporterad, så webhooken hade byggt en egen som
  glidit isär. Nu exporteras den och det finns återigen bara EN översättning.
  `/konto` och `/admin` var aldrig drabbade.
- **PostNord-länken i leveransmejlet gav 404.** Adressen
  `postnord.se/vara-verktyg/spara-brev-och-paket?shipmentId=` är borttagen av
  PostNord. Rätt form är `tracking.postnord.com/se/tracking?id=`. Läxa:
  transportörernas spårnings-URL:er ruttnar tyst, verifiera mot en skarp
  försändelse. DHL-grenen är okontrollerad.
- **`invoice_email` användes aldrig.** Fältet är obligatoriskt i kassan och
  visades i kvittot, men ingenting skickades någonsin dit. Kundens bokföring fick
  alltså inget underlag. Kvittot går nu som kopia dit när adressen skiljer sig
  från beställarens.
- **Etiketten "Faktura skickas till"** motsade stycket längre ner i samma mejl om
  att ingen faktura skickas. Heter nu "Kvitto till bokföringen".

Två funktioner tillkom:

- **`/api/order/capture`** drar en reserverad betalning utan mejl och utan
  spårningsnummer.
- **`tyst: true` på `/api/order/ship`** registrerar leveransen och drar
  betalningen men skickar inget systemmejl, för när kunden ska få ett personligt
  mejl i stället.

Båda finns som knapp respektive kryssruta i adminvyn. **Tyst-läget är ännu
oprövat i produktion**, den första ordern registrerades via en direkt
metadata-skrivning mot Stripe.

## Betalflödet i praktiken

- **Utbetalningsschemat står på `manual`.** Stripe skickar ALDRIG pengar till
  banken av sig självt, oavsett saldo. Varje utbetalning startas för hand på
  `dashboard.stripe.com/balance`. Medel blir tillgängliga 3 dygn efter dragning.
- Kortreservationen gäller **7 dygn**. Dras den inte innan dess släpps pengarna
  och ordern måste läggas om.
- Dragningen sitter i `/api/order/ship` och krävde spårningsnummer, vilket
  krockade med att leverantören ofta lämnar numret ett par dygn senare. Därav
  capture-endpointen ovan.
- Kontoutdragstexten står som **BATTERIPROFFSEN**, inte Batteriproffs. Ändras i
  Stripe under Företagsuppgifter. Fel namn på kortfakturan är den vanligaste
  orsaken till onödiga kortreklamationer.
- **Omdömesmejlet schemaläggs hos Resend redan när ordern läggs**, med
  `scheduledAt: "in 7 days"`. Avsändaren bakas in vid schemaläggningen, så en
  ändring av `EMAIL_FROM` påverkar inte redan köade mejl.

**Öppet:** `EMAIL_FROM` är inte satt i `.env.local`, så koden faller tillbaka på
`noreply@batteriproffs.se`. Vad Vercel har satt är okontrollerat. En
omdömesförfrågan från en noreply-adress är fel avsändare för ett mejl som ber om
en tjänst. Kolla avsändarraden på en orderbekräftelse och flytta minst
omdömesmejlet till en bemannad adress.
