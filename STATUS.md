## 2026-09-05: Stripe-test och ordermejl verifierade

Betalningstestet är klart. Två köp genomförda i rätt Stripe-testkonto: nekat kort med lyckat återförsök, 3D Secure, flera artikelrader, reservation, debitering och leverans. Åtta orderrelaterade testmejl verifierade Delivered i Resend. Kontrollerade återförsök gav inga extra debiteringar eller utskick. Detaljer och begränsningar: docs/payment-e2e-20260905.md och JSON-kvittot bredvid.

Testets egen webhook avstängd och separat testprojekt pausat. Ordinarie review fortfarande skyddad från betalningar och utskick. Offert kvar, kortbetalning kvar. Kassans äldre fakturatexter har ändrats till betalningsunderlag. Produktion och design v3 oförändrade. Den tidigare blockerande inloggningen och betalningsverifieringen längre ned är historik.

## 2026-09-05: godkänd push och verifierat mejlförtest

Joel har bett att allt färdigt arbete pushas till GitHub och uttryckligen valt att behålla offertförfrågan. Kort är fortfarande enda nya kassaflödet; offertförfrågan ger ingen kredit och skapar ingen faktura. Offertpris med egen kortbetalningslänk är inte implementerat.

Ett märkt testmejl från noreply@batteriproffs.se till Joels befintliga testmottagare har verifierats som delivered i Resend. Återförsök med samma idempotensnyckel gav samma meddelande-ID. Kvitto: docs/payment-delivery-verification-20260905.json. Det är ett mejlförtest, inte ett genomfört Stripe-/orderflöde.

Stripe-testköp, reservation, debitering, webhook och orderutskick återstår. Lokala och Vercel-nycklar är skarpa; webbläsaren är inloggad på Invox och behöver rätt Batteriproffs-inloggning. Ingen skarp transaktion har gjorts.

Grenen fix/order-integrity-20260904 ska pushas separat. vercel.json spärrar automatisk Vercel-deploy för just denna gren eftersom butikens vanliga previewmiljö också har skarpa nycklar. Huvudgren, produktion och design v3 ändras inte. Den isolerade granskningslänken är redan deployad med tidigare programkod; denna runda ändrar endast dokumentation och Git-deployspärr, inget nytt sidinnehåll.

## 2026-09-05: B2B-funktioner och produktunderlag, endast granskningsversion

Aktuellt arbete sammanfattas i B2B-RESULTAT.md. 93 tester godkända, lint utan varningar, bygge godkänt, beroendekontroll 0 fynd. Isolerad gren fix/order-integrity-20260904 och review https://batteriproffs-kodgranskning-2026090.vercel.app. Produktion och grafisk profil/design v3 orörda. Inga riktiga köp eller mejl testade. Ingen push till main.

Nordmax och Exide GF-Y HAR publika datablad; äldre uppgifter längre ned är inaktuella. Dokument nu kopplade till alla 20 artiklar. Tolv originalbilder hämtade för granskning. Kommersiellt tillstånd för nya Nordmax-bilder inte bekräftat. NM875 ET/DC-variant och EV305A-totalhöjd behöver slutkontroll inför release. Detaljer och källor i ../../outputs/batteriproffs-produktunderlag-20260905.md.

## 2026-09-05: isolerad order- och designgranskning

Se ORDER-FIX-STATUS.md. Kodrättningar och 49 regressionstester på fix/order-integrity-20260904. Separat reviewprojekt, ingen ändring av butikens produktion. Stripe-testköp och riktig mejlverifiering återstår före release.

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
- **Privatkunder (ändrat beslut 2026-09-02):** bly, gel och AGM får säljas till
  privatpersoner i den enskilda firman redan före AB:t, med företagsförsäkring
  som täcker produktansvar, ångerrätt i villkoren och priser inkl. moms i
  B2C-vyn. **Litium till privatpersoner väntar tills AB:t finns** (importör-
  ansvar vid brand ska inte landa på en privatperson). Kassan är i skrivande
  stund fortfarande företag-bara; B2C byggs när partnern bekräftat vilka
  fritidsbatterier leverantören har (mejl klart i `docs/lankbygge-texter.md`, del 7).
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

