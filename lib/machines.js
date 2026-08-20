/**
 * Maskinregister för /batteri-till/<maskin>
 *
 * Varje post är en maskin eller maskintyp som kunder faktiskt söker på, kopplad
 * till de batterier i sortimentet som passar. Hitta ALDRIG på en passform här.
 *
 * Två tillåtna källor, och bara två:
 *   1. fitsTo-fältet i lib/products.js
 *   2. Tillverkarens egen publicerade batterispec (spänning + kapacitet),
 *      med källan utskriven i en kommentar över posten
 *
 * Spår 2 tillkom 2026-08-06 eftersom fitsTo var uttömt: varje modell som nämns
 * där hade redan en sida. Se den längre kommentaren vid Kärcher BD 43/25 för
 * vad spår 2 kan och inte kan belägga.
 *
 * Poängen: ingen söker "traktionsbatteri" när maskinen står still. De söker
 * "batteri till Nilfisk SC401". Volymen per sida är liten men avsikten total.
 *
 * VALFRIA FÄLT (title, description, sections, faq): mallen faller tillbaka på
 * de genererade varianterna när de saknas, så lägg bara till dem på sidor med
 * uppmätt egen efterfrågan. Just nu är det bara Permobil. Att sätta dem på en
 * nollvolymssida ger bara mer text att underhålla.
 */

export const MACHINE_GROUPS = [
  { id: "stadmaskiner", label: "Städmaskiner" },
  { id: "liftar", label: "Liftar" },
  { id: "golfbilar", label: "Golfbilar" },
  { id: "ovrigt", label: "Övriga fordon" },
]

