import { SITE_URL, CATEGORIES } from "@/lib/constants"
import { products } from "@/lib/products"

export default function sitemap() {
  const now = new Date()

  const staticPages = [
    { url: SITE_URL, priority: 1.0, changeFrequency: "weekly" },
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

  const productPages = products.map((p) => ({
    url: `${SITE_URL}/produkt/${p.slug}`,
    priority: 0.7,
    changeFrequency: "weekly",
  }))

  return [...staticPages, ...categoryPages, ...productPages].map((p) => ({
    ...p,
    lastModified: now,
  }))
}
