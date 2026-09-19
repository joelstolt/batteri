# Batteriproffs: kassa, produkter och SEO, 2026-09-19

## Mål och godkännande
Joel har godkänt samtliga sex förslag i granskningen och vill därefter gå igenom SEO. Leverera förbättringarna till https://www.batteriproffs.se via projektets befintliga Vercel-flöde. Ta fram en separat prioriterad SEO-genomgång med svenska sökdata. Inga blockerande produktfrågor.

## Verifierade utgångspunkter
- Källa: /Users/joelstolt/Desktop/Dev/clients/batteriproffs, joelstolt/batteri, main. Roten har en sedan tidigare modifierad intern worktree; den lämnas orörd.
- Next.js 16, React 19, Tailwind 4, pnpm-lock.yaml. Vercel bygger main automatiskt. Befintliga Stripe-/Resend-inställningar finns; hemligheter skrivs aldrig i dokumentation.
- Stripe PaymentIntent-metadata lagrar ordern. Kortbetalning använder manual capture. Detta beteende ändras inte.
- Kassan har 16 synliga textfält före kortfält, 9 obligatoriska. Momsnummer beräknas redan. Samma e-post och adress för betalningsunderlag är redan default.
- Produktpriser lagras inklusive moms, frakt 695 kr inklusive moms per ordinarie order. Kassatotalen stämmer; tilläggsmeddelandet följer inte valt momsläge.
- NM105 är öppet bly men får gel i SEO-titel och kategorinamn. Återkommande generell Trojan-text behöver begränsas till verifierbara modellspecifika fakta.
- Ett verifierat maskinutförande finns: Tennant T3/T3+ gel 12V/76Ah från serienummer 20000, 2 st GF12076V. Originalmanual ska kontrolleras före publicerad paketrekommendation.

## Antaganden och gränser
1. Befintligt Stripe-konto och orderformat ska fortsätta användas. Inga nya betalmetoder, kreditköp, nycklar eller kundkonton införs.
2. Extra bokförings- och leveransfält ska vara kvar men döljas tills de behövs; befintliga uppgifter återfyllda från tidigare order ska förbli synliga eller tydligt sammanfattade. Valideringsfel ska öppna rätt fältgrupp och kunna fokuseras.
3. API-fel får fortsatt visa ett fel och behålla kundens uppgifter. Befintlig idempotens, kontrollerade priser och hantering av ändrad varukorg bevaras.
4. Antalval får aldrig innebära automatiskt löfte om maskinpassform. Endast dokumenterad modell, variant och antal får kallas verifierat paket.
5. Produktdata om höjd, anslutning och ersättningsmodeller måste stödjas av produktunderlag. Osäkra varianter fortsätter vara spärrade.
6. SEO-genomgången gäller Sverige, svenska och köp av befintliga industri-, traktion-, gel- och AGM-batterier för företag. Sökord väljs efter aktuella data och faktisk sortimentspassning; befintliga URL:er bevaras.

## Plan
1. Skapa isolerad git-worktree från aktuell main och dokumentera arbetet här.
2. Förenkla CheckoutContent: extra uppgifter i tillgängliga expanderbara grupper, korrekt återfyllning/felöppning, adress-autofyll, kortare mobil sammanfattning, offertlänk och reservationstext vid betalning.
3. Rätta CartToast med befintligt momskontext.
4. Förbättra ProductPageContent: kompakt mobil bild, snabbfakta, antal-input/snabbval, total inklusive frakt, primär köpknapp före utökade dokument, tydlig garanti och verifierat Tennant-paket.
5. Rätta batteribenämning i kategori/titel och ersätt generella Trojan-påståenden med korrekta modellspecifika hänvisningar.
6. Kör relevanta tester, lint och produktionsbygge. Oberoende granskning av ändringar.
7. Push/deploy enligt befintligt Vercel-flöde; kontrollera faktisk version och HTML med curl samt mobil/dator i webbläsare.
8. Leverera SEO-rapport med verklig volym/KD och rankning där data finns. Skilj hypoteser från uppmätt data och indexeringsfel från redaktionella förbättringar.

## Verifiering
- Tester för momsbelopp, antal/gränser, ordertotal/frakt och expanderbara grupper som visar valideringsfel och återfyllda data.
- Befintliga order-/betalningstester och lint måste fortsätta passera. Inga levande kundköp, debiteringar eller testmejl behövs för denna UI-runda; befintligt betalningsflöde ändras inte.
- pnpm build med projektets konfiguration och miljö. Inga dev-servrar.
- Efter deploy: HTTP 200, korrekt canonical/indexering och nytt innehåll på /produkt/nm105-6et, /produkt/gf-12-076v, /batteri-till/tennant-t3-t3-plus, /kategori/stadmaskiner och /kassa.
- Webbläsare: 390x844 samt desktop. Antalval 1/4/gränsvärden, momsväxling, varukorg, korrekt total 9475 kr inklusive moms för 4 NM105 med frakt, exklusive moms 7580 kr, dolda extra fält öppningsbara. Inga kort eller personuppgifter skickas.
- Rapporterat slutkvitto: live-URL, vad som är deployat, pushstatus, testutfall och eventuella kvarstående begränsningar.
