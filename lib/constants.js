export const SITE_NAME = "Batteriproffs"
export const SITE_URL = "https://www.batteriproffs.se"
export const PHONE = "073-554 69 68"
export const PHONE_LINK = "+46735546968"
export const EMAIL = "info@batteriproffs.se"

// Företagsadress. Krävs enligt e-handelslagen att den anges. Verksamheten är
// helt digital utan kundbesök, så det här är firmaadressen — skriv aldrig
// öppettider eller "besök oss" i anslutning till den.
export const ADDRESS = {
  gata: "Väringavägen 18",
  postnummer: "281 42",
  ort: "Hässleholm",
  land: "SE",
  rad: "Väringavägen 18, 281 42 Hässleholm",
}

export const NAV_CATEGORIES = [
  { label: "Truck & Traktion", slug: "traktion-industri" },
  { label: "Städmaskiner", slug: "stadmaskiner" },
  { label: "UPS & Backup", slug: "stationara" },
  { label: "Fritid & Husvagn", slug: "fritid-solenergi" },
]

export const CATEGORIES = [
  {
    slug: "alla",
    title: "Alla batterier",
    desc: "Hela vårt sortiment av traktionsbatterier, gelbatterier och Dry Cell-batterier",
    icon: "",
    count: 19,
    accent: "#2E86DE",
  },
  {
    slug: "traktion-industri",
    title: "Truckbatteri & Traktionsbatteri",
    desc: "Truckar · Golfbilar · Entreprenad · Bygg",
    icon: "🏗️",
    count: 9,
    accent: "#2E86DE",
  },
  {
    slug: "stadmaskiner",
    title: "Gelbatteri städmaskin",
    desc: "Skurmaskiner · Poleringsmaskiner · Sopbilar",
    icon: "🧹",
    count: 4,
    accent: "#27AE60",
  },
  {
    slug: "stationara",
    title: "UPS batteri & backup",
    desc: "Reservkraft · Hissar · Larm · Sprinklersystem",
    icon: "🔋",
    count: 2,
    accent: "#8E44AD",
  },
  {
    slug: "fritid-solenergi",
    title: "Fritidsbatteri & Husvagnsbatteri",
    desc: "Husvagn · Husbil · Båt · 12V AGM och gel",
    icon: "☀️",
    count: 4,
    accent: "#E67E22",
  },
]

export const USPS = [
  "Snabb leverans",
  "30 dagars öppet köp",
  "Expertrådgivning",
]

export const TRUST_ITEMS = [
  { icon: "🔄", text: "30 dagars öppet köp" },
  { icon: "⚡", text: "Leverans 1–3 arbetsdagar" },
  { icon: "🧑‍💼", text: "Personlig expertrådgivning" },
  { icon: "🏆", text: "20+ år i branschen" },
]
