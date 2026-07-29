import { publicProducts } from "./products"

/**
 * Kunskapsbanken.
 *
 * Ämnena är valda på riktig sökdata (DataForSEO, Sverige, juli 2026), inte på
 * gissningar. Volymerna är små i absoluta tal — "vad kostar ett truckbatteri"
 * ligger på tio sökningar i månaden — men konkurrensindexet är 14, alltså nästan
 * ingen konkurrens, och frågan är köpnära. Tre av åtta relaterade sökningar på
 * truckbatteri innehåller ordet pris.
 *
 * PRISER SKRIVS ALDRIG IN I TEXTEN. De hämtas ur lib/products.js via
 * `prisFor()`, så en prisändring slår igenom i artiklarna av sig själv. En
 * artikel med ett inaktuellt pris är värre än ingen artikel: den är just den
 * sorts sida en inköpare mäter er trovärdighet mot.
 */

function produkt(slug) {
  return publicProducts.find((p) => p.slug === slug) || null
}

/** Pris inkl. moms, formaterat. Returnerar null om produkten utgått. */
export function prisFor(slug) {
  const p = produkt(slug)
  return p ? new Intl.NumberFormat("sv-SE").format(p.price) + " kr" : null
}

/** Billigaste priset i en kategori, för spann i texten. */
export function prisSpann(kategori) {
  const priser = publicProducts.filter((p) => p.category === kategori).map((p) => p.price)
  if (!priser.length) return null
  const f = (n) => new Intl.NumberFormat("sv-SE").format(n)
  return { min: f(Math.min(...priser)), max: f(Math.max(...priser)) }
}