## Kundservicenumret är ett 46elks-nummer (2026-08-17)

**076-686 77 52 (+46766867752)** överallt på sajten, i mejlmallarna och i
llms.txt — INTE Joels mobil. Numret är ett virtuellt 46elks-nummer som
vidarekopplar samtal till Joels mobil med Batteriproffs-numret som callerid,
och sms mejlas till joel@stoltmarketing.se. Routern:
`Dev/internal/elks-router` (`+46766867752` i `VARUMARKEN`). Kedjan är
E2E-verifierad 2026-08-17 (testsms → notismejl på 2 sekunder).
Konstanten är `PHONE`/`PHONE_LINK` i `lib/constants.js`, men numret står
även hårdkodat i faq.js, emails.js, review-email.js, villkor, kassa m.fl. —
byts numret igen: grep:a hela kodbasen på båda formaten. Gamla numret
(073-554 69 68) var Joels mobil och krockade med stoltmarketing-GBP:n.

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
- Kontoutdragstexten står som **BATTERIPROFFSEN**, alltså bestämd form av
  varumärket. Det är kosmetik, inte ett problem: kunden känner igen ordet och
  Stripes krav är igenkännbarhet, inte exakt varumärkesstavning. Reklamationer
  kommer av texter som är något HELT annat än det kunden handlade av
  (moderbolag, gammalt firmanamn, betalleverantör). Vill man ändå ändra sitter
  fältet under Offentliga uppgifter i dashboarden och går INTE via API,
  `POST /v1/accounts/<eget konto>` avvisas som Connect-only.
- **Omdömesmejlet schemaläggs hos Resend redan när ordern läggs**, med
  `scheduledAt: "in 7 days"`. Avsändaren bakas in vid schemaläggningen, så en
  ändring av `EMAIL_FROM` påverkar inte redan köade mejl.

**Öppet:** `EMAIL_FROM` är inte satt i `.env.local`, så koden faller tillbaka på
`noreply@batteriproffs.se`. Vad Vercel har satt är okontrollerat. En
omdömesförfrågan från en noreply-adress är fel avsändare för ett mejl som ber om
en tjänst. Kolla avsändarraden på en orderbekräftelse och flytta minst
omdömesmejlet till en bemannad adress.

## Returvillkoren är B2B (omskrivet 2026-08-04)

**Kassan kräver organisationsnummer, alltså finns ingen ångerrätt.** Den följer av
distansavtalslagen och gäller bara konsumenter. Köplagen (1990:931) styr i
stället, och den är dispositiv. Sajten lovade ändå "30 dagars öppet köp" på nio
ställen och villkorssidan beskrev konsumentköplagen, ARN och Konsumentverkets
ångerblankett, alltså rättigheter för en kund som inte kan slutföra ett köp här.

**Nuvarande villkor:** retur i 14 dagar, godkännande i förväg via mejl, obruten
originalförpackning, aldrig inkopplat eller laddat (inte ens provkoppling),
returavdrag 30 %, kunden står returfrakt och risk, frakten återbetalas inte.
Specialbeställt undantas.

**Varför 30 %:** Batteripoolens egna villkor mot återförsäljare säger att en
felfri retur ger "ett returavdrag som normalt utgör minst 30 % av varans
inköpsvärde". Utan motsvarande avdrag mot kund är varje accepterad retur en
förlustaffär, eftersom vi dessutom betalar returfrakt på pallgods.
**Siffran är hämtad från butik.batteripoolen.se, inte ur Joels eget
återförsäljaravtal. Stäm av den och ändra på ett ställe om den skiljer.**

