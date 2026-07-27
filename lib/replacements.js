import { publicProducts } from "./products"

/**
 * Ersättningssidor — /ersatter/<originalbatteri>
 *
 * Härleds automatiskt ur specfältet "Ersätter" i produktdatan. Läggs ett nytt
 * batteri in med en Ersätter-uppgift dyker sidan upp av sig själv.
 *
 * Varför de här sidorna: den som söker på ett artikelnummer har redan bestämt
 * sig och letar bara efter var man beställer. "trojan t-125" har en
 * svårighetsgrad på 7 av 100 — i praktiken gratis trafik med köpavsikt.
 *
 * VIKTIGT om innehållet: vi påstår bara det produktdatan säger, alltså att vår
 * modell ersätter originalet och vilka mått och kapacitet VÅR modell har. Vi
 * påstår aldrig något om originalets specifikationer eller att vår är bättre —
 * det vore både osant underbyggt och onödigt.
 */

export function slugifyModel(model) {
  return String(model)
    .toLowerCase()
    .replace(/[åä]/g, "a")
    .replace(/ö/g, "o")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/** Alla ersättningar sortimentet täcker, en post per original. */
export const replacements = publicProducts
  .filter((p) => p.specs?.["Ersätter"])
  .map((p) => {
    const original = p.specs["Ersätter"]
    return {
      slug: slugifyModel(original),
      original,
      brand: original.split(" ")[0],
      product: p,
    }
  })

export const replacementBySlug = (slug) => replacements.find((r) => r.slug === slug) || null