export const artiklar = [
  {
    slug: "vad-kostar-ett-truckbatteri",
    title: "Vad kostar ett truckbatteri?",
    seoTitle: "Vad kostar ett truckbatteri? Priser 2026 | Batteriproffs",
    ingress:
      "Kort svar: mellan några tusen kronor och långt över hundra tusen, beroende på om du behöver ett blockbatteri eller ett cellbatteri till en större truck. Här är hur du vet vilket av dem du har.",
    metaDescription:
      "Vad kostar ett truckbatteri? Blockbatterier ligger på några tusen kronor, cellbatterier till större truckar på tiotusentals. Så vet du vilket du behöver.",
    uppdaterad: "2026-07-29",
    lastid: 4,
    sektioner: [
      {
        rubrik: "Det finns två helt olika saker som kallas truckbatteri",
        stycken: [
          "Prisspannet ser orimligt brett ut tills man vet att ordet täcker två olika produkter. Ett cellbatteri byggs av 2V-celler i ett stålkar, väger flera hundra kilo och sitter i motviktstruckar och större staplare. Ett blockbatteri är ett färdigt batteri i ett hölje, i 6V, 8V eller 12V, och sitter i pallyftare, ledstaplare, saxliftar och städmaskiner.",
          "Cellbatterierna är de som kostar tiotusentals kronor. Blockbatterierna är de vi säljer, och de ligger i ett helt annat spann.",
        ],
      },
      {
        rubrik: "Så vet du vilket du har",
        stycken: [
          "Titta på batteriet. Ser du ett stålkar med en rad separata celler som var och en har en egen propp, är det ett cellbatteri. Ser du ett eller flera fristående batterier med två poler var, ungefär i storlek som ett stort bilbatteri, är det blockbatterier.",
          "Ett annat sätt: läs typskylten på maskinen. Står det 24V och maskinen är en pallyftare eller städmaskin, är det nästan alltid fyra 6V-blockbatterier i serie.",
        ],
      },
      {
        rubrik: "Vad blockbatterier kostar hos oss",
        prislista: [
          { slug: "nm105-6et", vad: "6V 225 Ah, det vanligaste i pallyftare och städmaskiner" },
          { slug: "nm125-6et", vad: "6V 240 Ah, samma mått men mer kapacitet" },
          { slug: "nm875-8et", vad: "8V 175 Ah, vanligt i 48V-system" },
          { slug: "nml16h-et", vad: "6V 420 Ah, för långa arbetspass" },
        ],
        stycken: [
          "Priserna är inklusive moms och står öppet på varje produktsida. Frakt tillkommer med 695 kr oavsett orderstorlek.",
          "Att vi skriver ut priserna är ovanligt i den här branschen. Fyra av de sex största konkurrenterna visar inget pris alls utan kräver att du fyller i ett offertformulär eller loggar in först.",
        ],
      },
      {
        rubrik: "Vad som styr priset",
        punkter: [
          "Kapacitet i amperetimmar. Det är den enskilt största faktorn.",
          "Teknik. Öppna blybatterier är billigast men kräver vattenpåfyllning. Gelbatterier kostar mer och är helt underhållsfria.",
          "Antal. En 24V-installation behöver fyra 6V-batterier, inte ett.",
          "Mått. Batteriet måste få plats i befintligt utrymme, vilket ibland utesluter det billigaste alternativet.",
        ],
      },
      {
        rubrik: "Glöm inte kostnaden för att bli av med det gamla",
        stycken: [
          "Ett uttjänt blybatteri är miljöfarligt avfall och får inte slängas som vanligt avfall. Att lämna det på återvinningscentral eller anlita någon som hämtar kostar tid och ibland pengar, och som företag har ni dessutom dokumentationsansvar för farligt avfall.",
          "Hos oss ingår det. Vi tar hand om ditt gamla batteri utan kostnad när du köper ett nytt, så den posten försvinner ur kalkylen.",
        ],
        lank: { href: "/atervinning", text: "Så fungerar återvinningen" },
      },
      {
        rubrik: "Räkna på kronor per cykel, inte på inköpspriset",
        stycken: [
          "Ett batteri som kostar tusen kronor mer men håller femhundra cykler längre är billigare i drift. Ett blockbatteri i cyklisk drift håller normalt mellan 1 200 och 1 500 cykler vid 50 procents urladdningsdjup, vilket för en maskin som används varje arbetsdag betyder ungefär fem år.",
          "Djupurladdning kortar livslängden snabbt. Kör du regelbundet batteriet helt tomt kan du halvera antalet cykler.",
        ],
      },
    ],
    relaterade: ["traktionsbatteri-eller-startbatteri", "gelbatteri-eller-oppet-blybatteri"],
  },

  {
    slug: "traktionsbatteri-eller-startbatteri",
    title: "Traktionsbatteri eller startbatteri: vad är skillnaden?",
    seoTitle: "Traktionsbatteri vs startbatteri: skillnaden förklarad | Batteriproffs",
    ingress:
      "Ett startbatteri ger en kort, kraftig strömstöt och ska sedan laddas direkt. Ett traktionsbatteri ska tömmas långsamt och laddas upp igen, om och om igen. Sätter du fel typ i maskinen håller det inte ett år.",
    metaDescription:
      "Skillnaden mellan traktionsbatteri och startbatteri: konstruktion, användning och vad som händer om du väljer fel. Guide från Batteriproffs.",
    uppdaterad: "2026-07-29",
    lastid: 3,
    sektioner: [
      {
        rubrik: "Konstruktionen skiljer sig i plattorna",
        stycken: [
          "Ett startbatteri har många tunna plattor. Stor sammanlagd yta ger hög strömstyrka under några sekunder, precis vad en startmotor behöver. Men tunna plattor tål inte att tömmas djupt. Gör man det bryts de ned snabbt.",
          "Ett traktionsbatteri har färre och betydligt tjockare plattor. Det ger lägre toppström men gör att batteriet tål att laddas ur till hälften eller mer, tusentals gånger.",
        ],
      },
      {
        rubrik: "Vad som händer om du väljer fel",
        stycken: [
          "Sätter du ett startbatteri i en städmaskin får du full effekt de första veckorna. Sedan faller kapaciteten snabbt, och efter några månader räcker laddningen inte ett arbetspass. Batteriet är då förbrukat, inte trasigt: det har använts på ett sätt det aldrig var byggt för.",
          "Åt andra hållet är felet mindre dramatiskt. Ett traktionsbatteri i en bil fungerar, men ger sämre kallstart och kostar mer än nödvändigt.",
        ],
      },
      {
        rubrik: "Semitraktion är mellanläget",
        stycken: [
          "Semitraktionsbatterier, ibland kallade förbrukningsbatterier, ligger mellan de två. De tål cyklisk användning bättre än startbatterier men inte lika hårt som riktiga traktionsbatterier. De sitter ofta i husvagnar, båtar och mindre arbetsmaskiner där behovet är blandat.",
        ],
      },
      {
        rubrik: "Så vet du vad du behöver",
        punkter: [
          "Ska batteriet starta en förbränningsmotor: startbatteri.",
          "Ska batteriet driva maskinen under hela arbetspasset och laddas varje kväll: traktionsbatteri.",
          "Ska batteriet driva belysning och kyl i en husvagn över en helg: semitraktion eller fritidsbatteri.",
        ],
        stycken: [
          "Är du osäker, ring oss med maskinens fabrikat och modell samt spänning och kapacitet på det batteri som sitter i nu. Vi svarar själva i telefonen.",
        ],
      },
    ],
    relaterade: ["vad-kostar-ett-truckbatteri", "gelbatteri-eller-oppet-blybatteri"],
  },

  {
    slug: "gelbatteri-eller-oppet-blybatteri",
    title: "Gelbatteri eller öppet blybatteri: vilket ska du välja?",
    seoTitle: "Gelbatteri eller öppet blybatteri? Så väljer du | Batteriproffs",
    ingress:
      "Öppna blybatterier är billigare i inköp men kräver att någon fyller på vatten. Gelbatterier är underhållsfria och kostar mer. Valet handlar mindre om teknik än om vem som ska sköta dem.",
    metaDescription:
      "Gelbatteri eller öppet blybatteri? Skillnad i pris, underhåll, livslängd och laddning. Så väljer du rätt till lift, städmaskin eller pallyftare.",
    uppdaterad: "2026-07-29",
    lastid: 4,
    sektioner: [
      {
        rubrik: "Den praktiska skillnaden",
        stycken: [
          "Ett öppet blybatteri har flytande syra och avger gas vid laddning. Vattnet som förångas måste fyllas på med avjoniserat vatten, normalt var femte till sjunde laddningscykel. Missar man det torkar plattorna och batteriet förstörs.",
          "Ett gelbatteri har elektrolyten bunden i en gel. Det är helt slutet, kräver ingen påfyllning, kan monteras i vilket läge som helst och kan inte läcka syra.",
        ],
      },
      {
        rubrik: "Så här skulle jag välja",
        punkter: [
          "Har ni en person med ansvar för maskinunderhåll som faktiskt gör det varje månad: öppet blybatteri. Lägre pris, längre livslängd om det sköts.",
          "Byter maskinerna förare ofta, eller finns ingen som äger underhållet: gelbatteri. Det som aldrig behöver skötas kan inte missas.",
          "Står maskinen där folk vistas, eller lutar den under drift: gelbatteri. Inget gasande, ingen syra som kan rinna.",
          "Ska batteriet stå oanvänt långa perioder: gelbatteri. De självurladdar långsammare.",
        ],
      },
      {
        rubrik: "Laddaren måste matcha",
        stycken: [
          "Det här missas ofta och är dyrt. Ett gelbatteri får inte laddas med en laddare avsedd för öppna blybatterier. Laddningsspänningen blir för hög, gelen torkar ut och batteriet är förstört inom några månader.",
          "Gelbatterier vill ha max 14,4 V för ett 12V-batteri vid 20 grader, med temperaturkompensering. Byter du från öppet till gel måste du byta eller ställa om laddaren samtidigt.",
        ],
      },
      {
        rubrik: "Vad de kostar hos oss",
        prislista: [
          { slug: "nm105-6et", vad: "Öppet blybatteri 6V 225 Ah" },
          { slug: "evgc6a-a-m8", vad: "6V 220 Ah, samma storleksklass" },
          { slug: "gf-12-105v", vad: "Gelbatteri 12V 105 Ah (C5)" },
          { slug: "gf-12-160v", vad: "Gelbatteri 12V 160 Ah (C5), störst i sortimentet" },
        ],
        stycken: [
          "Räkna på hela livslängden och inte bara på inköpet. Ett öppet batteri som torkar för att ingen fyllt på vatten blir dyrare än ett gelbatteri som kostade mer men överlevde.",
        ],
      },
    ],
    relaterade: ["vad-kostar-ett-truckbatteri", "traktionsbatteri-eller-startbatteri"],
  },
]

export function artikelBySlug(slug) {
  return artiklar.find((a) => a.slug === slug) || null
}