**Passformsgarantin ersätter öppet köp.** En B2B-köpare ångrar sig inte, hon är
rädd att beställa fel modell till sin maskin. Har vi rekommenderat batteriet
(batterifinnaren, telefon, mejl) och det inte passar står vi för allt. Har kunden
valt själv byter vi ändå utan returavdrag, men kunden står returfrakten. Kräver
obruten förpackning och besked inom 14 dagar.

**Branschen ger inte företag returrätt.** Batteriexpressen: "Företag, kommuner,
landsting och stat har ingen returrätt enl. denna skrift." Batteriexperten: "30
dagars ångerrätt (gäller ej företag)." Batteripoolen: minst 30 % avdrag.

**Ändras returvillkoren ska följande ändras i SAMMA commit**, annars uppstår
exakt den motsägelse Google flaggar som Felaktig framställning:
`app/villkor/page.js`, `lib/faq.js`, `lib/constants.js` (USPS + TRUST_ITEMS),
`components/Footer.jsx`, `components/ProductPageContent.jsx`,
`components/Prisforklaring.jsx`, `components/AboutContent.jsx`,
`app/kategori/[slug]/page.js`, `app/layout.js` och `hasMerchantReturnPolicy` i
`app/produkt/[slug]/page.js`. Plus returpolicyn i Merchant Center.

**"20+ år i branschen" levde kvar.** Påståendet ströks ur metabeskrivningen
2026-08-03 som en av orsakerna till misrepresentation-flaggan, men satt kvar som
synlig badge i footern, i TRUST_ITEMS och i skötselguidens ingress. Borttaget
2026-08-04. Ersatt av "Priser utan offert", som går att verifiera och dessutom är
en verklig skillnad mot konkurrenterna som gömmer priser bakom offertformulär.

**Kvar att göra i Merchant Center** (Joels bord, kräver inloggning):
returfönster 14 dagar, kunden betalar returfrakt, returmetod med frakt,
restocking fee 30 %, policy-URL `https://www.batteriproffs.se/villkor`.
Gör det FÖRE identitetsverifieringen och överklagandet.

## Varifrån ordern kom (byggt 2026-08-04)

Attributionen ligger i `lib/attribution.js` (ren logik) och
`lib/attribution-context.js` (fångsten). Källan läses ur `document.referrer`
och adressraden vid FÖRSTA sidladdningen, hålls i en ref i rot-layouten
genom hela besöket och fästs på PaymentIntent av `/api/order-details`
tillsammans med företagsuppgifterna. Adminvyn visar den som blocket **Källa**.

- **Ingenting lagras på kundens enhet.** ePrivacy art. 5(3) gäller all lagring
  på terminalutrustning, inte bara kakor, och annonsattribution är inte
  "strikt nödvändigt". React-state är flyktigt minne och omfattas inte.
- **gclid slår referrer.** Ett annonsklick har ändå google.com som referrer och
  hade annars räknats som organiskt. `wbraid`/`gbraid` fångas också.
- **AI-källan slår utm_source** (ändrat 2026-08-24 efter Dalakvarn-ordern).
  ChatGPT skickar `noreferrer` och taggar i stället länken med
  `?utm_source=chatgpt.com`, så AI-matchningen läser både referrern och
  utm_source och ligger före utm-grenen. Annars hade kanalen blivit råsträngen
  "chatgpt.com" och AI-köpen inte gått att räkna på etiketten. Räkna AI-trafik
  på `AI-assistent <namn>` i `source_channel`; `pyntaKanal` normaliserar även
  de råvärden som redan ligger i Stripe.
- Fälten heter `source_channel`, `source_landing`, `source_referrer`,
  `source_gclid`, `source_campaign` i Stripe-metadatan. `source_gclid` är
  dessutom råvaran till en offline-konverteringsexport till Google Ads.
- **Ordrar lagda före 2026-08-04 saknar fälten** och visas som "Okänd (ordern
  lades före mätningen)". Skillnaden mot "Direkt" är avsiktlig.
- Attributionen strippas medvetet ur `/api/konto/ordrar`. Det är vår affärsdata,
  inte kundens orderuppgift.