export const machines = [
  /* ───────── Städmaskiner ───────── */
  {
    slug: "nilfisk-sc250",
    name: "Nilfisk SC250",
    brand: "Nilfisk",
    group: "stadmaskiner",
    type: "Gångbakom-skurmaskin",
    products: ["gf-12-050v"],
    intro:
      "Nilfisk SC250 är en kompakt gångbakom-skurmaskin för mindre ytor. Den drivs av slutna gelbatterier, vilket gör den godkänd för miljöer där öppna blybatterier inte får användas — butik, vård och livsmedel.",
  },
  {
    slug: "nilfisk-sc401",
    name: "Nilfisk SC401",
    brand: "Nilfisk",
    group: "stadmaskiner",
    type: "Åkbar skurmaskin",
    products: ["nm305g-et"],
    intro:
      "Nilfisk SC401 är en åkbar skurmaskin för medelstora till stora ytor. Den kräver traktionsbatterier med hög cyklisk uthållighet eftersom maskinen körs ur djupt varje arbetspass.",
  },
  {
    slug: "nilfisk-sc500",
    name: "Nilfisk SC500",
    brand: "Nilfisk",
    group: "stadmaskiner",
    type: "Åkbar skurmaskin",
    products: ["nm305g-et"],
    intro:
      "Nilfisk SC500 används i lager, industri och större publika lokaler. Batteripaketet är det som avgör hur många kvadratmeter maskinen orkar per laddning.",
  },
  {
    slug: "nilfisk-sc6000",
    name: "Nilfisk SC6000",
    brand: "Nilfisk",
    group: "stadmaskiner",
    type: "Stor åkbar skurmaskin",
    products: ["gf-06-240v"],
    intro:
      "Nilfisk SC6000 är en av de största åkbara skurmaskinerna på marknaden och används i logistikcenter och industrihallar. Den kräver batterier byggda för långa, tunga arbetspass.",
  },
  {
    slug: "nilfisk-ba530",
    name: "Nilfisk BA530",
    brand: "Nilfisk",
    group: "stadmaskiner",
    type: "Skurmaskin",
    products: ["gf-12-076v", "gf-12-105v"],
    intro:
      "Nilfisk BA530 finns i flera utföranden med olika batterikonfiguration. Kontrollera märkspänningen och batterifackets mått innan du beställer — vi hjälper dig gärna över telefon.",
  },
  {
    slug: "nilfisk-ba451d",
    name: "Nilfisk BA451D",
    brand: "Nilfisk",
    group: "stadmaskiner",
    type: "Professionell skurmaskin",
    products: ["gf-12-105v"],
    intro:
      "Nilfisk BA451D är en professionell skurmaskin för daglig drift. Gelbatterier är standardvalet eftersom de är underhållsfria och inte kräver vattenpåfyllning.",
  },
  {
    slug: "hako-scrubmaster-b12",
    name: "Hako Scrubmaster B12",
    brand: "Hako",
    group: "stadmaskiner",
    type: "Gångbakom-skurmaskin",
    products: ["gf-12-050v"],
    intro:
      "Hako Scrubmaster B12 är en kompakt maskin för trånga ytor. Slutna gelbatterier gör den användbar i publika miljöer där gasbildning inte accepteras.",
  },
  {
    slug: "hako-scrubmaster-b30",
    name: "Hako Scrubmaster B30",
    brand: "Hako",
    group: "stadmaskiner",
    type: "Skurmaskin",
    products: ["gf-12-076v"],
    intro:
      "Hako Scrubmaster B30 används i butik, skola och lättare industri. Rätt batterikapacitet avgör om maskinen klarar hela passet utan mellanladdning.",
  },
  {
    slug: "hako-scrubmaster-b45",
    name: "Hako Scrubmaster B45",
    brand: "Hako",
    group: "stadmaskiner",
    type: "Skurmaskin",
    products: ["gf-12-105v"],
    intro:
      "Hako Scrubmaster B45 är byggd för daglig professionell drift. Gelbatterier med hög cyklisk livslängd är det som håller driftkostnaden nere över tid.",
  },
  {
    slug: "hako-scrubmaster-b120",
    name: "Hako Scrubmaster B120",
    brand: "Hako",
    group: "stadmaskiner",
    type: "Stor åkbar skurmaskin",
    products: ["gf-06-240v"],
    intro:
      "Hako Scrubmaster B120 är en stor åkbar maskin för industri och logistik. Batteripaketet är den enskilt största driftkostnaden och lönar sig att välja rätt.",
  },
  {
    slug: "karcher-br-35-12",
    name: "Kärcher BR 35/12",
    brand: "Kärcher",
    group: "stadmaskiner",
    type: "Kompakt skurmaskin",
    products: ["gf-12-050v"],
    intro:
      "Kärcher BR 35/12 är en kompakt skurmaskin för trånga utrymmen. Den drivs av slutna gelbatterier och kräver inget underhåll utöver laddning.",
  },
  {
    slug: "karcher-br-40-25",
    name: "Kärcher BR 40/25",
    brand: "Kärcher",
    group: "stadmaskiner",
    type: "Skurmaskin",
    products: ["gf-12-076v"],
    intro:
      "Kärcher BR 40/25 används i butik och lättare industri. Kapaciteten på batteriet styr direkt hur stor yta maskinen hinner med per laddning.",
  },
  /*
   * Från och med 2026-08-06 får poster också läggas till utifrån tillverkarens
   * EGNA publicerade batterispec, inte bara ur fitsTo. Kravet är att spänning
   * och kapacitet går att belägga från tillverkaren själv, och källan skrivs ut
   * i kommentaren över posten.
   *
   * Vad som INTE går att belägga den vägen är batterifackets mått, dem
   * publicerar varken Kärcher eller Nilfisk. Den risken bärs av
   * passformsgarantin, som står på /villkor och som mallen länkar till i rutan
   * "Kontrollera detta innan du beställer". Skriv därför aldrig om en sådan
   * post till ett måttlöfte. Kommer leverantörens passformslista någon gång
   * ersätter den de här uppskattningarna.
   */
  {
    // Källa: Kärcher säljer maskinen som "BD 43/25 C Classic Bp Pack 76 Ah",
    // alltså 24V/76 Ah ur tillverkarens egen artikelbenämning. Två GF12076V
    // i serie ger exakt 24V 76 Ah (C5).
    slug: "karcher-bd-43-25",
    name: "Kärcher BD 43/25",
    brand: "Kärcher",
    group: "stadmaskiner",
    type: "Gångbakom-skurmaskin",
    products: ["gf-12-076v"],
    intro:
      "Kärcher BD 43/25 körs på ett 24V-system med 76 Ah, alltså två 12V-batterier i serie. Kapaciteten är densamma som Kärcher själva levererar maskinen med, så du får samma driftstid per laddning som från fabrik.",
  },
  {
    // Källa: Kärcher listar BD 50/50 C Bp med 24V och 80 till 115 Ah beroende
    // på utförande, AGM-varianten som 24V/100 Ah och våtvarianten 24V/105 Ah.
    // GF12105V (105 Ah C5) ligger på våtvariantens nivå, EV31A-A (120 Ah) något
    // över, vilket ger längre driftstid och inte är ett problem för maskinen.
    slug: "karcher-bd-50-50",
    name: "Kärcher BD 50/50",
    brand: "Kärcher",
    group: "stadmaskiner",
    type: "Gångbakom-skurmaskin",
    products: ["gf-12-105v", "ev31a-a-m8"],
    intro:
      "Kärcher BD 50/50 levereras med 24V och mellan 80 och 115 Ah beroende på utförande. Två 12V-batterier i serie ersätter paketet. Väljer du den högre kapaciteten får du längre driftstid per laddning, vilket maskinen hanterar utan problem.",
  },
  {
    slug: "karcher-br-55-40",
    name: "Kärcher BR 55/40",
    brand: "Kärcher",
    group: "stadmaskiner",
    type: "Professionell skurmaskin",
    products: ["gf-12-105v"],
    intro:
      "Kärcher BR 55/40 är gjord för daglig professionell drift. Underhållsfria gelbatterier är standard eftersom maskinen ofta går i publika miljöer.",
  },
  {
    slug: "karcher-br-75-140",
    name: "Kärcher BR 75/140",
    brand: "Kärcher",
    group: "stadmaskiner",
    type: "Stor åkbar skurmaskin",
    products: ["gf-06-240v"],
    intro:
      "Kärcher BR 75/140 är en stor åkbar skurmaskin för industri och logistik. Den kräver traktionsbatterier byggda för långa arbetspass och djup urladdning.",
  },
  {
    slug: "gansow-ct45",
    name: "Gansow CT45",
    brand: "Gansow",
    group: "stadmaskiner",
    type: "Skurmaskin",
    products: ["gf-12-076v", "gf-12-105v"],
    intro:
      "Gansow CT45 finns i flera batterikonfigurationer. Kontrollera systemspänning och batterifackets mått innan beställning, så vi kan bekräfta att paketet passar.",
  },
  {
    slug: "gansow-ct70",
    name: "Gansow CT70",
    brand: "Gansow",
    group: "stadmaskiner",
    type: "Skurmaskin",
    products: ["gf-12-076v"],
    intro:
      "Gansow CT70 används i lager och industri. Gelbatterier är förstahandsvalet eftersom de är helt underhållsfria och tål djup urladdning.",
  },
  {
    slug: "gansow-bt70",
    name: "Gansow BT70",
    brand: "Gansow",
    group: "stadmaskiner",
    type: "Åkbar skurmaskin",
    products: ["gf-12-105v"],
    intro:
      "Gansow BT70 är en åkbar maskin för större ytor. Rätt batterikapacitet är skillnaden mellan att klara hela skiftet och att behöva mellanladda.",
  },
  {
    slug: "tennant-stadmaskin",
    name: "Tennant städmaskiner",
    brand: "Tennant",
    group: "stadmaskiner",
    type: "Skur- och kombimaskiner",
    products: ["nml16h-et", "evgc6a-a-m8"],
    intro:
      "Tennants åkbara maskiner används i industri, logistik och offentliga miljöer. Vilket batteri som passar avgörs av modellens systemspänning och batterifackets mått — ring oss med modellnumret så tar vi fram rätt paket.",
  },
  {
    slug: "comac-stadmaskin",
    name: "Comac städmaskiner",
    brand: "Comac",
    group: "stadmaskiner",
    type: "Skur- och kombimaskiner",
    products: ["gf-12-105v", "evgc6a-a-m8"],
    intro:
      "Comac tillverkar skurmaskiner för professionell drift. Uppge modellbeteckning och systemspänning så bekräftar vi vilket batteripaket som passar din maskin.",
  },

  /* ───────── Liftar ───────── */
  {
    slug: "jlg-saxlift",
    name: "JLG saxlift",
    brand: "JLG",
    group: "liftar",
    type: "Saxlift och personlift",
    products: ["nm125-6et", "nm105-6et", "evgc6a-a-m8"],
    intro:
      "JLG:s saxliftar och personliftar körs på traktionsbatterier som tål att laddas ur djupt varje dag. Ett 24V-system byggs vanligen av fyra 6V-batterier och ett 48V-system av åtta — kontrollera märkspänningen på liften innan du beställer.",
  },
  {
    slug: "genie-lift",
    name: "Genie lift",
    brand: "Genie",
    group: "liftar",
    type: "Saxlift och personlift",
    products: ["nm125-6et", "nm105-6et", "evgc6a-a-m8"],
    intro:
      "Genies liftar är beroende av batterier med hög cyklisk livslängd. Byter du hela paketet samtidigt håller liften jämnare, eftersom en svag cell drar ner hela serien.",
  },
  {
    slug: "haulotte-lift",
    name: "Haulotte lift",
    brand: "Haulotte",
    group: "liftar",
    type: "Saxlift och personlift",
    products: ["nm125-6et", "nm105-6et"],
    intro:
      "Haulottes liftar används i bygg och fastighetsservice. Traktionsbatterier med öppet blyutförande ger bäst pris per cykel, men kräver regelbunden vattenpåfyllning.",
  },
  {
    slug: "snorkel-lift",
    name: "Snorkel lift",
    brand: "Snorkel",
    group: "liftar",
    type: "Saxlift",
    products: ["nm125-6et"],
    intro:
      "Snorkels saxliftar drivs av traktionsbatterier i BCI GC2-format, vilket gör dem enkla att ersätta. Uppge liftens systemspänning så räknar vi ut hur många batterier paketet ska innehålla.",
  },

  /* ───────── Golfbilar ───────── */
  {
    slug: "club-car-precedent",
    name: "Club Car Precedent",
    brand: "Club Car",
    group: "golfbilar",
    type: "Golfbil",
    products: ["nm875-8et", "evgc8a-a-m8"],
    intro:
      "Club Car Precedent med 48V-system byggs av sex 8V-batterier. Byt alltid hela uppsättningen samtidigt — ett nytt batteri i serie med fem gamla åldras i takt med de gamla.",
  },
  {
    slug: "ez-go-rxv",
    name: "E-Z-GO RXV",
    brand: "E-Z-GO",
    group: "golfbilar",
    type: "Golfbil",
    products: ["nm875-8et", "evgc8a-a-m8"],
    intro:
      "E-Z-GO RXV körs på 48V, vilket motsvarar sex seriekopplade 8V-batterier. Djupcykelbatterier är ett krav — ett vanligt startbatteri klarar inte den urladdningsprofilen.",
  },
  {
    slug: "ez-go-txt",
    name: "E-Z-GO TXT",
    brand: "E-Z-GO",
    group: "golfbilar",
    type: "Golfbil",
    products: ["nm875-8et"],
    intro:
      "E-Z-GO TXT finns i både 36V- och 48V-utförande. Räkna antalet batterier i bilen innan du beställer, så vet du vilket system du har.",
  },
  {
    slug: "yamaha-drive",
    name: "Yamaha Drive",
    brand: "Yamaha",
    group: "golfbilar",
    type: "Golfbil",
    products: ["nm875-8et", "evgc8a-a-m8"],
    intro:
      "Yamaha Drive och G-MAX med 48V-system använder sex 8V-batterier. Kapaciteten avgör hur många rundor bilen klarar innan den måste till laddaren.",
  },

  /* ───────── Övriga fordon ───────── */
  {
    slug: "pallyftare",
    name: "Pallyftare",
    brand: null,
    group: "ovrigt",
    type: "Elektrisk pallyftare och ledstaplare",
    products: ["nm125-6et", "nm105-6et", "nm305g-et"],
    intro:
      "Elektriska pallyftare och ledstaplare går på traktionsbatterier som laddas ur djupt varje skift. Vanligast är 24V-system byggda av fyra 6V-batterier.",
  },
  {
    slug: "agv-fordon",
    name: "AGV och förarlösa truckar",
    brand: null,
    group: "ovrigt",
    type: "Förarlösa transportsystem",
    products: ["gf-06-240v", "evgc6a-a-m8", "ev305a-a-am"],
    intro:
      "Förarlösa transportsystem körs ofta dygnet runt och laddas i korta pass. Slutna gelbatterier är standard eftersom de är helt underhållsfria och kan monteras i valfritt läge.",
  },
  /*
   * Permobil är den enda posten i registret med mätbar egen efterfrågan:
   * "batteri till permobil" och "permobil batteri" ligger på 110 sök/mån
   * vardera, KD 0 (DataForSEO 2026-08-20, se research/sokordsdata-2026-08-20.md).
   * Alla 32 maskinmodeller i övrigt mäter noll. Därför är detta den enda posten
   * som bär de valfria fälten title/description/sections/faq, och sluggen är
   * "permobil" och inte "elrullstol" för att matcha sökfrasen exakt.
   *
   * Passformen vilar på spår 1: gf-12-076v, gf-12-063y, gf-12-052y och
   * gf-12-050v listar alla "elrullstolar" i sitt fitsTo i lib/products.js.
   * Ingen modellspecifik passform påstås någonstans på sidan, eftersom
   * Permobil inte publicerar batterimått per modell.
   */
  {
    slug: "permobil",
    name: "Permobil",
    brand: "Permobil",
    group: "ovrigt",
    type: "Permobil, elrullstol och elscooter",
    // Fallande kapacitet. 76 Ah först: den är både störst och billigare än 63 Ah.
    products: ["gf-12-076v", "gf-12-063y", "gf-12-052y", "gf-12-050v"],
    intro:
      "Permobil tillverkas i Timrå och drivs, som de flesta eldrivna rullstolar, av två 12V-batterier kopplade i serie till 24V. Batteriet måste vara slutet och spillsäkert eftersom det sitter tätt inpå brukaren. Kapaciteten är det som avgör räckvidden och det som skiljer modellerna åt.",
    title: "Batteri till Permobil och elrullstol | Batteriproffs",
    description:
      "Gelbatterier 12V som passar Permobil och andra eldrivna rullstolar, 50 till 76 Ah. Slutna och spillsäkra, priser öppet på sajten och passformsgaranti på köpet.",
    sections: [
      {
        h: "Vilken storlek sitter i din stol?",
        p: [
          "Kapaciteten varierar med modell och med hur långt stolen är byggd för att gå. Vanligast är någonstans mellan 50 och 80 Ah per batteri. Vi listar hela det spannet här.",
          "Läs etiketten på det batteri som sitter i nu. Där står spänningen i volt och kapaciteten i amperetimmar, och det är de två siffrorna du ska matcha. Är etiketten oläslig, mät batteriet i millimeter i stället och ring med måtten.",
        ],
      },
    ],
    faq: [
      {
        q: "Vad är det för batteri i en permobil?",
        a: "Två slutna 12V-batterier kopplade i serie, alltså ett 24V-system. De ska vara djupcykliga och spillsäkra, i praktiken gel eller AGM. Kapaciteten ligger vanligen mellan 50 och 80 Ah beroende på modell. Siffran med Ah på etiketten är den du ska matcha.",
      },
      {
        q: "Var kan jag byta batteri i min permobil?",
        a: "Batterierna sitter under sitsen och är åtkomliga utan specialverktyg på de flesta modeller, så bytet går att göra själv. Är stolen förskriven via regionen är det oftast hjälpmedelscentralen som står för både batteri och byte, och då ska du kontakta dem först. Har du köpt stolen själv skickar vi batterierna hem till dig.",
      },
      {
        q: "Hur länge räcker ett batteri på 100 Ah?",
        a: "Det beror på hur mycket drivsystemet drar. Vid ungefär 10 A i snitt räcker 100 Ah teoretiskt i tio timmar, men ett blybatteri ska inte urladdas under halva kapaciteten om det ska hålla i år. Räkna därför med runt hälften som användbar tid. Kyla drar ner det ytterligare, en kall vinterdag kan kosta 20 till 30 procent.",
      },
      {
        q: "Vad är skillnaden på AGM och vanligt batteri?",
        a: "Ett vanligt blybatteri är öppet, har flytande syra, avger gas vid laddning och kan läcka om det välter. Det hör inte hemma i en rullstol. AGM och gel är båda slutna och spillsäkra: AGM har syran bunden i en glasfibermatta, gel i en kiselgelé. Gel tål fler djupa urladdningar och klarar värme bättre, vilket är skälet till att vi lagerför gel.",
      },
    ],
  },
]

export const machineBySlug = (slug) => machines.find((m) => m.slug === slug) || null

export const machinesByGroup = (groupId) => machines.filter((m) => m.group === groupId)

/** Maskinerna som ett visst batteri passar till — ger länkar tillbaka från produktsidan. */
export const machinesForProduct = (productSlug) =>
  machines.filter((m) => m.products.includes(productSlug))
