import { publicProducts } from "./products"

export const SITE_NAME = "Batteriproffs"
export const SITE_URL = "https://www.batteriproffs.se"
export const PHONE = "076-686 77 52"
export const PHONE_LINK = "+46766867752"
export const EMAIL = "info@batteriproffs.se"

// Företagsadress. Krävs enligt e-handelslagen att den anges. Verksamheten är
// helt digital utan kundbesök, så det här är firmaadressen — skriv aldrig
// öppettider eller "besök oss" i anslutning till den.
export const ADDRESS = {
  gata: "Väringavägen 10",
  postnummer: "281 42",
  ort: "Hässleholm",
  land: "SE",
  rad: "Väringavägen 10, 281 42 Hässleholm",
}

/**
 * Säljande part.
 *
 * Alla kunder är företag och behöver ett underlag som duger i deras bokföring
 * för att kunna lyfta momsen. Då krävs säljarens namn, organisationsnummer,
 * momsregistreringsnummer, adress och momsbeloppet specificerat. Ordrar över
 * 4 000 kr inkl. moms kräver fullständig faktura, och sortimentet börjar på
 * 2 890 kr med frakt — alltså gäller det praktiskt taget varje order.
 *
 * Battericentralen skickar batteriet, men de är leverantör. Avtalspart mot
 * kunden är Joel Stolts enskilda firma, och det är den som ska stå här.
 *
 * ⚠️ MOMSNUMRET MÅSTE VERIFIERAS AV JOEL. För enskild firma är det SE +
 * personnumret utan bindestreck + 01. Stämmer det inte, eller är firman inte
 * momsregistrerad, är det ett större problem än den här filen: sajten tar ut
 * 25 % moms på varje order.
 */
export const SELJARE = {
  namn: "Joel Stolt",
  form: "enskild firma",
  orgnr: "901108-0851",
  momsnr: "SE901108085101",
  adress: "Väringavägen 10, 281 42 Hässleholm",
}

export const NAV_CATEGORIES = [
  { label: "Truck & Traktion", slug: "traktion-industri" },
  { label: "Städmaskiner", slug: "stadmaskiner" },
  { label: "UPS & Backup", slug: "stationara" },
  { label: "Fritid & Husvagn", slug: "fritid-solenergi" },
]

/**
 * Antalet får ALDRIG hårdkodas. Det stod länge 4 på städmaskiner och 19 på
 * alla, medan sortimentet vuxit till 5 respektive 20 — badgen på startsidan
 * ljög alltså för besökaren. Räknas ut ur publicProducts i stället, så en ny
 * produkt uppdaterar siffran av sig själv. Dolda testartiklar räknas inte med.
 */
function antal(slug) {
  return slug === "alla"
    ? publicProducts.length
    : publicProducts.filter((p) => p.category === slug).length
}

export const CATEGORIES = [
  {
    slug: "alla",
    title: "Alla batterier",
    desc: "Hela vårt sortiment av traktionsbatterier, gelbatterier och Dry Cell-batterier",
    icon: "",
    accent: "#2E86DE",
  },
  {
    slug: "traktion-industri",
    title: "Truckbatteri & Traktionsbatteri",
    desc: "Truckar · Golfbilar · Entreprenad · Bygg",
    icon: "🏗️",
    accent: "#2E86DE",
  },
  {
    slug: "stadmaskiner",
    title: "Gelbatteri städmaskin",
    desc: "Skurmaskiner · Poleringsmaskiner · Sopbilar",
    icon: "🧹",
    accent: "#27AE60",
  },
  {
    slug: "stationara",
    title: "UPS batteri & backup",
    desc: "Reservkraft · Hissar · Larm · Sprinklersystem",
    icon: "🔋",
    accent: "#8E44AD",
  },
  {
    slug: "fritid-solenergi",
    title: "Fritidsbatteri & Husvagnsbatteri",
    desc: "Husvagn · Husbil · Båt · 12V AGM och gel",
    icon: "☀️",
    accent: "#E67E22",
  },
].map((c) => ({ ...c, count: antal(c.slug) }))

/*
 * Skriv bara påståenden som går att verifiera utifrån.
 *
 * "20+ år i branschen" stod här till 2026-08-04 och är samma påstående som
 * enligt app/layout.js fick Google att flagga sajten för Felaktig
 * framställning. Det ströks ur metabeskrivningen 2026-08-03 men levde kvar
 * som synlig badge i footern och här.
 *
 * "30 dagars öppet köp" ströks samtidigt: kassan kräver organisationsnummer,
 * och vid företagsköp finns ingen ångerrätt. Ersatt av passformsgarantin,
 * som är det löfte vi faktiskt kan hålla. Villkoren står på /villkor.
 */
export const USPS = [
  // Tre löften som går att styrka och att klicka på. "Expertrådgivning" stod
  // här förut: ett ord utan belägg som inte ledde någonstans.
  { text: "Passformsgaranti", href: "/villkor#6-passformsgaranti" },
  { text: "Leverans normalt 1–3 arbetsdagar", href: "/villkor#3-frakt-och-leverans" },
  { text: "Verifierade omdömen", href: "/#kunder-rubrik" },
]

export const TRUST_ITEMS = [
  { icon: "🔄", text: "Passformsgaranti på alla batterier" },
  { icon: "⚡", text: "Leverans 1–3 arbetsdagar" },
  { icon: "🧑‍💼", text: "Personlig expertrådgivning" },
  { icon: "🏷️", text: "Priser utan offert" },
]
