# Batteriproffs — Marknadsanalys: var vi slår in oss härnäst (2026-08-10)

**Fråga:** Vilka batterisegment säljer bäst online i Sverige där Batteriproffs har en realistisk chans att ta position — och vilka inköpspriser behöver vi från leverantören för att vara billigast med god marginal?

**Metod:** DataForSEO (sökvolymer Google Ads Sverige, keyword difficulty, live-SERP:er, konkurrenters rankade sökord och trafikestimat), Google Trends 5 år, prisinsamling från ~50 svenska butikssidor (två research-agenter, alla priser med käll-URL), leverantörens publika sortiment (battericentralen.se), samt vår egen orderdata (3 ordrar, alla organiskt Google via modell-/maskinsök).

---

## Sammanfattning — de tre besluten

1. **Fritid/husbil/husvagn/båt är nästa marknad.** Största kombinationen av volym (~5 500 sök/mån i klustret), svagast SERP av alla stora segment (Reddit, Amazon-produktsidor och tyska/kinesiska sajter i topp 10), leverantören har redan kategorin ("Batteri fritidsfordon"), och Google har redan valt spåret åt oss: batteriproffs.se rankar position 15 på "husvagnsbatteri" utan att vi försökt. Kräver privatläge i kassan + fraktlösning under ~300 kr.
2. **Bygg ut B2B-basen gratis under tiden.** Golfbil, åkgräsklippare, lastbil/traktor och UPS-ersättningsbatterier: SERP:arna är tagbara, leverantören har sortimentet, B2B-kassan funkar redan, och maskinside-playbooken är bevisat konverterande (3 av 3 ordrar).
3. **LiFePO4 är det strategiska hotet och chansen på 6–18 månader.** Litiumklustret är ~9 000 sök/mån, växer 4–5x på long-tails och 7x på fem år i Trends — och **det mest populära fordonsbatteriet på hela Prisjakt är redan ett LiFePO4 12V 100Ah (Eco-Worthy, 2 600 kr)**. Prisstegen är kines-D2C 2 600–3 400 → tomrum → Skanbatt 5 495: den svenska mellanpositionen på 3 500–4 500 med svensk support och garanti är ledig. Kräver ny produktlinje: fråga leverantören först, annars OEM-import.

**Avstå:** villabatteri/hemlagring (installatörsmarknad med ROT-logik), småbatterier/powerbanks (Batteriexpertens revir, annan logistik), bilbatteri som huvudattack i närtid (störst volym men kräver regnummer-databas, SKU-djup och pantlogistik — gate:ad till fas 3), permobil utan leverantörsavstämning (Battericentralen säljer själva i nischen).

---

## 1. Marknadskartan — uppmätta segment

Sökvolymer = Google Ads exakt volym Sverige/mån (aug 2026, 12-mån snitt). Kluster = summan av uppmätta varianter, viss intent-överlappning finns.

