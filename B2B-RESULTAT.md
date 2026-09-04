# Batteriproffs: kod och B2B-funktioner

2026-09-05. Arbete på den separata grenen fix/order-integrity-20260904. Ingen ändring av butikens grafiska profil eller designförslaget v3. Ingen produktionsrelease eller push till huvudgrenen.

## Genomfört

- Tidigare beroendeuppdateringar behållna. Ny fullständig pnpm audit: 0 kända fynd, jämfört med 100 i huvudprojektets tidigare kontroll. Detta gäller förslagsgrenen; produktionsbutiken har inte uppdaterats.
- Jämförelse av högst tre offentliga artiklar: separat C5/C20, kemi, mått, tillgängliga pol- och viktuppgifter, momsval och beställningsstatus. Delbar länk. Okända värden visas som saknade.
- Kategorifilter för spänning, kemi, min/max kapacitet på vald mätgrund och maximala mått. Filter följer URL:en. Sorteringen blandar inte längre C5 och C20. Badge-sorteringen heter Utvalda.
- Gemensam sökning känner igen ett fåtal vanliga felstavningar av Sonnenschein. Maskin- och artikelnummer ändras inte genom bred stavningskorrigering.
- Offert från varukorgen: artiklar och antal följer med till kontaktformuläret. Servern kontrollerar offentliga artiklar, antal och aktuella listpriser. Kontaktbekräftelse skickas först när internt mejl accepterats.
- Kassan använder beställarmejlet för betalningsunderlag som standard, med val av annan adress. Fältetiketter och fel är programmässigt kopplade. Ordersammanfattningen kommer före formuläret på mobil.
- Inloggad kund kan välja en tidigare order för företags- och leveransuppgifter. Inga nya personuppgifter sparas i lokal webbläsarlagring. Gamla inköpsreferenser och portkoder kopieras inte automatiskt.
- Kundkontot inkluderar reserverade köp, behåller ägarskapskontrollen och levererar privata svar utan cache. Spårningsnummer länkas för PostNord/DHL.
- Utskrivbar ordersammanställning från kundens egna orderdata. Den skiljer reservation från debitering och är uttryckligen ingen faktura eller uppdaterad återbetalningsrapport.
- Retur-/reklamationsförfrågan kan startas från orderhistoriken med artikel och ärendetyp. Order, artikel och antal förifylls i kontaktformuläret. Ingen automatisk returgodkänning eller kreditering.
- Tillverkarens befintliga PDF-underlag lyfts fram på produktsidan där det finns. Relaterade artiklar väljs efter samma spänning/kemi och närliggande mått, utan löfte om utbytbarhet.
- Felaktig momshantering av produktfrakt rättad. Beställningsflaggor respekteras på kort och produktsidor. Registrerad beställningsstatus beskrivs utan anspråk på lagersaldo i realtid.
- Varukorg och sökmodal har dialogsemantik, tangentbordsfokus och fokusåterställning. Varukorgens ikonknappar har tillgängliga namn.
- Leveransregistrering kräver bekräftad debitering. Felobjekt från mejltjänsten kontrolleras. Leveransutskick använder idempotensnyckel och samma registrerade leverans skickas inte igen. Misslyckad schemaläggning av omdömesmejl markeras inte som lyckad.
- Admin visar avvikelser: ofullständiga rader/uppgifter, saknade kvittenser på nya ordermejl samt reservationer nära faktisk capture_before. En äldre reservation utan sluttid hänvisar till Stripe i stället för att påstå en fast sjudygnsgräns.
- Osäkra kopplingar för Nilfisk SC250, SC401 och SC500 borttagna från guide, produkttext och sökpris. Hjälpsidorna finns kvar och begär modell/passformskontroll. Inga nya ersättare har gissats.

## Kontroller

93 automatiska tester i 15 filer godkända. Befintliga 49 betalnings-/orderregressioner ingår. Produktionsbygge godkänt. Lint utan fel eller varningar. Ny beroendekontroll ger 0 fynd.

