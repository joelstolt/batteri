import { publicProducts } from "./products"

/**
 * Användningssidor: ett batteri per situation i stället för per maskinmodell.
 *
 * Maskinsidorna i lib/machines.js svarar på "vilket batteri passar min Nilfisk
 * SC401". De här sidorna svarar på det bredare "vilket batteri ska jag ha i
 * husbilen", som är där sökvolymen ligger. Uppmätt aug 2026 (DataForSEO,
 * Sverige): batteri husvagn 480, båtbatteri 480, marinbatteri 480, husvagns-
 * batteri 260, batteri husbil 260, husbilsbatteri 170, solcellsbatteri 12v 50
 * plus solcellsbatteri 2 900 på huvudordet, batteri golfbil 90.
 *
 * SAMMA REGEL SOM I machines.js: hitta aldrig på en passform. Produkterna på en
 * sida får bara komma från två håll, och vilket som gäller står i `grund` på
 * varje post:
 *
 *   "fitsTo"  produkten nämner användningen i sitt fitsTo-fält i products.js
 *   "spec"    produkten har rätt spänning och konstruktion för användningen,
 *             och sidan skriver ut vilken egenskap det är som gör den lämplig
 *
 * Skillnaden spelar roll. "Discover EV31A-A passar båtinstallationer" står i
 * produktdatan. "Ett slutet gelbatteri kan monteras i boendedelen eftersom det
 * inte gasar" är en egenskap hos batterityp, inte ett påstående om en viss båt.
 * Det första är en passform, det andra är en spec. Blanda dem inte.
 *
 * PRISER SKRIVS ALDRIG IN I TEXTEN. De räknas fram ur products.js, precis som i
 * lib/kunskap.js, så att en prisändring slår igenom av sig själv.
 */

const kr = (n) => new Intl.NumberFormat("sv-SE").format(n) + " kr"

export function produktFor(slug) {
  return publicProducts.find((p) => p.slug === slug) || null
}

/** Produkterna på en sida, i registrets ordning, utan utgångna. */
export function produkterFor(sida) {
  return sida.produkter.map((slug) => produktFor(slug)).filter(Boolean)
}

/** Lägsta pris på sidan, för metabeskrivningen. */
export function prisFran(sida) {
  const priser = produkterFor(sida).map((p) => p.price)
  return priser.length ? Math.min(...priser) : null
}

/**
 * Paketpris för ett helt batteribyte, till exempel sex 6V-batterier i en
 * golfbil med 36V-system. Räknas fram, hårdkodas aldrig.
 */
export function paketpris(slug, antal) {
  const p = produktFor(slug)
  if (!p) return null
  return { styck: kr(p.price), totalt: kr(p.price * antal), antal, produkt: p }
}

