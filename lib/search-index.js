import { machines } from "./machines"
import { publicProducts } from "./products"
import { replacements } from "./replacements"

/**
 * Ett sökregister över allt en besökare kan tänkas skriva in: maskinmodeller,
 * batterier och gamla artikelnummer vi ersätter.
 *
 * Poängen med heron är att besökaren skriver "nilfisk sc4" och får svaret
 * direkt. Registret byggs en gång vid modulladdning — datan är statisk och
 * ryms i minnet flera gånger om.
 */

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
    nycklar: [r.original, r.slug, r.product.shortName].map(normalisera),
  })),

  // Batterierna själva
  ...publicProducts.map((p) => ({
    typ: "produkt",
    titel: p.shortName,
    undertitel: `${p.voltage} · ${p.capacity}`,
    href: `/produkt/${p.slug}`,
    pris: p.price,
    nycklar: [p.shortName, p.name, p.slug, p.voltage, p.capacity, p.specs?.["Artikelnummer"] || ""].map(
      normalisera
    ),
  })),
]

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

  const vikt = { maskin: 0, ersattning: 1, produkt: 2 }

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