Testerna använder mockade externa tjänster. Inga verkliga betalningar, debiteringar eller mejlutskick har gjorts. Kassans preview har formulär men ingen betalning. API, inloggning, utskick, administration och Studio är blockerade i det isolerade reviewprojektet. Det är därför inte ett test av riktig Stripe-/Resend-leverans.

## Avgränsningar och kvarvarande arbete

- Mängdpris, paketpris, kredit, betalningsfrist och nya betalsätt behöver affärsbeslut. Förskottsfaktura behåller befintligt manuellt flöde.
- Leverantörens verkliga saldo och leveranstider kräver datakälla. Inga priser, vikter, polbilder, måttritningar eller passformer har hittats på. Övriga maskinmatchningar behöver fortfarande verifieras.
- Offertförfrågan går genom befintlig kontaktkanal. Ett sparat offertobjekt med versioner, godkännande och offertpris i kassan är inte infört.
- Returförfrågan är kopplad till order via formuläret, men har ingen ny ärendedatabas, bilduppladdning eller kundsynlig ärendestatus. Handläggningen sker via befintlig kontaktkanal.
- Avvikelser visas i admin när orderlistan läses. Externa driftlarm, bakgrundsövervakning och nya automatiska notifieringar är inte aktiverade.
- Bokföringsunderlag för förskottsfakturor och senare återbetalningar ingår inte i den nya ordersammanställningen.
- Betalningsändringarna måste genomgå verkligt Stripe-testköp, reservation/debitering, webhook och kontroll av mejlleverans i Resend före produktionsrelease. Reviewprojektet har bara tydligt ogiltiga testvärden.
- Mejltjänstens idempotensfönster är tidsbegränsat. Vid okänd utgång på äldre utskick eller misslyckad metadataregistrering måste loggen kontrolleras före nya utskick.

Nilfisk-underlag: [SC401 manual](https://www.nilfisk.com/media/zhdba1pd/au-sc401-instructions-for-use.pdf) och föregående granskningsrapport outputs/batteriproffs-kod-och-kopflode-20260905.md. För SC500 finns nu även Nilfisks originalbroschyr med batterifackets mått och katalogens batterikonfigurationer. Se produktunderlaget.

## Komplettering: produktbilder och passform

Originalunderlag kopplat till alla 20 artiklar. Sex Nordmax-datablad med C5/vikt/pol, exakta lokala Discover-artiklar och polunderlag, samt Exide GF-V/GF-Y. GF-V-vikter korrigerade konsekvent och GF-Y:s cykeltal är 450. Tolv originalproduktbilder hämtade för lokal granskning med artikelkällor och filhashar i docs/product-image-sources-20260905.json. Nya Nordmax-bilder publiceras när kommersiellt bildtillstånd är bekräftat. Extra vinklar för hela sortimentet är inte belagda; butikens befintliga bilder har inte bytts ut.

Nilfisk SC250/SC401/SC500 har nu konkret, källhänvisad information om batterisystem och utföranden, inte bara ett kontaktmeddelande. Tennant T3/T3+ har en dokumenterad koppling till två GF12076V för gelutförandet från serienummer 20000, enligt Tennants egen reservdelslista. Andra maskinkopplingar är märkta som alternativ att kontrollera.

NM875-8ET:s tidigare 175 Ah och DC-mått är rättade till ET-databladets 170 Ah och 260 × 180 × 279 mm. Beställning pausad i förslaget tills levererad variant bekräftats. EV305A:s totalhöjd är tvetydig mellan leverantörs- och tillverkardata och räknas därför inte som verifierad i måttfilter. GF-Y:s fullständiga suffix behöver bekräftas innan variantspecifik vikt/pol kan föras över. Discover-vikter från andra generationer borttagna.

Granskningslänk: https://batteriproffs-kodgranskning-2026090.vercel.app
Bild- och källrapport: ../../outputs/batteriproffs-produktunderlag-20260905.md

Slutverifiering: 8 publika reviewsidor kontrollerade med HTTP 200, noindex och förväntat innehåll. Tre API/Studio-rutter gav avsiktligt HTTP 503. Mobilbredd 320 px verifierad utan horisontellt överflöde. Kvitto i docs/review-verification-20260905.json.