export const anvandningar = [
  /* ───────────────────────── Golfbil ───────────────────────── */
  {
    slug: "golfbilsbatteri",
    eyebrow: "Golfbilar och utilityfordon",
    h1: "Golfbilsbatteri till 36V och 48V",
    grund: "fitsTo",
    intro:
      "Sex batterier som ska bytas samtidigt blir en dyr affär om du betalar märkespris för vart och ett. Vi säljer traktionsbatterier i samma GC2- och GC8-format som sitter i Club Car, E-Z-GO och Yamaha från fabrik, till ungefär halva priset mot Trojan.",
    produkter: [
      "nm105-6et",
      "nm125-6et",
      "nm875-8et",
      "evgc6a-a-m8",
      "evgc8a-a-m8",
      "gf-06-180v",
    ],
    seo: {
      title: "Golfbilsbatteri 6V och 8V till Club Car, E-Z-GO och Yamaha | Batteriproffs",
      description:
        "Golfbilsbatteri i GC2- och GC8-format till 36V- och 48V-golfbilar. Direkt utbytbart mot originalet, med pris per batteri och för hela paketet.",
    },
    /* Paketen bygger på fitsTo i products.js: 6V-batterierna anges för
       golfbilar generellt, 8V-batterierna uttryckligen för 48V-system i
       Club Car Precedent, E-Z-GO RXV/TXT och Yamaha Drive/G-MAX. */
    paket: [
      { rubrik: "36V-golfbil", beskrivning: "sex 6V-batterier i serie", slug: "nm105-6et", antal: 6 },
      { rubrik: "48V-golfbil", beskrivning: "sex 8V-batterier i serie", slug: "nm875-8et", antal: 6 },
    ],
    valj: [
      {
        rubrik: "Räkna batterierna, inte voltsiffran på laddaren",
        text: "Sitter det sex batterier med 6V vardera är det ett 36V-system. Sitter det sex med 8V är det 48V. Räkna alltid i bilen i stället för att gå på vad som står i annonsen, äldre golfbilar har ofta byggts om.",
      },
      {
        rubrik: "Byt hela uppsättningen samtidigt",
        text: "Ett nytt batteri i serie med fem gamla laddas och urladdas i takt med de gamla, och tappar kapacitet därefter. Halva vinsten med det nya batteriet försvinner första säsongen.",
      },
      {
        rubrik: "GC2 och GC8 är måttstandarder",
        text: "Batterierna har samma yttermått som originalen, så de går ner i befintligt batterifack utan att något behöver byggas om. Kontrollera bara att polerna sitter åt samma håll som på de gamla.",
      },
      {
        rubrik: "Öppet eller slutet",
        text: "Öppna blybatterier håller längst och kostar minst, men kräver påfyllning av batterivatten några gånger per säsong. Ska bilen stå oskött, eller köras av flera personer, är gelbatteriet värt merkostnaden.",
      },
    ],
    faq: [
      {
        q: "Passar batterierna min Club Car eller E-Z-GO?",
        a: "Batterierna har samma format som originalen och byts rakt av i 36V- och 48V-bilar från Club Car, E-Z-GO och Yamaha. Ring med årsmodell och antal batterier i bilen så bekräftar vi innan du beställer.",
      },
      {
        q: "Hur länge håller ett golfbilsbatteri?",
        a: "Ett öppet traktionsbatteri som laddas efter varje användning och hålls påfyllt med batterivatten brukar klara fem till sju säsonger i klubbdrift. Batterier som får stå urladdade över vintern dör betydligt tidigare.",
      },
      {
        q: "Kan jag köpa ett enstaka batteri?",
        a: "Ja, men vi avråder om de andra suttit i mer än en säsong. Serien blir aldrig starkare än det svagaste batteriet.",
      },
    ],
    relaterade: [
      { href: "/kategori/traktion-industri", label: "Alla traktionsbatterier" },
      { href: "/ersatter/trojan-t-105", label: "Ersätter Trojan T-105" },
      { href: "/batterivatten", label: "Batterivatten och påfyllning" },
    ],
  },

  /* ─────────────────────── Solcellsbatteri ─────────────────────── */
  {
    slug: "solcellsbatteri-12v",
    eyebrow: "Solceller, stuga och off grid",
    h1: "Solcellsbatteri 12V till stuga, husvagn och båt",
    grund: "fitsTo",
    intro:
      "Ett solcellsbatteri laddas och urladdas varje dygn, året om. Det är precis den belastning som slår ut ett vanligt startbatteri på en säsong. Batterierna här är byggda för cyklisk drift, samma sort som sitter i städmaskiner och liftar som körs ur djupt varje arbetspass.",
    produkter: [
      "gf-12-050v",
      "gf-12-063y",
      "ev31a-a-m8",
      "nm1275-12et",
      "ev512a-150-m8",
      "gf-12-160v",
    ],
    seo: {
      title: "Solcellsbatteri 12V till stuga, husvagn och båt | Batteriproffs",
      description:
        "Solcellsbatteri 12V från 50 till 196 Ah. Djupcykliska gel- och dry cell-batterier byggda för daglig urladdning, inte startbatterier.",
    },
    valj: [
      {
        rubrik: "Räkna på hur mycket du drar per dygn",
        text: "Lägg ihop förbrukningen för det du faktiskt kör: kylskåp, belysning, vattenpump, laddning av telefoner. Dubbla sedan siffran. Ett blybatteri mår bra av att inte urladdas mer än till hälften, så ett dygnsbehov på 50 Ah betyder ungefär 100 Ah installerat.",
      },
      {
        rubrik: "Gel tål vintern bättre än öppet bly",
        text: "Gelbatterier har låg självurladdning och klarar att stå i en ouppvärmd stuga mellan besöken. De ska ändå laddas fulla innan de lämnas, ett urladdat blybatteri som fryser går sönder på riktigt.",
      },
      {
        rubrik: "Ladda med rätt profil",
        text: "Gelbatterier vill ha lägre laddspänning än öppna blybatterier. Har din solcellsregulator ett läge för gel eller AGM ska det ställas in, annars kokas batteriet sakta sönder.",
      },
      {
        rubrik: "Seriekoppla för större bank",
        text: "Behöver du mer än 196 Ah bygger du banken av 6V-batterier i serie. Två 6V 180 Ah ger 12V 180 Ah, fyra ger 24V. Hör av dig så räknar vi tillsammans.",
      },
    ],
    faq: [
      {
        q: "Kan jag använda ett vanligt bilbatteri till solcellerna?",
        a: "Det fungerar en säsong, sedan är det slut. Ett startbatteri är byggt för att ge mycket ström en kort stund och tål inte att urladdas djupt om och om igen. Ett djupcykliskt batteri är byggt för raka motsatsen.",
      },
      {
        q: "Vad är skillnaden mellan gel och dry cell?",
        a: "Båda är slutna och underhållsfria. Gel tål långa stillastående perioder och djup urladdning bäst, dry cell AGM ger högre effektuttag och tål vibration bättre. Till en stuga är gel oftast rätt, till en båt dry cell.",
      },
      {
        q: "Hur många år håller ett solcellsbatteri?",
        a: "Det avgörs nästan helt av hur djupt det urladdas. Ett batteri som sällan går under halva kapaciteten kan hålla i åtta till tio år. Ett som körs i botten varje dygn kan vara slut på två.",
      },
    ],
    relaterade: [
      { href: "/kategori/fritid-solenergi", label: "Fritid och solenergi" },
      { href: "/husbilsbatteri", label: "Bodelsbatteri till husbil" },
      { href: "/kunskap/dimensionera-solcellsbatteri", label: "Guide: dimensionera batteribanken" },
    ],
  },

  /* ───────────────────────── Husbil ───────────────────────── */
  {
    slug: "husbilsbatteri",
    eyebrow: "Husbil och bodel",
    h1: "Husbilsbatteri och bodelsbatteri 12V",
    grund: "blandad",
    intro:
      "Bodelsbatteriet är det som driver kylskåp, belysning och vattenpump när du står fritt. Det ska tåla att köras ur djupt och laddas upp igen, hundratals gånger. Vi säljer inte de billigaste bodelsbatterierna på marknaden. Vi säljer slutna gel- och dry cell-batterier som är byggda för yrkesmässig cyklisk drift och håller därefter.",
    produkter: [
      "nm1275-12et",
      "ev31a-a-m8",
      "ev512a-150-m8",
      "gf-12-105v",
      "gf-12-160v",
      "gf-12-076v",
    ],
    /* nm1275-12et och ev31a-a-m8 anger husbilssystem i fitsTo. Gelbatterierna
       står här på sin konstruktion: 12V, djupcykliska och slutna, alltså
       monterbara i boendedelen. Det är en spec, inte en passform. */
    specnot:
      "Nordmax NM1275-12ET och Discover EV31A-A anges för husbilssystem i produktdatan. Sonnenschein GF-serien står med för att den är sluten, djupcyklisk och 12V, alltså byggd för samma sorts drift och godkänd att montera i boendedelen. Vilken som passar just din inredning beror på måtten i batterifacket.",
    seo: {
      title: "Husbilsbatteri och bodelsbatteri 12V, gel och dry cell | Batteriproffs",
      description:
        "Bodelsbatteri 12V till husbil från 76 till 196 Ah. Slutna gel- och dry cell-batterier som tål djup urladdning och får monteras i boendedelen.",
    },
    valj: [
      {
        rubrik: "Mät batterifacket först",
        text: "Kapaciteten spelar ingen roll om batteriet inte går ner i facket. Mät längd, bredd och höjd inklusive poler, och kolla att kablarna når fram när polerna hamnar åt det håll de gör på det nya batteriet.",
      },
      {
        rubrik: "Slutet batteri får sitta inne",
        text: "Öppna blybatterier gasar vid laddning och ska sitta ventilerat. Gel och dry cell är slutna och gasar inte i normal drift, vilket är hela anledningen till att de sitter i bodelen från fabrik.",
      },
      {
        rubrik: "Blanda inte gammalt och nytt",
        text: "Har du två bodelsbatterier parallellkopplade ska båda bytas samtidigt. Det gamla drar ner det nya, och du får varken kapaciteten eller livslängden du betalat för.",
      },
      {
        rubrik: "Kontrollera vad laddaren kan",
        text: "Många husbilsladdare har ett läge per batterityp. Ställer du den på öppet bly när du satt in gel blir laddspänningen för hög, och batteriet torkar långsamt ut.",
      },
    ],
    faq: [
      {
        q: "Hur stort bodelsbatteri behöver jag?",
        a: "Räkna ihop vad du drar per dygn och dubbla siffran, eftersom ett blybatteri inte bör urladdas mer än till hälften. Kylskåp på 12V är den stora posten, en kompressorkyl drar ofta 30 till 50 Ah per dygn i sommarvärme.",
      },
      {
        q: "Kan jag byta till litium i stället?",
        a: "Litium väger mindre och tål djupare urladdning, men kräver oftast ny laddare och nytt laddningsrelä mot startbatteriet. Vi säljer inte litiumbatterier idag, så vill du gå den vägen är vi fel leverantör. Ska du byta rakt av i befintligt system är gel eller dry cell rätt val.",
      },
      {
        q: "Är det samma batteri som startar motorn?",
        a: "Nej. Startbatteriet ger hög ström en kort stund och sitter under motorhuven. Bodelsbatteriet ska ge lite ström under lång tid och tåla att tömmas. Vi säljer bodelsbatterier, inte startbatterier.",
      },
    ],
    relaterade: [
      { href: "/husvagnsbatteri", label: "Batteri till husvagn" },
      { href: "/solcellsbatteri-12v", label: "Solcellsbatteri 12V" },
      { href: "/kunskap/agm-gel-eller-litium-i-husbilen", label: "Guide: AGM, gel eller litium" },
    ],
  },

  /* ───────────────────────── Husvagn ───────────────────────── */
  {
    slug: "husvagnsbatteri",
    eyebrow: "Husvagn",
    h1: "Husvagnsbatteri 12V",
    grund: "blandad",
    intro:
      "I husvagnen räcker ofta ett mindre batteri än i husbilen, eftersom förbrukningen är lägre och laddningen sker via landström. Undantaget är mover och kylskåp på fritt stående, då blir kapaciteten snabbt avgörande.",
    produkter: [
      "gf-12-076v",
      "gf-12-105v",
      "ev31a-a-m8",
      "gf-12-063y",
      "nm1275-12et",
      "gf-12-160v",
    ],
    specnot:
      "Discover EV31A-A och Nordmax NM1275-12ET anges för husbils- och fritidssystem i produktdatan. Sonnenschein GF-serien står med på sin konstruktion: 12V, sluten och djupcyklisk, alltså rätt sorts batteri för en husvagn och tillåten att montera inne i vagnen.",
    seo: {
      title: "Husvagnsbatteri 12V, gel och dry cell från 63 Ah | Batteriproffs",
      description:
        "Husvagnsbatteri 12V från 63 till 196 Ah. Slutna gelbatterier och dry cell som tål djup urladdning, klarar mover och kylskåp på fritt stående.",
    },
    valj: [
      {
        rubrik: "Har du mover behöver du mer",
        text: "En mover drar mycket ström under kort tid när vagnen ska rangeras. Ett litet batteri klarar det en gång men börjar sacka när det är halvurladdat. Med mover installerad bör du ligga på minst 100 Ah.",
      },
      {
        rubrik: "Kolla facket och polernas läge",
        text: "Husvagnsfack är ofta trängre än husbilarnas. Mät höjden med polerna inräknade, och se efter åt vilket håll plus sitter innan du beställer.",
      },
      {
        rubrik: "Ladda fullt innan vinterförvaring",
        text: "Ett halvurladdat blybatteri kan frysa sönder. Ladda fullt, koppla loss minuspolen och ladda upp igen någon gång under vintern, eller ta in batteriet.",
      },
      {
        rubrik: "Slutet batteri slipper ventilation",
        text: "Gel och dry cell gasar inte i normal drift och kan därför sitta inne i vagnen. Ett öppet blybatteri måste sitta ventilerat utåt.",
      },
    ],
    faq: [
      {
        q: "Hur många amperetimmar behöver en husvagn?",
        a: "Står du mest på camping med landström räcker 60 till 80 Ah gott. Står du fritt, eller har mover och kompressorkyl, är 100 Ah och uppåt en rimligare utgångspunkt.",
      },
      {
        q: "Kan jag ha samma batteri som i bilen?",
        a: "Nej. Bilens startbatteri tål inte att urladdas djupt om och om igen. Det håller en säsong i en husvagn och tappar sedan kapacitet snabbt.",
      },
      {
        q: "Hur vet jag att batteriet är slut?",
        a: "Ett fulladdat och vilande 12V-blybatteri ska ligga runt 12,7 volt. Ligger det under 12,4 direkt efter laddning, eller sjunker snabbt vid belastning, är det på väg ut.",
      },
    ],
    relaterade: [
      { href: "/husbilsbatteri", label: "Bodelsbatteri till husbil" },
      { href: "/solcellsbatteri-12v", label: "Solcellsbatteri 12V" },
      { href: "/kategori/fritid-solenergi", label: "Fritid och solenergi" },
    ],
  },

  /* ───────────────────── Marin och båt ───────────────────── */
  {
    slug: "marinbatteri",
    eyebrow: "Båt och marin",
    h1: "Marinbatteri och båtbatteri 12V",
    grund: "blandad",
    intro:
      "Ombord finns två helt olika jobb: starta motorn och driva allt annat. Vi säljer batterier för det andra jobbet. Förbrukningsbatterier som ska driva ekolod, kylbox, belysning och bogpropeller, och som tål att tömmas och laddas om och om igen.",
    produkter: ["ev31a-a-m8", "ev512a-150-m8", "gf-12-105v", "gf-12-160v", "gf-12-076v", "gf-12-050v"],
    specnot:
      "Discover EV31A-A anges för båtinstallationer i produktdatan. Övriga står med på sin konstruktion: 12V, slutna och djupcykliska, alltså byggda för förbrukningsdrift ombord.",
    varning:
      "Vi säljer inte startbatterier till båt. Ska motorns startbatteri bytas är vi fel leverantör, och det säger vi hellre nu än efter att du beställt.",
    seo: {
      title: "Marinbatteri och båtbatteri 12V, förbrukningsbatteri | Batteriproffs",
      description:
        "Marinbatteri 12V från 50 till 196 Ah. Slutna djupcykliska förbrukningsbatterier för ekolod, kylbox, belysning och bogpropeller.",
    },
    valj: [
      {
        rubrik: "Skilj start från förbrukning",
        text: "Ett batteri som både ska starta motorn och driva kylboxen gör inget av det bra. Har du bara ett batteri ombord idag är två separata, med skiljerelä eller huvudströmbrytare, den enskilt bästa uppgraderingen.",
      },
      {
        rubrik: "Slutet batteri är rätt ombord",
        text: "Gel och dry cell är förseglade och läcker inte syra om båten kränger. De gasar heller inte i normal drift, vilket spelar roll i ett trångt och dåligt ventilerat batteriutrymme.",
      },
      {
        rubrik: "Bogpropellern styr storleken",
        text: "En bogpropeller drar väldigt mycket ström i korta stötar. Sitter den på förbrukningsbatteriet behöver du både hög kapacitet och ett batteri som tål effektuttaget, alltså dry cell snarare än gel.",
      },
      {
        rubrik: "Vinterkonservera batteriet också",
        text: "Ladda fullt före upptagning och håll det laddat under vintern. Ett urladdat blybatteri i en kall båt är ett batteri som ska köpas nytt till våren.",
      },
    ],
    faq: [
      {
        q: "Vad är skillnaden mellan startbatteri och förbrukningsbatteri?",
        a: "Startbatteriet ger flera hundra ampere i några sekunder och urladdas nästan aldrig djupt. Förbrukningsbatteriet ger några ampere i timmar och töms regelbundet. Plattorna är byggda olika för de två jobben, och ett batteri som gör fel jobb slits ut i förtid.",
      },
      {
        q: "Kan jag koppla flera batterier parallellt?",
        a: "Ja, samma typ, samma kapacitet och helst samma ålder. Parallellkoppling ger mer kapacitet på 12V. Blandar du gammalt och nytt drar det gamla ner det nya.",
      },
      {
        q: "Tål batterierna att sitta i en fuktig båt?",
        a: "Gel och dry cell är förseglade och tål marin miljö bra. Polerna ska ändå hållas rena och gärna fettas, och batteriet ska sitta fast så det inte kan röra sig i sjögång.",
      },
    ],
    relaterade: [
      {
        href: "/kunskap/startbatteri-eller-forbrukningsbatteri-i-baten",
        label: "Guide: start eller förbrukning ombord",
      },
      { href: "/solcellsbatteri-12v", label: "Solcellsbatteri 12V" },
      { href: "/kategori/fritid-solenergi", label: "Fritid och solenergi" },
    ],
  },
]

export function anvandningBySlug(slug) {
  return anvandningar.find((a) => a.slug === slug) || null
}