- Gräns: laddar kunden om sidan mitt i besöket monteras providern på nytt och
  referrern blir vår egen domän. Märks som "Egen sajt (sidan laddades om)".

**De två första ordrarna mättes för hand** via Umami, genom att leta upp
sessionen vars `/tack`-sidvisning bär rätt `payment_intent` i adressraden:

| Order | Kanal | Landade på |
|---|---|---|
| 2026-07-27, Eventcenter Norrköping, 5 085 kr | Organiskt Google | `/` |
| 2026-08-04, SRVAB, 8 285 kr | Organiskt Google | `/produkt/ev31a-a-m8` |

**`kop`-eventet i Umami avfyrades aldrig för SRVAB-ordern**, trots att koden
funnits sedan 28 juli. Både det och Ads-konverteringen ligger bakom
`if (!data.error)` i `ThankYouContent.jsx`, och det var precis `/api/order` som
var trasigt den dagen. Endpointen svarar rätt nu, men tratten i Umami har alltså
noll uppmätta köp och Ads-konverteringen missade sannolikt ordern.

## Teknisk data på produktsidorna (2026-08-06)

Ligger i `lib/teknik.js` och renderas som **text, inte som PDF-länk**. En PDF
rankar dåligt, är osynlig för AI-assistenter och kräver nedladdning i mobilen,
vilket är där den första ordern lades. Vi hostar inga tillverkardokument, bara
länkar till deras egna.

Bakgrunden: en kund installerade två EV31A-A och frågade vilket läge han skulle
köra laddaren i. Svaret krävde att vi letade upp laddtabellen åt honom.

**Täckning: 12 av 20 artiklar.**

| Varumärke | Status | Källa |
|---|---|---|
| Discover (6) | klar | Driftmanual för Dry Cell Traction, Table 1 och 4 |
| Sonnenschein GF-V (6) | klar | Exides GF-V-datablad + driftinstruktion |
| Sonnenschein GF-Y (2) | saknas | GF1252Y och GF1263Y står inte i GF-V-databladet |
| Nordmax (6) | saknas | Leverantörens eget märke, inga publika datablad |

**Exide blockerar automatisk hämtning.** WebFetch och curl mot exidegroup.com
ger 403. Dokumenten togs via webbläsaren, som når dem utan problem. PDF-URL:erna
står i `lib/teknik.js` och går att curl:a direkt när man väl har dem.

**Tillverkarna skiljer sig på en punkt som inte får slås ihop:** Discover
FÖRBJUDER utjämningsladdning rakt av, Exide tillåter den men bara med laddare de
själva godkänt.

**Absorptionsspänningen finns bara hos Discover.** Exides dokument anger
laddmetod (DIN 41773) men ingen siffra, så Sonnenschein-sidorna anger metoden i
stället. Gissa aldrig fram den, fel laddprogram förstör ett gelbatteri.

**Rättat ur databladet 2026-08-06:** GF1276V står som **86 Ah C20, inte 83**, och
väger **28,8 kg, inte 29**. Det är batteriet Lööve Global köpte.

**Bonus: vikterna finns nu för alla sex GF-V.** 18,0 / 28,8 / 30,0 / 38,7 / 47,0
/ 62,5 kg. Det var den datan som blockerade viktbaserad frakt, där bara 8 av 20
produkter hade vikt. Discover har två av sex, hämtade från deras produktsidor,
och de gäller AM-polen medan våra artiklar ofta är M8, därav "ca".

**Öppen fråga:** villkoren och FAQ:n säger att batterierna väger "mellan 19 och
63 kilo". GF1250V väger 18,0 kg och GF12160V 62,5 kg, så spannet stämmer inte
riktigt. Rätta först när alla tjugo vikter är kända, annars byts en ostyrkt
siffra mot en annan.

## Maskinsidor: var passformsdatan kommer ifrån (2026-08-06)

