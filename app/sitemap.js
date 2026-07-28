import { SITE_URL, CATEGORIES } from "@/lib/constants"
import { publicProducts } from "@/lib/products"
import { machines } from "@/lib/machines"
import { replacements } from "@/lib/replacements"

export default function sitemap() {
  const now = new Date()

  const staticPages = [
    { url: SITE_URL, priority: 1.0, changeFrequency: "weekly" },
    { url: `${SITE_URL}/batteri-till`, priority: 0.9, changeFrequency: "weekly" },
    { url: `${SITE_URL}/laddare`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${SITE_URL}/batterivatten`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${SITE_URL}/faq`, priority: 0.6, changeFrequency: "monthly" },
    { url: `${SITE_URL}/skotsel`, priority: 0.6, changeFrequency: "monthly" },
    { url: `${SITE_URL}/kontakt`, priority: 0.5, changeFrequency: "yearly" },
    { url: `${SITE_URL}/om-oss`, priority: 0.5, changeFrequency: "yearly" },
    { url: `${SITE_URL}/villkor`, priority: 0.3, changeFrequency: "yearly" },
    { url: `${SITE_URL}/integritet`, priority: 0.3, changeFrequency: "yearly" },
  ]

  const categoryPages = CATEGORIES.map((c) => ({
    url: `${SITE_URL}/kategori/${c.slug}`,
    priority: 0.8,
    changeFrequency: "weekly",
  }))

  const productPages = publicProducts.map((p) => ({
    url: `${SITE_URL}/produkt/${p.slug}`,
    priority: 0.7,
    changeFrequency: "weekly",
  }))

  // Maskinsidorna är hela poängen med långsvans-strategin — de ska in i sitemap
  const machinePages = machines.map((m) => ({
    url: `${SITE_URL}/batteri-till/${m.slug}`,
    priority: 0.8,
    changeFrequency: "monthly",
  }))

  const replacementPages = replacements.map((r) => ({
    url: `${SITE_URL}/ersatter/${r.slug}`,
    priority: 0.8,
    changeFrequency: "monthly",
  }))

  return [
    ...staticPages,
    ...categoryPages,
    ...productPages,
    ...machinePages,
    ...replacementPages,
  ].map((p) => ({
    ...p,
    lastModified: now,
  }))
}
