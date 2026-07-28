/**
 * Maskinregister för /batteri-till/<maskin>
 *
 * Varje post är en maskin eller maskintyp som kunder faktiskt söker på, kopplad
 * till de batterier i sortimentet som passar. Kopplingarna kommer från
 * fitsTo-fältet i lib/products.js — hitta ALDRIG på en passform här. Står
 * maskinen inte i produktdatan ska den inte in i registret.
 *
 * Poängen: ingen söker "traktionsbatteri" när maskinen står still. De söker
 * "batteri till Nilfisk SC401". Volymen per sida är liten men avsikten total.
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
  {
    slug: "elrullstol",
    // "permobil batteri" har 110 sök/mån — namnet måste innehålla ordet
    name: "Permobil och elrullstol",
    brand: null,
    group: "ovrigt",
    type: "Permobil, elrullstol och elscooter",
    products: ["gf-12-050v", "gf-12-063y", "gf-12-052y"],
    intro:
      "Elrullstolar och permobiler drivs av två seriekopplade 12V-gelbatterier. Gel är ett krav i den här användningen eftersom batteriet sitter tätt inpå brukaren och inte får avge gas.",
  },
]

export const machineBySlug = (slug) => machines.find((m) => m.slug === slug) || null

export const machinesByGroup = (groupId) => machines.filter((m) => m.group === groupId)

/** Maskinerna som ett visst batteri passar till — ger länkar tillbaka från produktsidan. */
export const machinesForProduct = (productSlug) =>
  machines.filter((m) => m.products.includes(productSlug))