| Segment | Kluster/mån | Säsong | SERP-styrka | Logistik | Leverantör har? | Verdikt |
|---|---|---|---|---|---|---|
| Bilbatteri (start) | ~50 000 | Vinter (dec–jan 2x) | Medel–hård (men startmotor.se #1 visar att specialist kan) | Pall/paket 15–25 kg, pantretur | JA (start bil/lastbil) | Fas 3, gate:ad |
| Laddare/starthjälp/tillbehör | ~35 000 | Vinter | Hård på head (Clas O, Jula, CTEK) | Småpaket | JA (tillbehör) | Paket-attach, inte SEO-head |
| Litium/LiFePO4 | ~9 000 | Vår + växande året runt | Svag–medel (kines-D2C + nisch) | Paket 10–15 kg | OKÄNT — FRÅGA | Våg 3, strategisk |
| AGM (typ-sök) | ~9 500 | Vinterpeak | Svag (halva SERP:en är infosidor) | — | JA | Kategorisida + guide, tvärgående |
| Fritid/husvagn/husbil/båt | ~5 500 | Vår–sommar (apr–jul 2–4x) | SVAGAST (Reddit/Amazon/utland i topp) | Paket/halvpall 20–30 kg | JA ("fritidsfordon") | **VÅG 1** |
| MC/moped/ATV/snöskoter | ~2 700 | Extrem vår (apr–jun) | Svag (batteribolaget.nu #1, småspelare) | SMÅPAKET 2–6 kg | Ej listat — FRÅGA | Våg 2 |
| Sol 12V/off-grid (stuga/husvagn) | ~2 000 adresserbart | Vår–sommar | Svag (sunwind/sunlux nisch) | Paket | JA (gel/AGM = hemmaplan) | Ingår i våg 1+3 |
| Villabatteri/hemlagring | ~1 450 | Jämn | Installatörer + energibolag | Installation krävs | NEJ | **AVSTÅ** |
| Trädgård (åkgräsklippare m.m.) | ~640 | Extrem vår (juni 3x) | Medel–svag | Småpaket | Sannolikt (start/fritid) | Våg 1b, gratis |
| Lastbil/traktor | ~470 | Vinter | Medel | Pall | JA | Våg 1b (B2B-kassan klarar det idag) |
| UPS-ersättning + larm (7–9Ah) | ~250 | Jämn | Blandad intent (enheter vs celler) | Brevpaket <3 kg | JA (stationära) | Våg 1b, long-tail |
| Golfbil | ~140 | Vår + höst | Tagbar (Reddit + kinesiska sajter i topp) | Pall (4–6-pack) | JA (har produkterna!) | Våg 1b, gratis |
| Permobil/mobility | ~150 | Jämn | Svag (Reddit x2 i topp 10) | Paket, säljs i par | JA — MEN de säljer själva | Flaggad — stäm av först |
| Truck/traktion (befintligt) | ~700 | Jämn | Svag, offertstyrd bransch | Pall | JA (kärnan) | Behåll, prispublicering är vapnet |

**Keyword difficulty:** i princip 0 (av 100) på nästan samtliga segmentord — länkprofilerna i svenska batteri-SERP:er är genomgående svaga. Undantag: "batterier online" KD 23, "köpa bilbatteri" KD 9. Det betyder att innehåll + produktsidor kan ranka utan länkbygge, precis som truckbatteri-mätningen visade i juli.

**Trends 5 år (relativt index, Sverige):** lifepo4 1→7, agm batteri 4→7, solcellsbatteri 0→3, fritidsbatteri stabil, bilbatteri 29→36. Strukturell tillväxt ligger i litium, AGM och sol — inte i klassiska startbatterier.

---

## 2. Konkurrentkartan — vem tar trafiken och hur

Estimerad organisk trafik/mån (DataForSEO Labs, Sverige):

| Domän | Sökord | Est. trafik/mån | Modell |
|---|---|---|---|
| batterilagret.se | 1 895 | 51 900 | Bredd + fysiska butiker. Äger "batteri", "bilbatteri", "agm batteri", "batteriladdare" |
| batteriexperten.com | 3 777 | 31 100 | Bredast sortiment inkl småbatterier/powerbank (deras trafik är till stor del icke-fordonsbatterier + eget varumärkessök 18 100/mån) |
| batteriexpressen.se | 805 | 17 100 | Renodlad e-handelsspecialist: bil + litium + **regnummer-sök (pos 1 på "bilbatteri registreringsnummer", 1 600 sök/mån)** |
| batteribolaget.nu | 659 | 10 000 | Varta-fokus, pos 1 på "mc batteri" |
| sunlux.se | 421 | 9 800 | **Nischmodellen: äger husbil/sol/litium med bara 421 sökord.** Högst trafikeffektivitet av alla |
| startmotor.se | 915 | 8 900 | Specialist (startmotorer/generatorer) som tagit pos 1 på "bilbatteri" |
| batteripoolen.se | 689 | 6 400 | Distributör (Discover m.m.), alla priser bakom inloggning |
| inverterbutiken.se | 552 | 3 400 | Victron/off-grid-nisch |
| **batteriproffs.se** | **4** | **~30** | Rankar redan: husvagnsbatteri pos 15, fritidsbatteri-varianter 52–62 — allt pekar på /kategori/fritid-solenergi |

Två bevisade vinnarmodeller för oss att kopiera:
- **Sunlux-modellen** (nischägare): 9 800 besök/mån på 421 sökord genom att äga ETT kluster (husbil/sol/litium) totalt. Detta är mallen för våg 1+3.
- **Batteriexpressen-modellen** (funktionsdriven bredd): regnummer-sökaren är deras största organiska tillgång utanför brand. Detta är mallen för fas 3 (bil).

**Öppning bekräftad i prisdata:** truckbatteri är offertstyrt hos batteriexpressen (bekräftat: enbart offertformulär, "skicka bilder på typskyltarna"), batterilagret saknar kategorin, batteriexperten säljer bara startbatterier under truck-URL:en. Batteripoolen gömmer allt bakom inloggning. **Vi är i praktiken enda aktören med öppna priser på traktion — inklusive enda öppna Discover-priserna i Sverige.**

---

## 3. SERP-öppningarna i detalj (live-SERP:er aug 2026)

- **husbilsbatteri:** batterilagret #1, sedan forum (husbilsklubben), Skanbatt-litium via inverterbutiken, en Amazon-produktsida (#4), husbil.se-guide, litime.de (#6), Reddit (#7), basengreen (#10). En svensk kategorisida med riktigt sortiment + guide tar sig in här. Related searches: "Husbilsbatteri bodel", "AGM", "Litium" — **"bodelsbatteri" är termen att äga.**
- **fritidsbatteri (1 900/mån):** motonet #1, men ojanpera.se (#7) och batteribolaget.nu (#4) visar att småspelare rankar. Vi ligger 52 på varianten "fritidsbatteri husvagn" redan.
- **agm batteri (4 400/mån):** halva SERP:en är infosidor (Varta x2, CTEK, YouTube, content-sajter). En kommersiell kategorisida med köpguide har fritt fält — samma mönster som truckbatteri i juli.
- **mc batteri (1 600/mån):** batteribolaget.nu #1, batterioutlet-guide #8, pricerunner #9. Ingen jätte äger den. Related: "MC-batteri regnummer" — modellväljare/regnr är featuren även här.
- **båtbatteri/marinbatteri (960/mån):** marinkedjor (seasea, hjertmans, erlandsons) + en affiliate-sajt (moory #7). Medelsvår, tas via long-tails (startbatteri båt 260, förbrukningsbatteri båt 110).
- **batteri golfbil:** batteriexpressen #1, batteriexperten #2, sedan Reddit (#5) och två kinesiska fabrikssajter. Vi HAR produkterna (GC2-serien) — en /golfbil-landningssida + maskinsidor tar detta.
- **solcellsbatteri (2 900/mån):** kluvet mellan villainstallation (Vattenfall, Svea Solar, 1KOMMA5) och 12V off-grid (sunwind #1!). Vår väg är enbart 12V/24V-spåret: "solcellsbatteri 12V", stuga, husvagn, båt — gel/AGM är bokstavligen Sonnenscheins hemmaplan.
- **permobil batteri:** Permobil själva + Reddit x2 + **battericentralen.se (#6) — leverantören säljer här utan priser.** Nischen är tagbar men rör leverantörens egen kanal: stäm av innan vi går in.
- **ups batteri (210/mån):** SERP:en domineras av UPS-ENHETER (inet, komplett, atea). Ersättningsbatteri-nischen (12V 7–9Ah, 40 sök/mån + långsvans per modellnummer) är den vi tar — den ligger nära befintliga stationära sortimentet.
- **bilbatteri (14 800/mån):** startmotor.se #1 bevisar att specialister slår kedjorna. Men related searches ("Bilbatteri registreringsnummer", "Biltema", "Jula") visar vad som krävs: regnr-funktion + priskrig. Inte nu.

---

## 4. Prisbilden och vår position (verifierade priser, käll-URL:er i agentrapporterna)

### Där vi redan är billigast — bekräftat

| Produkt | Vårt pris (inkl) | Marknaden (inkl moms) | Vår position |
|---|---|---|---|
| GC2 6V 225Ah traktion (NM105-6ET 2 195 kr) | 2 195 | Trojan T-105: 4 728 (batteriexpressen). Noname GC2: 3 299 (batteriexperten, fraktfritt) | **Billigast i Sverige, 33 % under närmaste noname** |
| 12V 150Ah semi-traktion (NM1275-12ET 3 495 kr) | 3 495 | Trojan T-1275: 7 112 (batteriexpressen) | **Halva Trojan-priset** |
| Sonnenschein GF1250V (2 195 kr) | 2 195 | cleanware.se: 2 524 ex moms ≈ 3 155 inkl; golvakuten: 2 250–2 949 (momsläge oklart) | Billigast |
| Sonnenschein GF1276V (3 195 kr) | 3 195 | cleanware.se: ≈4 188 inkl; golvakuten ~3 250+ (oklar struktur) | Billigast |
| Sonnenschein GF12105V (4 495 kr) | 4 495 | cleanware.se: ≈5 250 inkl; golvakuten 4 988+ | Billigast |

Slutsats: **prisledarskapet håller i hela nuvarande katalog.** Städmaskins-/golvvårdskonkurrenterna (cleanware, golvakuten) ligger 15–30 % över oss och gömmer dessutom priser bakom momsväxlare och rabattnivåer.

### Nya segment — uppmätta marknadspriser (alla inkl moms, käll-URL:er i agentrapporterna)

| Segment | Representativ produkt | Uppmätt marknadsspann (lägst → högst) |
|---|---|---|
| Fritids-AGM 95–100Ah | Varta LA95 / Exide EP900 / Electronicx | Electronicx (Amazon) 1 799 → Varta LA95 2 610 (Batteri Online) → 4 686 (Batteriexpressen). Exide EP900: 3 678 → 6 476. Budget: Tudor Marine 80Ah 1 249 |
| Gelbatteri 110Ah fritid | Victron gel / Volt VPRO / Electronicx | Electronicx 1 741 → Volt VPRO 2 802 → Victron 110Ah fr. 3 780 |
| LiFePO4 12V 100Ah | Eco-Worthy / LiTime / Redodo / Skanbatt | Kines-D2C: 2 600 (Eco-Worthy) / 3 103 (LiTime) / 3 171 (Redodo) / 3 421 (Vipow) → nordiskt märke: Skanbatt 5 495, Ultramax 5 900. **Mellanpositionen 3 500–4 500 är tom** |
| Marin dual purpose | Exide ER550 115Ah / EP1200 140Ah | ER550: fr. 2 697 (Mekster). EP1200 140Ah: 4 004 → 7 010 |
| MC YTX9-BS | Yuasa original / kopior | Yuasa: 494 (Amazon) / 605 (Voltpower) → 999 (Batteriexperten). Kopior (Fulbat/Cartec): 350–578 |
| MC YTX14-BS | Yuasa / kopior | Yuasa: 769 (Batteri Online) → 1 199 (Batteriexperten). Kopior: 560–610 |
| Snöskoter/ATV YTX20L-BS | Yuasa | 1 266 (Amazon) → 1 655 (Batteriexpressen). **Rank 16 av alla fordonsbatterier på Prisjakt** |
| Startbatteri 74–77Ah | Varta E11 / Exide EA770/EB740 | E11: 1 353 (Lakkapää) → 2 209. EA770: 1 608 → 2 263. EB740: fr. 1 341 |
| UPS/larm 12V 7Ah | Yuasa NP7-12 | 349 kr (batteriexperten, 199 kr/st vid 100+), Qoltec 459 (evxab), Leoch 9Ah 399 (batterilagret) |
| Mobility 12V 73–75Ah | MK gel M24 SLD / noname AGM | 4 231 kr/st (batterinet), 3 999 kr (blimo, slutsåld) |
| Sol-AGM 12V 200Ah | AGM 200Ah | 4 750 kr inkl (solarlab) |
| Pylontech US5000 4,8 kWh | US5000C | 18 000 kr (offgridlagret, slutsåld) — tunn data |
| Villabatteri 10–15 kWh | — | Säljs INTE styckvis; 80 000–170 000 kr som installationspaket. Bekräftar AVSTÅ |

### Vad som faktiskt säljs online — Prisjakt topp-10 + Amazon (försäljningsproxy)

Prisjakts populäritetslista för HELA kategorin Fordonsbatterier (id 2190), verifierad mot produktsidornas rank:

1. **Eco-Worthy LiFePO4 12V 100Ah — 2 600 kr (litium!)**
2. Tudor Marine 80Ah dual — 1 249 kr (budget-fritid)
3. Exide Premium EA1000 100Ah — 1 749 kr (bil)
4. Varta LA95 95Ah AGM Dual Purpose — 2 610 kr (fritid)
5–10. Bilbatterier (Exide EB740/EA640, Varta LFS75/D24) + två start-stop (Varta Silver AGM 95Ah 2 990, Exide EFB EL700 1 724)

**Läsning:** 3 av topp 4 är fritid/litium — inte klassiska startbatterier. Det som säljs online är precis det våg 1 + våg 3 siktar på. MC-batterierna rankar 16/25/92 (snöskoter-YTX20L högst!). Start-stop-batterier (AGM/EFB) är bilsegmentets tillväxtdel.

**Amazon.se:** "bilbatteri" ger 20 000+ träffar; "fritidsbatteri" bara 270 — och där äger tyska Electronicx ALLT (topp 5 av 5, 1 600 recensioner på bästsäljaren, 1 799 kr för AGM 100Ah). Amazon är en möjlig framtida försäljningskanal för oss — fritidsluckan där är inte tagen av någon svensk aktör.

---

## 5. Förhandlingstabellen — målpriser och max inköpspris

**Modell:** dropship, kunden betalar frakt separat (antagande: leverantörens fraktkostnad ≈ vår fraktintäkt, nollsumma — STÄM AV, se frågelistan). Betalavgift ~1,5 % är inräknad. Formel: max inköp ex moms = målpris ex moms × (0,985 − marginal).

Marginalgolv: **35 %** är golvet för att gå "bra med plus" efter returer/support/svinn. **40 %** är förhandlingsmålet.

Prisprincip: 5–15 % under lägsta seriösa svenska konkurrent (Amazon-D2C räknas som prisgolv att förhålla sig till, inte matcha). Fri frakt ska kunna bakas in i konsumentpriserna — se sektion 8.

| Segment / produkt | Marknadspris (inkl) | VÅRT MÅLPRIS (inkl) | ex moms | Max inköp @35 % | Mål-inköp @40 % |
|---|---|---|---|---|---|
| GC2 6V 225Ah (befintlig) | 3 299–4 728 | 2 195 (behåll) | 1 756 | 1 115 | 1 027 |
| 12V 150Ah semi-traktion (befintlig) | 7 112 | 3 495 (behåll) | 2 796 | 1 775 | 1 636 |
| Fritids-AGM 12V 95–100Ah | 1 799 (Amazon-D2C) / 2 610 (lägsta märkes) → 4 686 | 2 395 | 1 916 | 1 217 | 1 121 |
| Gel 12V ~105Ah fritid (GF12105V finns!) | Victron 110Ah 3 780; ≈5 250 (gel-städ) | 4 495 behålls B2B; husbils-merch kräver AGM-alternativ under (2 395-raden) | 3 596 | 2 283 | 2 104 |
| Marin dual purpose 12V ~115Ah | ER550 fr. 2 697 → EP1200-klass 4 004+ | 2 595 | 2 076 | 1 318 | 1 214 |
| LiFePO4 12V 100Ah | Kines-D2C 2 600–3 421; Skanbatt 5 495 | 3 495 (svensk mellanposition) | 2 796 | 1 775 | 1 636 |
| MC YTX9-BS (Yuasa-klass) | Yuasa 494–999; kopior 350–578 | 549 | 439 | 279 | 257 |
| MC YTX14-BS | Yuasa 769–1 199; kopior 560–610 | 749 | 599 | 380 | 351 |
| Snöskoter/ATV YTX20L-BS | Yuasa 1 266–1 655 | 1 195 | 956 | 607 | 559 |
| Startbatteri bil 12V 74–75Ah | 1 341–2 263 (märkes) | 1 395 (fas 3) | 1 116 | 709 | 653 |
| UPS 12V 7Ah VRLA | 349–459 | 279 | 223 | 142 | 131 |
| Sol-AGM 12V 200Ah | 4 750 | 3 995 | 3 196 | 2 029 | 1 870 |
| Mobility 12V 73Ah gel (par-försäljning) | 3 999–4 231/st | 3 495/st, 6 795/par | 2 796 | 1 775 | 1 636 |

**OBS frakt i kalkylen:** konsumentmarknadens standard är fri frakt (Batteriexperten: alltid fraktfritt val; Batterilagret: fri frakt-banner; Batteri Online: fri över ~200 kr). Målpriserna ovan förutsätter att VÅR fraktkostnad per konsumentkolli ryms inom marginalen — därför är max inköp i praktiken (tabellvärdet − verklig fraktkostnad/kolli). Exempel: kostar leverantörens B2C-paket 150 kr är taket för fritids-AGM @35 % = 1 067 kr, inte 1 217 kr. Detta är förhandlingens viktigaste okända.

---

## 6. Frågelistan till leverantören

1. **Fritidsfordon-sortimentet:** vilka AGM/gel-modeller 70–140Ah för husbil/husvagn/båt, och inköpspriser? (Målnivåer i tabellen ovan.)
2. **Frakt för B2C (förhandlingens viktigaste fråga):** vad kostar det att skicka ETT batteri 20–30 kg som paket till privatperson? Marknadsstandarden är fri frakt, så kravet är ≤ ~200 kr/kolli för att fri frakt ska rymmas i målpriserna. Och: småpaket 2–6 kg (MC-klass) — där behövs ≤ ~60 kr.
3. **MC/moped/ATV:** har ni sortimentet (Yuasa eller motsvarande)? Om inte — vem är er grossist?
4. **LiFePO4:** kan ni leverera 12V 100/200Ah LFP? Inköp under ~1 650 kr för 100Ah är kravet för att möta kinesisk D2C med marginal.
5. **Startbatterier bil/lastbil:** ni listar kategorin — prislista? (Bara för fas 3-kalkylen, ingen brådska.)
6. **UPS/stationärt 7–9Ah:** inköp under ~140 kr/st?
7. **Permobil:** ni säljer själva i nischen via er sajt — är den öppen för oss eller er kanal? (Undvik kanalkonflikt INNAN vi bygger.)
8. **Spårningsnummer** per order automatiskt? (Dagens manuella väg skalar inte till konsumentvolym.)
9. **Avskärningstid "före 14"** — bekräfta (står i vår H1 och köpvillkor).
10. **Returavdraget 30 %** — bekräfta att er siffra matchar (vår är idag hämtad från Batteripoolens publika villkor).

---

## 7. Paket och erbjudanden (från uppmätt beteende)

- **Batteri + AGM-laddare-paket:** "batteriladdare" 9 900 sök/mån, "batteriladdare agm" finns som long-tail. Leverantören har laddare. Attach-erbjudande på produktsidan, inte egen SEO-satsning. **Bekräftat: INGEN av de sju granskade konkurrenterna säljer batteri+laddare-paket för fordonsbatterier** — differentiatorn är ledig.
- **Par- och set-priser:** alla våra 3 ordrar var 2-pack; golfbil köper 4–6 st. Visa "2-pack"-pris och "golfbils-set (6 st)" direkt.
- **Batterivatten + skötselkit** på traktionsordrar (1 000 sök/mån, sidan finns redan).
- **Fri frakt-tröskel** när fraktavtalet är omförhandlat (konkurrenterna: batteriexperten kör "alltid fraktfritt val", cleanware fri frakt över 995 kr ex).
- **Vinterförvaringsguide + underhållsladdare** som höstkampanj (säsongsdata: laddarsök 2x i nov–jan).
- **B2B-staffling** synlig på sidan (batteriexperten visar 199 kr/st vid 100+ öppet — vi kan göra samma i UPS/stationärt).
- **Regnr-/modellväljare** är fas 3-featuren (bil, sen MC). Batteriexpressens största organiska tillgång.

---

## 8. Vad som krävs innan konsumentkassan öppnas (våg 1-gate)

1. **Frakt: marknadsstandarden är FRI frakt eller ~50 kr** (uppmätt: Batteriexperten alltid fraktfritt val, ombud 49–59 kr; Batterilagret fri frakt; Batteri Online fri över ~200 kr; Granngården 49 kr/fri över 700). Dagens 695 kr platt är alltså inte "något dyr" — den är 10x fel för konsument. Gate: leverantörens verkliga B2C-paketkostnad ≤ ~200 kr/kolli så att fri frakt kan bakas in i målpriserna med bibehållen marginal. Utan det: fritidssegmentet byggs ändå men enbart B2B (uthyrare, marinor, campingar).
2. **Privatläge i kassan** (utan orgnr-krav) — flagga finns redan i koden som beslut, byggs när 1 är löst.
3. **Konsumentvillkor:** distansavtalslagen ger konsument 14 dagars ångerrätt — dagens B2B-villkor ("ingen ångerrätt", 30 % returavdrag) FÅR INTE visas för konsumentköp. Separat villkorsspår krävs. (B2B-reglerna behålls för orgnr-köp.) Benchmark: Batteri Online, som dominerar Prisjakts lägstapriser, kör 60 dagars returrätt som säljargument.
4. **Google Shopping-spärren** (misrepresentation) är oberoende av detta men värd att lösa före konsumentvolym — identitetsverifieringen ligger hos Joel.
5. Betalsätt: kort räcker för start (medvetet beslut står fast), men mät avbrutna köp — konsument utan Swish/Klarna är ett känt konverteringstapp. Beslutspunkt efter 60 dagar, inte nu.

---

## 9. Färdplan med gates (mätpunkter satta i förväg)

**Våg 1 (nu–okt): Fritid/husbil/husvagn/båt + gratis B2B-utbyggnad**
- Nya kategorisidor: /fritidsbatterier (hub), /husbilsbatteri (äg "bodelsbatteri"), /husvagnsbatteri, /batbatteri, /solcellsbatteri-12v, /golfbil, /akgrasklippare, /lastbil-traktor, /ups-ersattning
- Guider: "AGM, gel eller litium i husbilen?", "Välj rätt bodelsbatteri", "Dimensionera solcellsbatteri till stugan" (SERP:arna bevisar att guider rankar i alla tre)
- Sortiment: leverantörens fritids-AGM in (efter prissvar), GF-serien om-merchandisas mot husbil/husvagn (Sonnenschein ÄR premiumgel för husbil)
- **Gate för konsumentkassan:** frakt <300 kr förhandlad. Utan den: sidorna byggs ändå (B2B-köp funkar, husbilsuthyrare/marinor är företag), konsumentkassan väntar.
- **Mätpunkt 15 okt:** rankar vi topp 20 på husvagnsbatteri/fritidsbatteri/husbilsbatteri? Om ja → Ads-test 50 kr/dag på fritid. Om nej → analysera innan mer byggs.

**Våg 2 (sep–dec): MC/moped/ATV/snöskoter**
- Gate: leverantörssvar med ≥35 % marginal + paketfrakt ≤129 kr. Utan det: skjut till våren (säsongen toppar april–juni — lansering senast mars ger full säsong).
- Modellväljare light: "batteri till [MC-modell]"-sidor enligt maskinside-playbooken.

**Våg 3 (Q4 2026–Q2 2027): LiFePO4-linjen**
- Gate: inköp 12V 100Ah ≤1 650 kr (annars går det inte att möta LiTime-nivån med 40 %).
- Position: "svenskt bolag, svensk support, 5 års garanti, snabb leverans" mellan kines-direkt och Victron-premium.
- Säljs in mot våg 1-publiken (husbil/båt/sol) — det är samma kunder som uppgraderar.

**Fas 3 (2027, gate:ad): Bilbatteri**
- Gate 1: fritid + MC levererar ≥20 B2C-ordrar/mån sammanlagt.
- Gate 2: leverantörens startbatteripriser tål 25–30 % marginal under Biltema-nivå.
- Gate 3: regnr-API kalkylerat (biluppgifter.se m.fl. säljer datan).
- Utan alla tre: bilbatteri förblir long-tail (lastbil/traktor B2B tas redan i våg 1b).

**Löpande:** publicera priser överallt (branschens offertvägg är vår differentiator), maskinsidor på volym (bevisat konverterande), passformsgarantin framhävs (B2B-köparens verkliga rädsla är fel modell, inte priset).

---

## 10. Antaganden att motbevisa

1. Leverantörens B2C-paketfrakt går att få ≤ ~200 kr/kolli för 20–30 kg (kravet för fri frakt-modellen). UPPMÄTT på marknaden: fri frakt är standard, så antagandet "kunden betalar frakt separat" håller INTE i konsumentsegmenten.
2. Leverantören kan/vill leverera fritids-AGM till priser i tabellen (deras kategori finns — priserna är okända).
3. Kinesisk D2C-nivå för LiFePO4 100Ah: UPPMÄTT 2 600–3 421 kr (Eco-Worthy/LiTime/Redodo/Vipow, aug 2026). Antagandet är att nivån inte kraschar under ~2 200 inom 12 mån; prispress nedåt är trolig.
4. Sonnenschein-/GC2-prisledarskapet gäller även mot butiker vi inte hittat (de största är täckta).
5. Prisjakt-popularitet ≈ försäljningsvolym online (proxy, inte kassadata).

*Rådata: fullständiga prisrapporter med alla käll-URL:er ligger i `prisdata-konsument-2026-08.md` och `prisdata-b2b-2026-08.md` i samma mapp. SEO-rådata (vol/KD/trends/SERP/konkurrenter, JSON) i sessionens scratchpad. DataForSEO-kostnad för hela körningen: ~0,75 USD.*