**`fitsTo` är uttömt.** Varje modell som nämns där hade redan en sida. Fler
maskinsidor kräver ny data, och `lib/machines.js` tillåter från och med nu två
källor: `fitsTo`, eller tillverkarens egen publicerade batterispec med källan
utskriven i kod över posten.

**Vad spåret kan belägga:** systemspänning och kapacitet. **Vad det inte kan:**
batterifackets mått. Varken Kärcher eller Nilfisk publicerar dem. Den risken
bärs av passformsgarantin, som därför nu står i rutan "Kontrollera detta innan
du beställer" på alla maskinsidor och inte bara på villkorssidan. Joel valde
medvetet den avvägningen 2026-08-06.

**Kärcher är lätt att belägga, Nilfisk är det inte.** Kärcher skriver ut
kapaciteten i artikelnamnet ("BD 43/25 C Classic Bp Pack 76 Ah", "24V/105 Ah
wet", "24V/100 Ah AGM"). Nilfisk anger ofta bara spänningen, och flera av deras
mindre maskiner har gått över till **litium**, som vi inte säljer alls. Mal
igenom Kärcher-katalogen först, ta Nilfisk när leverantörens lista kommer.

Utbytet ligger på ungefär en användbar modell per sökning.

## Modellnummer är den kanal som säljer (2026-08-04)

SRVAB-ordern kom från en sökning som landade rakt på produktsidan, utan att
besökaren rörde startsidan eller någon kategorisida. Det är den avsikten som
konverterar: den som söker på ett artikelnummer har redan bestämt sig.

**Alla 20 produktsidor saknade artikelnumret i title-taggen.** Titeln byggdes av
`shortName`, så EVGC8A-A-sidan hette "Fritidsbatteri 8V 160 Ah Dry Cell 8V
160Ah" med volt och amperetimmar dubbelt och modellen ingenstans. Rättat:
varumärke och artikelnummer först, kategoriordet kvar efter.

Uppmätt SERP-läge i Sverige (DataForSEO, 2026-08-04):

| Sökning | Vår plats | Svenska konkurrenter på sida 1 |
|---|---|---|
| discover ev31a-a | 7 | 0 (vi är enda svenska träffen) |
| discover evgc8a-a | 7 | 2 (tryckluftservice 5 134 kr, batteripoolen) |
| sonnenschein gf12050v | utanför | 6 (batteriexpressen, ahlsell, cleanstep, m.fl.) |

**Slutsats: Discover-serien är öppen, Sonnenschein är upptaget.** Discover har
sex artiklar hos oss och SERP:en är full av amerikanska butiker i USD som en
svensk B2B-köpare inte kan handla av. Sonnenschein-numren äger etablerade
svenska återförsäljare, där krävs mer än en titeltagg. Nordmax är Batteripoolens
eget varumärke och har ingen extern söktrafik att hämta.

**Namnvariant att lösa för Sonnenschein:** vi skriver GF1250V, marknaden skriver
även GF12050V och "GF 12 050 V". Powerland listar alla tre i sin titel. Våra
sidor nämner bara en form, alltså missar vi de andra sökningarna.

## Våg 1: fem användningssidor live 2026-08-10

Bakgrund i `research/marknadsanalys-online-2026-08.md`. Kort: fritid, marin, sol
och golfbil har de svagaste förstasidorna av alla segment vi kan leverera till på
befintligt sortiment, sökordssvårigheten ligger på noll på i princip hela klustret,
och domänen rankade redan position 15 på husvagnsbatteri via kategorisidan utan att
vi gjort något åt det.

Live och curl-verifierade:

| Sida | Produkter | Grund |
|---|---|---|
| /golfbilsbatteri | 6 | fitsTo nämner golfbilar på samtliga |
| /solcellsbatteri-12v | 6 | fitsTo nämner solcells- eller energilagring |
| /husbilsbatteri | 6 | 2 via fitsTo, 4 via spec (sluten, djupcyklisk, 12V) |
| /husvagnsbatteri | 6 | samma som husbil |
| /marinbatteri | 6 | 1 via fitsTo, 5 via spec |

Plus `/kunskap/agm-gel-eller-litium-i-husbilen`,
`/kunskap/dimensionera-solcellsbatteri` och
`/kunskap/startbatteri-eller-forbrukningsbatteri-i-baten`.

**Passformsregeln gäller här också.** `lib/anvandning.js` har ett fält `grund` per
sida och ett `specnot` som skrivs ut för kunden när en produkt står där på sin
konstruktion i stället för på en belagd passform. Skillnaden mellan "produktdatan
säger att EV31A-A passar båtinstallationer" och "ett slutet gelbatteri kan monteras
i boendedelen eftersom det inte gasar" ska synas, inte gömmas.

**Tre saker sidorna säger rakt ut, med flit:**
- Vi säljer inte startbatterier till båt.
- Vi säljer inte litium, och litiumguiden avråder från oss för den som bestämt sig.
- Kassan kräver organisationsnummer. Samma problem som en gång löstes på
  /foretagskund, nu löst innan kunden fyller varukorgen.

**Vi är inte prisledande i fritid och copyn påstår inte det.** Uppmätt: Varta LA95
AGM 95Ah kostar 2 610 kr i handeln, vår gel 105Ah 4 495 kr. I traktion är läget det
omvända (Trojan T-105 4 728 mot vår 2 195), och där är prisargumentet hela poängen.

**Kunde INTE byggas, saknar produkter:** åkgräsklippare och lastbil/traktor
(startbatterier) samt UPS-ersättning 7 till 9 Ah. Ligger i frågelistan till
leverantören.

**Gate för konsumentkassan:** leverantörens B2C-paketfrakt ≤ ca 200 kr/kolli.
Marknaden kör fri frakt eller ca 50 kr, vår platta 695 kr är tio gånger fel för
privatkund. Tills det är löst är sidorna B2B: uthyrare, marinor, campingar,
golfklubbar.

**MÄTPUNKT 15 oktober 2026:** topp 20 på husvagnsbatteri, fritidsbatteri och
husbilsbatteri? Ja, då Ads-test 50 kr/dag på fritid. Nej, då analysera innan mer
byggs.

## Veckorapport och länkbygge (2026-09-02)

- **`/api/cron/veckorapport`** körs av Vercel cron (`vercel.json`, måndag 05:00 UTC)
  och mejlar `CONTACT_TO_EMAIL`: ordrar och omsättning senaste 7 dagarna, ordrar
  som väntar på spårningsnummer (med varning när kortreservationen är på väg
  att dö), adresser som fastnade i kassan (`kontakt_epost` utan köp), Umami
  (besökare, sökningar utan träff, sidor, källor) och nya länkar via DataForSEO.
  Logiken i `lib/veckorapport.js`, varje källa i egen try/catch. Manuellt:
  `curl -H "Authorization: Bearer $CRON_SECRET" https://www.batteriproffs.se/api/cron/veckorapport?dagar=30`.
- **Nya env i Vercel (prod + preview):** `UMAMI_URL`, `UMAMI_USERNAME`,
  `UMAMI_PASSWORD`, `UMAMI_WEBSITE_ID` (99e7d795…), `DATAFORSEO_USERNAME`,
  `DATAFORSEO_PASSWORD`, `CRON_SECRET` (även i `.env.local`).
- **`docs/lankgap-2026-09.md`**: 97 svenska/nordiska domäner som länkar
  Batteriexpressen/Batteriexperten men inte oss. Batteriproffs har 21 hänvisande
  domäner, alla skräp. Mål: 25 riktiga domäner till 2026-11-01.
- **`docs/lankbygge-texter.md`**: klubbpitch (golfklubbar = B2B nu, båt/husbil
  när B2C finns), sex forumsvar, katalogtext, återförsäljarlista, testsajtpitch,
  rabattkodstext, partnermejlet om fritidssortimentet. Konton skapar Joel själv.
