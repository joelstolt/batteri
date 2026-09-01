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
          "Är du osäker, chatta med oss och ange maskinens fabrikat och modell samt spänning och kapacitet på det batteri som sitter i nu.",
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

  /* ─────────────────────────────────────────────────────────────
     Fritidsklustret, tillagt 2026-08-10.

     Ämnena kommer ur SERP-mätningen samma dag: relaterade sökningar
     på husbilsbatteri är AGM, bodel, litium och gel, och halva
     förstasidan består av forumtrådar och guider i stället för
     butikssidor. Där rankar innehåll.

     Litiumartikeln säljer en produkt vi inte har. Det är avsiktligt.
     Frågan ställs ändå, och en ärlig jämförelse som slutar med att vi
     avråder från oss själva i ett av fallen är mer värd än en artikel
     som låtsas att valet är enkelt.
     ───────────────────────────────────────────────────────────── */

  {
    slug: "agm-gel-eller-litium-i-husbilen",
    title: "AGM, gel eller litium i husbilen?",
    seoTitle: "AGM, gel eller litium i husbilen? Så väljer du | Batteriproffs",
    ingress:
      "Tre batterityper, tre helt olika prislappar och en massa tvärsäkra åsikter i husbilsforumen. Här är vad som faktiskt skiljer dem åt, och när det ena är rätt val framför det andra.",
    metaDescription:
      "AGM, gel eller litium till husbilens bodel? Skillnader i livslängd, vikt, laddning och pris, och vilket som passar ditt system.",
    uppdaterad: "2026-08-10",
    lastid: 6,
    sektioner: [
      {
        rubrik: "Det är tre svar på samma fråga",
        stycken: [
          "Alla tre klarar jobbet i en bodel: att driva kylskåp, belysning och vattenpump när du står fritt, och att tåla att tömmas och laddas om igen hundratals gånger. Skillnaden ligger i hur många gånger, hur mycket de väger och vad resten av systemet måste kunna.",
          "AGM och gel är båda blybatterier. Skillnaden mellan dem är hur syran är bunden: i AGM sitter den i en glasfibermatta, i gel är den stelnad. Litium är en helt annan kemi, oftast LiFePO4, och beter sig annorlunda på nästan varje punkt.",
        ],
      },
      {
        rubrik: "AGM: tål effektuttag och vibration",
        punkter: [
          "Ger hög ström utan att spänningen dyker, vilket spelar roll om du har växelriktare eller bogpropeller.",
          "Tål vibration bra, alltså rätt val i ett fordon som körs mycket på dålig väg.",
          "Laddas med ungefär samma spänning som ett vanligt blybatteri, så befintlig laddare räcker oftast.",
          "Tappar mer kapacitet än gel om det får stå urladdat länge.",
        ],
      },
      {
        rubrik: "Gel: tål djup urladdning och långa stillestånd",
        punkter: [
          "Klarar fler cykler än AGM när urladdningen är djup, alltså det typiska bodelsmönstret.",
          "Låg självurladdning, vilket gör den bättre om husbilen står oanvänd mellan turerna.",
          "Kräver lägre laddspänning. Står laddaren på öppet bly torkar gelen sakta ut, och då är batteriet förstört.",
          "Ger inte lika hög toppström som AGM, så en stor växelriktare kan bli begränsande.",
        ],
      },
      {
        rubrik: "Litium: lättast och tåligast, men aldrig ett rakt byte",
        stycken: [
          "Ett LiFePO4-batteri väger ungefär en tredjedel av ett blybatteri med samma användbara kapacitet, och kan urladdas nästan helt utan att ta skada. Där ett blybatteri på 100 Ah ger dig 50 användbara amperetimmar ger ett litiumbatteri på 100 Ah nästan 100.",
          "Priset är inte hela historien. Litium kräver oftast ny laddare, ofta ett nytt laddningsrelä mot startbatteriet, och det får inte laddas under noll grader utan inbyggt värmeskydd. Räkna med att systemet runt batteriet också ska bytas.",
          "Vi säljer inte litiumbatterier. Har du bestämt dig för litium är vi alltså fel leverantör, och det säger vi hellre här än efter att du lagt en beställning.",
        ],
      },
      {
        rubrik: "Så väljer du utan att räkna fel",
        punkter: [
          "Ska du byta rakt av i ett befintligt system: gel eller AGM. Inget annat behöver röras.",
          "Står husbilen stilla mellan turerna: gel, tack vare den låga självurladdningen.",
          "Har du stor växelriktare eller bogpropeller: AGM, för toppströmmen.",
          "Bygger du om helt och vill ha låg vikt och maximal kapacitet: litium, hos någon som säljer det.",
          "Oavsett val: byt alla parallellkopplade batterier samtidigt, annars drar det gamla ner det nya.",
        ],
      },
      {
        rubrik: "Vad gel och dry cell kostar hos oss",
        prislista: [
          { slug: "gf-12-076v", vad: "Gel 12V 76 Ah (C5), till mindre bodelar" },
          { slug: "gf-12-105v", vad: "Gel 12V 105 Ah (C5), vanligaste storleken" },
          { slug: "gf-12-160v", vad: "Gel 12V 160 Ah (C5), störst i sortimentet" },
          { slug: "ev31a-a-m8", vad: "Dry cell AGM 12V 120 Ah, tål effektuttag" },
        ],
        stycken: [
          "Priserna är inkl. moms. Vi är inte billigast på fritidsbatterier och försöker inte vara det. Batterierna här är byggda för yrkesmässig cyklisk drift, samma sort som sitter i städmaskiner som körs ur djupt varje arbetspass.",
        ],
      },
    ],
    relaterade: ["gelbatteri-eller-oppet-blybatteri", "dimensionera-solcellsbatteri"],
  },

  {
    slug: "dimensionera-solcellsbatteri",
    title: "Hur stort solcellsbatteri behöver du?",
    seoTitle: "Dimensionera solcellsbatteri 12V: så räknar du rätt | Batteriproffs",
    ingress:
      "De flesta köper för litet batteri och för stora paneler. Här är räkningen som avgör vilken storlek du behöver, och varför du ska dubbla svaret innan du beställer.",
    metaDescription:
      "Så räknar du ut hur många amperetimmar ditt solcellsbatteri behöver till stuga, husvagn eller båt. Med exempel och vanliga fallgropar.",
    uppdaterad: "2026-08-10",
    lastid: 5,
    sektioner: [
      {
        rubrik: "Börja i förbrukningen, inte i panelen",
        stycken: [
          "Panelen avgör hur snabbt batteriet fylls. Batteriet avgör hur länge du klarar dig utan sol. Det är två olika frågor, och det är den andra som avgör om anläggningen känns bra att leva med.",
          "Lista allt du faktiskt kör och hur många timmar per dygn. Multiplicera strömmen i ampere med antalet timmar, så får du amperetimmar per dygn. En LED-lampa på 0,5 A som lyser fyra timmar drar 2 Ah. En kompressorkyl som går halva dygnet på 4 A drar närmare 50.",
        ],
      },
      {
        rubrik: "Dubbla siffran, alltid",
        stycken: [
          "Ett blybatteri ska inte urladdas mer än till ungefär hälften om det ska hålla i år. Kör du det i botten varje dygn kan ett batteri som skulle klarat åtta år vara slut på två.",
          "Det betyder att ett dygnsbehov på 50 Ah kräver ungefär 100 Ah installerat, inte 50. Vill du dessutom klara ett par mulna dygn i rad utan att ladda ska du lägga på mer än så.",
        ],
      },
      {
        rubrik: "Ett räkneexempel för en stuga",
        punkter: [
          "Belysning, sex LED-lampor fyra timmar: cirka 12 Ah.",
          "Vattenpump, korta stötar under dagen: cirka 5 Ah.",
          "Laddning av telefoner och en dator: cirka 8 Ah.",
          "Kylskåp på 12V under sommarhalvåret: cirka 40 Ah.",
          "Summa cirka 65 Ah per dygn, vilket med halveringsregeln betyder minst 130 Ah installerat.",
        ],
        stycken: [
          "Utan kylskåpet landar samma stuga på 25 Ah per dygn och klarar sig gott på 50 till 60 Ah. Kylskåpet är nästan alltid den post som avgör vilken storleksklass du hamnar i.",
        ],
      },
      {
        rubrik: "Vintern ändrar förutsättningarna",
        stycken: [
          "Solen ger nästan ingenting i november och december på våra breddgrader, så en anläggning som ska fungera året runt kan inte dimensioneras på sommarförbrukning. Antingen laddar du med annan källa under vintern, eller så accepterar du att stugan är strömlös den perioden.",
          "Ett blybatteri som lämnas urladdat i en kall stuga kan frysa sönder på riktigt. Ladda fullt innan du lämnar det, och ladda upp igen någon gång under vintern. Gelbatterier har låg självurladdning och klarar det bäst.",
        ],
      },
      {
        rubrik: "Bygg större banker med 6V i serie",
        stycken: [
          "Behöver du mer än vad ett enskilt 12V-batteri ger seriekopplar du två 6V-batterier till 12V. Två 6V 180 Ah ger 12V 180 Ah, fyra ger 24V 180 Ah. Parallellkoppling av två 12V ger i stället dubbla amperetimmarna på samma spänning.",
          "Blanda aldrig gamla och nya batterier i samma bank, och blanda inte olika kapacitet. Banken blir aldrig bättre än sitt svagaste batteri.",
        ],
      },
      {
        rubrik: "Batterier för solcellsdrift hos oss",
        prislista: [
          { slug: "gf-12-050v", vad: "Gel 12V 50 Ah (C5), till små anläggningar" },
          { slug: "ev31a-a-m8", vad: "Dry cell AGM 12V 120 Ah" },
          { slug: "ev512a-150-m8", vad: "Dry cell AGM 12V 150 Ah" },
          { slug: "gf-12-160v", vad: "Gel 12V 160 Ah (C5), 196 Ah vid C20" },
        ],
        stycken: [
          "Ring med din uträkning så stämmer vi av den innan du beställer. Det är billigare att räkna två gånger än att köpa fel storlek.",
        ],
      },
    ],
    relaterade: ["agm-gel-eller-litium-i-husbilen", "gelbatteri-eller-oppet-blybatteri"],
  },

  {
    slug: "startbatteri-eller-forbrukningsbatteri-i-baten",
    title: "Startbatteri eller förbrukningsbatteri i båten?",
    seoTitle: "Startbatteri eller förbrukningsbatteri i båten? | Batteriproffs",
    ingress:
      "Ett batteri som både ska starta motorn och driva kylboxen gör inget av det bra. Här är varför de två jobben kräver olika batterier, och hur du delar upp det.",
    metaDescription:
      "Skillnaden mellan startbatteri och förbrukningsbatteri i båten, varför ett batteri inte räcker till båda, och hur du bygger ett system med två.",
    uppdaterad: "2026-08-10",
    lastid: 4,
    sektioner: [
      {
        rubrik: "Två jobb som drar åt olika håll",
        stycken: [
          "Att starta en motor kräver flera hundra ampere i några sekunder, och sedan laddas batteriet direkt upp igen av generatorn. Det urladdas nästan aldrig djupt. Ett startbatteri byggs därför med många tunna plattor: stor yta ger hög ström.",
          "Att driva ekolod, kylbox och belysning kräver några ampere i timmar, och batteriet töms ordentligt innan det laddas. Ett förbrukningsbatteri byggs med färre och tjockare plattor, som tål att ätas på om och om igen.",
          "Kör du ett startbatteri som förbrukningsbatteri bryts de tunna plattorna ner i förtid. Det håller en säsong, kanske två.",
        ],
      },
      {
        rubrik: "Symtomet på att du har fel uppsättning",
        stycken: [
          "Det klassiska tecknet är att motorn inte startar efter en kväll i viken. Batteriet har räckt till belysning och kylbox i några timmar, men inte haft något kvar till startförsöket, och nästa säsong räcker det ännu kortare.",
          "Det andra tecknet är att batteriet verkar bra men laddar upp misstänkt snabbt. Ett blybatteri som tappat kapacitet blir fullt fort, eftersom det inte finns så mycket kvar att fylla.",
        ],
      },
      {
        rubrik: "Så delar du upp det",
        punkter: [
          "Ett startbatteri som bara går till motorn, och inget annat.",
          "Ett eller flera förbrukningsbatterier som driver allt ombord.",
          "Ett skiljerelä eller en laddningsfördelare, så att generatorn laddar båda men förbrukningen bara tar från det ena.",
          "En huvudströmbrytare per krets, så att du kan koppla bort förbrukningen vid vinterförvaring.",
        ],
        stycken: [
          "Har du bara ett batteri ombord idag är det här den enskilt största uppgraderingen du kan göra, och den kostar mindre än att byta batteri i förtid två gånger.",
        ],
      },
      {
        rubrik: "Vad vi säljer, och vad vi inte säljer",
        stycken: [
          "Vi säljer förbrukningsbatterier: slutna, djupcykliska gel- och dry cell-batterier som tål att tömmas och laddas om och om igen, och som inte läcker syra om båten kränger.",
          "Vi säljer inte startbatterier till båt. Ska motorns startbatteri bytas behöver du en annan leverantör, och det är bättre att veta det nu.",
        ],
        prislista: [
          { slug: "ev31a-a-m8", vad: "Dry cell AGM 12V 120 Ah, tål effektuttag och vibration" },
          { slug: "ev512a-150-m8", vad: "Dry cell AGM 12V 150 Ah" },
          { slug: "gf-12-105v", vad: "Gel 12V 105 Ah (C5), tål långa stillestånd" },
          { slug: "gf-12-160v", vad: "Gel 12V 160 Ah (C5), störst i sortimentet" },
        ],
      },
    ],
    relaterade: ["agm-gel-eller-litium-i-husbilen", "traktionsbatteri-eller-startbatteri"],
  },
]

export function artikelBySlug(slug) {
  return artiklar.find((a) => a.slug === slug) || null
}
