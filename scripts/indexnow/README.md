# IndexNow för Batteriproffs

`pnpm build` skapar `public/indexnow-manifest.json` före Next-bygget. Manifestet
har canonical URL, SHA-256 per sida och `VERCEL_GIT_COMMIT_SHA`. Vid lokalt bygge
används checkoutens HEAD. Ett Vercel Production-bygge måste ha systemvariabeln
`VERCEL_GIT_COMMIT_SHA` tillgänglig. Den genererade filen ska inte committas.

## Första körningen

Efter att workflow och manifest har deployats på www-domänen, kör på default
branch (main) med den exakta live-revisionen:

```sh
gh workflow run indexnow.yml --repo joelstolt/batteri --ref main \
  -f revision=FULL_40_CHARACTER_LIVE_COMMIT_SHA \
  -f dry_run=true -f initial_products_bootstrap=true
```

Kontrollera Actions-sammanfattningen. För sortimentet 2026-09-21 ska den visa
exakt 20 produkt-URL:er och inga dolda testartiklar. Kör samma kommando med
`-f dry_run=false` för att skicka. Detta bootstrap-val skickar bara produkterna
som nyligen ändrats. Övriga katalogsidor sparas som startvärden utan historisk
notifiering. Flaggan gör ingen specialbehandling när ett tidigare kvitto finns.

En lyckad notifiering innebär HTTP 200 och en sparad `indexnow-state`-gren.
Kontrollera båda i Actions. HTTP 202 betyder väntande nyckelvalidering: scriptet
försöker tre gånger och failar sedan utan att kvittera. Kör igen senare vid 202.
En lyckad IndexNow-notifiering garanterar inte indexering eller högre placering.

Utan baseline visar det första automatiska deployeventet `ACTION REQUIRED` och
skickar inget. Det är förväntat innan den manuella första körningen ovan.

## Efterföljande deployer

Workflow reagerar bara på lyckad `Production` från `vercel[bot]` i rätt repo.
Koden checkas alltid ut från betrodd default branch. Manifest/state är enbart
JSON-data; ingen kod checkas ut eller körs från deployment-SHA eller state-gren.

1. Matcha live-manifestets revision mot deployment-eventets SHA (begränsad retry).
2. Kontrollera ownership-textfilen på canonical-domänen.
3. Läs senaste kvitterade manifest från `indexnow-state`, med GitHub API och
   inbyggd `GITHUB_TOKEN` (`contents: write`, ingen ny privat secret).
4. Diffa nya, ändrade och borttagna adresser. Verifiera dem live och kontrollera
   därefter revisionen igen. Nya/ändrade sidor måste ge 200; borttagna får även
   ge 404/410 eller redirect inom samma värd. Dolda produkter kan ge 200 med
   noindex och skickas som borttagna så sökmotorn kan upptäcka noindex.
5. Skicka diffen till IndexNow. Tom diff skickar inget. Spara state först efter
   HTTP 200, eller uppdatera revisionsmarkören om katalogen är helt oförändrad.

GitHub concurrency serialiserar notifieringar och avbryter inte pågående körning.
En icke-fast-forward state-write avvisas, så en annan kvitterad baseline skrivs
inte över. Processfel mellan accepterad POST och state-save kan ge omsändning
vid rerun; exakt-en-gång kan inte garanteras. Revisionen kontrolleras precis före
POST, men Vercels alias kan naturligtvis bytas av en annan deploy därefter.
Ett gammalt event som redan ersatts failar utan notifiering.

State skapas som orphan-gren med bara manifest, README och minimal `vercel.json`
med `git.deploymentEnabled: false`. Main har också ett explicit undantag för
`indexnow-state`. Ingen global Vercel-inställning ändras.
Konfiguration: https://vercel.com/docs/project-configuration/git-configuration

## Omfattning och ändringssignal

68 sidor i dagens manifest: 20 produkter, 5 kategorier, 33 maskinsidor, ett
maskinindex, 3 ersättningssidor, 5 användningssidor och startsidan. Exakt antal
följer data; det är inte en sitemap-kopia.

Hasharna omfattar publika produktfält, relevanta produkturval, relaterade kort,
katalogsidans data, produktbildernas lokala filbytes och relevanta rendering-,
schema- och delade layoutkällor. Revision, klockslag, omdömen och orderhistorik
påverkar inte hasharna. Prisändring i en produkt ändrar inte orelaterade kategorier.
En ändring av en gemensam sidmall kan däremot ändra alla sidor som använder den.

Fristående guide-/informationssidor, CSS, externa bilders bytes, externa dokument
som byter innehåll under samma URL samt dynamiska omdömen/order ingår inte i detta
katalogflöde. Byt extern resurs-URL när dess innehåll ändras. Nya sidtyper och
nya datakopplingar behöver läggas till i `catalog.mjs`, template-listan i
`generate.mjs` och URL-valideringen i `core.mjs`. Sidcopy i andra importerade
komponenter än template-listan behöver också läggas till där för att upptäckas.

## Lokal verifiering

```sh
pnpm indexnow:manifest
pnpm indexnow:test
```

Testerna använder faktisk publik katalog och mockad HTTP. De skickar inga anrop
till IndexNow eller GitHub. Generatorn startar ingen Next-server.
