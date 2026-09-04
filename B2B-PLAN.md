# B2B och beroenden, 2026-09-05

Joel har bett oss genomföra det som går utan affärsbeslut. Arbetet sker på fix/order-integrity-20260904 och levereras till det isolerade reviewprojektet. Ingen ändring av grafisk profil, produktion, huvudgren, kreditvillkor eller autentiseringsmodell.

1. Behåll tidigare beroendeuppdateringar och regressionstester. Ny audit: 0 fynd.
2. Jämför högst tre offentliga produkter, med separata C5/C20-värden, mått, kemi, poluppgifter, priser och beställningsstatus. URL kan delas. Okända värden visas som saknade.
3. Filter för kemi, kapacitet med vald mätgrund och maximala mått. Bevara filter i URL. Relaterade artiklar väljs efter gemensamma specifikationer, utan passformslöfte.
4. Offertförfrågan från varukorg via befintlig kontaktkanal. Servern verifierar offentliga artiklar och antal. Inget nytt pris eller kreditlöfte. Inga riktiga testutskick.
5. Återanvänd leverans- och företagsuppgifter från en vald tidigare order, efter befintlig inloggning och uttryckligt val. Ingen ny personuppgiftslagring i webbläsaren. Koppla etiketter/fel till kassafält; e-post för underlag kan följa beställarens adress. Visa sammanfattning före betalning på mobil.
6. Kundkonto: reserverade ordrar, spårningslänkar, utskrivbar ordersammanställning och förifylld orderfråga/returförfrågan. Ingen automatisk retur eller kreditering.
7. Leveransregistrering får bara ske efter bekräftad debitering. Kontrollera mejltjänstens felobjekt och använd idempotens vid återförsök. Detta fortsätter den tidigare godkända orderrättningen.
8. Visa befintliga tillverkardokument och korrekt moms/frakt. Respektera beställningsflaggan. Inga påhittade datablad, bilder, vikter, lagersaldon eller maskinmatchningar.

Verifiering: riktade tester av filter, offertindata, kontots ägarskap/status och fel/återförsök i leveransflödet; befintliga betalningsregressioner; lint och produktionsbygge; isolerad preview och HTTP/UI-kontroll. Riktigt Stripe-testköp och mejlleverans kräver separat testmiljö före produktionsrelease.

Antaganden: lib/products.js är fortsatt pris- och produktkälla; befintligt kontaktflöde är offertkanalen; befintlig signerad session räcker för återbruk av kundens egna uppgifter. Kredit, mängdpris, leverantörssaldo och ny passformsdata avvaktar verifierat underlag.
