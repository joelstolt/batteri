// Genererar chatbot-widgetens KÄLLDATA-blob ur butikens RIKTIGA data.
// Kör med: npx tsx scripts/build-chatbot-blob.mjs
// Output: ../../products/chatbot-widget/content-blobs/batteriproffs.txt
//
// Regeln från lib/replacements.js gäller hela vägen: vi påstår bara det
// produktdatan säger. Ändras sortiment eller priser — kör om skriptet och
// deploya widgeten, annars svarar boten med gamla priser.

import { writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const har = dirname(fileURLToPath(import.meta.url))

const { publicProducts } = await import("../lib/products.js")
const { machines } = await import("../lib/machines.js")
const { replacements } = await import("../lib/replacements.js")
const { anvandningar } = await import("../lib/anvandning.js")

const exkl = (kr) => Math.round(kr / 1.25)

const rader = []

rader.push("PRISER: alla priser nedan är i svenska kronor INKLUSIVE moms.")
rader.push("Exklusive moms = priset delat med 1,25 (anges nedan per produkt).")
rader.push("Frakt: 695 kr inkl moms per order (pallgods), oavsett antal batterier.")
rader.push("")

rader.push(`SORTIMENT (${publicProducts.length} produkter)`)
for (const p of publicProducts) {
  const s = p.specs || {}
  const delar = [
    `${p.name}`,
    `Artikelnummer: ${s["Artikelnummer"] || p.slug}`,
    `${p.voltage}, ${p.capacity}`,
    `Pris: ${p.price} kr inkl moms (${exkl(p.price)} kr exkl moms)`,
    s["Typ"] ? `Typ: ${s["Typ"]}` : null,
    s["Mått"] ? `Mått: ${s["Mått"]}` : null,
    s["Ersätter"] ? `Ersätter: ${s["Ersätter"]}` : null,
    p.fitsTo ? `Passar: ${p.fitsTo}` : null,
    p.recommendedCharger ? `Rekommenderad laddare: ${p.recommendedCharger}` : null,
    `Sida: /produkt/${p.slug}`,
  ].filter(Boolean)
  rader.push(`- ${delar.join(" | ")}`)
}
rader.push("")

rader.push("ERSÄTTNINGSGUIDE (originalbatteri -> vår direkta ersättare)")
for (const r of replacements) {
  rader.push(
    `- ${r.original} ersätts av ${r.product.name} (${r.product.price} kr inkl moms) | Sida: /ersatter/${r.slug}`
  )
}
rader.push("")

rader.push("MASKINGUIDE (maskinmodell -> batterisida med passande produkter)")
for (const m of machines) {
  const prods = (m.products || [])
    .map((slug) => publicProducts.find((p) => p.slug === slug))
    .filter(Boolean)
    .map((p) => `${p.specs?.["Artikelnummer"] || p.slug} (${p.price} kr)`)
    .join(", ")
  rader.push(`- ${m.name} (${m.type}): ${prods || "se sidan"} | Sida: /batteri-till/${m.slug}`)
}
rader.push("")
rader.push(
  "VIKTIGT OM PASSFORM: guiden ovan är komplett. Maskiner som INTE står här kan du ALDRIG bekräfta passform för — be om modellbeteckning och mejladress i stället."
)
rader.push("")

rader.push("ANVÄNDNINGSSIDOR (guider per användningsområde)")
for (const a of anvandningar) {
  rader.push(`- ${a.h1} | Sida: /${a.slug}`)
}
rader.push("- Batteriladdare | Sida: /laddare")
rader.push("- Batterivatten och påfyllning | Sida: /batterivatten")
rader.push("")

rader.push("KÖP OCH VILLKOR")
rader.push("- Kassan säljer till FÖRETAG (organisationsnummer krävs, enskild firma fungerar). Betalning med kort.")
rader.push("- Leverans normalt 1-3 arbetsdagar, order före 14 på vardagar skickas i regel samma dag. Ge aldrig ett datum som garanti.")
rader.push("- Retur (företagsköp): 14 dagar, godkännande i förväg, obruten förpackning som aldrig kopplats in, returavdrag 30 %, kunden står returfrakten. Fullständiga villkor: /villkor")
rader.push("- Passformsgaranti: har butiken rekommenderat fel batteri står butiken för allt; har kunden valt själv byts varan utan avdrag men kunden står returfrakten.")
rader.push("- Kundkonto och orderstatus: /konto (inloggning via mejllänk, adressen på ordern är kontot).")
rader.push("- Kontakt: chatten (snabbast) eller info@batteriproffs.se. Kontaktformulär: /kontakt")

const blob = rader.join("\n")
const ut = join(har, "../../../products/chatbot-widget/content-blobs/batteriproffs.txt")
writeFileSync(ut, blob)
console.log(`Skrev ${blob.length.toLocaleString("sv-SE")} tecken till ${ut}`)
