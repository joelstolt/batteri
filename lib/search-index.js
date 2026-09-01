import { machines } from "./machines"
import { publicProducts } from "./products"
import { replacements } from "./replacements"
import { anvandningar } from "./anvandning"
import { CATEGORIES } from "./constants"

/**
 * Ett sökregister över allt en besökare kan tänkas skriva in: maskinmodeller,
 * batterier och gamla artikelnummer vi ersätter.
 *
 * Poängen med heron är att besökaren skriver "nilfisk sc4" och får svaret
 * direkt. Registret byggs en gång vid modulladdning — datan är statisk och
 * ryms i minnet flera gånger om.
 */

function bildFor(slugs) {
  for (const slug of slugs) {
    const p = publicProducts.find((x) => x.slug === slug)
    if (p?.images?.[0]) return p.images[0]
  }
  return null
}

function priceFrom(slugs) {
  const priser = slugs
    .map((s) => publicProducts.find((p) => p.slug === s)?.price)
    .filter(Boolean)
  return priser.length ? Math.min(...priser) : null
}

/** Normaliserar bort skiljetecken och svenska tecken så "BR 55/40" matchar "br5540". */
export function normalisera(s) {
  return String(s)
    .toLowerCase()
    .replace(/[åä]/g, "a")
    .replace(/ö/g, "o")
    .replace(/[^a-z0-9]/g, "")
}

const poster = [
  // Maskiner först — det är så B2B-köpare faktiskt letar
  ...machines.map((m) => ({
    typ: "maskin",
    titel: m.name,
    undertitel: m.type,
    href: `/batteri-till/${m.slug}`,
    pris: priceFrom(m.products),
    bild: bildFor(m.products),
    // Sökbart: namn, typ, varumärke och slug
    nycklar: [m.name, m.type, m.brand || "", m.slug].map(normalisera),
  })),

  // Ersättningar — den som söker på ett artikelnummer har redan bestämt sig
  ...replacements.map((r) => ({
    typ: "ersattning",
    titel: r.original,
    undertitel: `Ersätts av ${r.product.shortName}`,
    href: `/ersatter/${r.slug}`,
    pris: r.product.price,
    bild: r.product.images?.[0] || null,
    nycklar: [r.original, r.slug, r.product.shortName].map(normalisera),
  })),

  // Batterierna själva
  ...publicProducts.map((p) => ({
    typ: "produkt",
    titel: p.shortName,
    undertitel: `${p.voltage} · ${p.capacity}`,
    href: `/produkt/${p.slug}`,
    pris: p.price,
    bild: p.images?.[0] || null,
    nycklar: [p.shortName, p.name, p.slug, p.voltage, p.capacity, p.specs?.["Artikelnummer"] || ""].map(
      normalisera
    ),
  })),

  /*
   * Kategorier, användningssidor och guider. Mätningen visade att 15 av 22
   * sökningar gav noll träffar — och bland dem fanns "truckbatteri" och
   * "laddare", ord som är hela kategorier här. Registret kände bara till
   * produkter, maskiner och ersättningar; det som saknades var sidorna själva.
   * Nyckelorden nedan är kundens egna ord, inte påhittade produktpåståenden.
   */
  ...CATEGORIES.filter((c) => c.slug !== "alla").map((c) => ({
    typ: "sida",
    titel: c.title,
    undertitel: c.desc,
    href: `/kategori/${c.slug}`,
    pris: null,
    bild: null,
    nycklar: [
      c.title,
      c.desc,
      c.slug,
      {
        "traktion-industri": "truckbatteri traktionsbatteri truck saxlift lift industribatteri",
        stadmaskiner: "stadmaskin skurmaskin sopmaskin gelbatteri kombiskurmaskin",
        stationara: "ups batteri reservkraft backup blybatteri agm hiss larm",
        "fritid-solenergi": "fritidsbatteri husvagn husbil bat marin solcell forbrukningsbatteri",
      }[c.slug] || "",
    ].map(normalisera),
  })),

  ...anvandningar.map((a) => ({
    typ: "sida",
    titel: a.h1,
    undertitel: a.eyebrow,
    href: `/${a.slug}`,
    pris: null,
    bild: null,
    nycklar: [a.h1, a.eyebrow, a.slug].map(normalisera),
  })),

  {
    typ: "sida",
    titel: "Batteriladdare",
    undertitel: "Laddare till traktions- och gelbatterier",
    href: "/laddare",
    pris: null,
    bild: null,
    nycklar: ["laddare", "batteriladdare", "laddning", "ladda batteri"].map(normalisera),
  },
  {
    typ: "sida",
    titel: "Batterivatten",
    undertitel: "Destillerat vatten och påfyllning",
    href: "/batterivatten",
    pris: null,
    bild: null,
    nycklar: ["batterivatten", "destillerat vatten", "avjoniserat vatten", "pafyllning syra"].map(
      normalisera
    ),
  },
]

/**
 * Är frågan lång nog att söka på?
 *
 * Måste användas av UI:t också. "T-" är två tecken på skärmen men bara ett
 * efter normalisering, och räknade de olika öppnades resultatrutan och sa
 * "ingen träff" trots att ingen sökning gjorts.
 */
export function sokbar(query) {
  return String(query)
    .split(/\s+/)
    .map(normalisera)
    .join("").length >= 2
}

/**
 * Söker i registret. Maskiner rankas före ersättningar före produkter, och
 * inom varje typ går träffar i början av namnet före träffar mitt inne.
 */
export function sok(query, max = 6) {
  // Varje ord söks för sig och alla måste finnas. Utan det gav "hako b120"
  // noll träffar, eftersom maskinen heter "Hako Scrubmaster B120" och orden
  // inte sitter ihop. Folk skriver delar av namnet med hopp emellan.
  const ord = String(query)
    .split(/\s+/)
    .map(normalisera)
    .filter((o) => o.length > 0)

  if (ord.length === 0 || ord.join("").length < 2) return []

  const vikt = { maskin: 0, ersattning: 1, produkt: 2, sida: 3 }

  return poster
    .map((post) => {
      let bast = -1
      for (const o of ord) {
        // Ordet måste finnas i minst en av postens nycklar
        let hittad = -1
        for (const nyckel of post.nycklar) {
          const i = nyckel.indexOf(o)
          if (i !== -1 && (hittad === -1 || i < hittad)) hittad = i
        }
        if (hittad === -1) return null
        if (bast === -1 || hittad < bast) bast = hittad
      }
      return { ...post, traff: bast }
    })
    .filter(Boolean)
    .sort((a, b) => a.traff - b.traff || vikt[a.typ] - vikt[b.typ])
    .slice(0, max)
}
