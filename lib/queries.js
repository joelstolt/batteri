/**
 * INGET I SAJTEN LÄSER DEN HÄR FILEN.
 *
 * Sanity-datasetet innehåller noll produkter. Allt som visas kommer från
 * lib/products.js. Kassan var sista stället som gick via fetchProductBySlug,
 * och den kopplades bort 2026-07-29: Sanity-priset vann i kassan medan
 * produktsidan visade det hårdkodade, så ett köp kunde debiteras fel belopp.
 *
 * Filen ligger kvar för den dag CMS:et faktiskt ska tas i bruk. Koppla inte in
 * den igen utan att först bestämma vilken källa som äger priset — två källor
 * till pris är exakt buggen ovan.
 */
import { client, urlFor } from "./sanity"
import { products as hardcodedProducts, publicProducts } from "./products"
import { CATEGORIES as hardcodedCategories } from "./constants"

// Transform Sanity product to match our app format
function transformProduct(p) {
  return {
    slug: p.slug?.current || p.slug,
    name: p.name,
    shortName: p.shortName,
    category: p.category?.slug?.current || p.category,
    voltage: p.voltage,
    capacity: p.capacity,
    price: p.price,
    images: p.images?.map((img) => (typeof img === "string" ? img : urlFor(img).width(600).url())) || [],
    badge: p.badge || null,
    description: p.description,
    inStock: p.inStock !== false,
    specs: p.specs
      ? Object.fromEntries(p.specs.map((s) => [s.key, s.value]))
      : {},
  }
}

// Transform Sanity category
function transformCategory(c) {
  return {
    slug: c.slug?.current || c.slug,
    title: c.title,
    desc: c.description || "",
    icon: c.icon || "",
    count: c.productCount || 0,
    accent: c.accent || "#2E86DE",
    image: c.image ? urlFor(c.image).width(600).height(400).url() : null,
  }
}

/**
 * Slår ihop Sanity-innehåll med den hårdkodade listan.
 *
 * Tidigare ersatte Sanity hela resultatet så fort den returnerade minst en rad.
 * Det betydde att den dag någon lade in EN produkt i Sanity försvann alla
 * hårdkodade produkter i den kategorin tyst från sajten. Nu är den hårdkodade
 * listan alltid basen, och Sanity skriver över per slug och kan lägga till nya.
 */
function mergeWithFallback(sanityItems, fallbackItems) {
  if (!sanityItems || sanityItems.length === 0) return fallbackItems
  const bySlug = new Map(fallbackItems.map((p) => [p.slug, p]))
  for (const item of sanityItems) {
    if (item?.slug) bySlug.set(item.slug, item)
  }
  return Array.from(bySlug.values())
}

// Fetch all products by category
export async function fetchProductsByCategory(categorySlug) {
  try {
    const results = await client.fetch(
      `*[_type == "product" && category->slug.current == $slug] | order(sortOrder asc, name asc) {
        name, shortName, slug, voltage, capacity, price, images, badge, description, inStock, sortOrder,
        specs,
        "category": category->slug.current
      }`,
      { slug: categorySlug }
    )
    if (results && results.length > 0) {
      return mergeWithFallback(
        results.map(transformProduct),
        publicProducts.filter((p) => p.category === categorySlug)
      )
    }
  } catch (e) {
    console.log("Sanity fetch failed, using hardcoded data")
  }
  // Fallback to hardcoded
  return publicProducts.filter((p) => p.category === categorySlug)
}

// Fetch single product
export async function fetchProductBySlug(slug) {
  try {
    const result = await client.fetch(
      `*[_type == "product" && slug.current == $slug][0] {
        name, shortName, slug, voltage, capacity, price, images, badge, description, inStock,
        specs,
        "category": category->slug.current
      }`,
      { slug }
    )
    if (result) {
      return transformProduct(result)
    }
  } catch (e) {
    console.log("Sanity fetch failed, using hardcoded data")
  }
  // Fallback
  return hardcodedProducts.find((p) => p.slug === slug) || null
}

// Fetch all categories with product count
export async function fetchCategories() {
  try {
    const results = await client.fetch(
      `*[_type == "category"] | order(sortOrder asc) {
        title, slug, description, icon, accent, image,
        "productCount": count(*[_type == "product" && references(^._id)])
      }`
    )
    if (results && results.length > 0) {
      return results.map(transformCategory)
    }
  } catch (e) {
    console.log("Sanity fetch failed, using hardcoded data")
  }
  // Fallback
  return hardcodedCategories
}

// Fetch featured products (with badges)
export async function fetchFeaturedProducts() {
  try {
    const results = await client.fetch(
      `*[_type == "product" && defined(badge)] | order(sortOrder asc) [0...4] {
        name, shortName, slug, voltage, capacity, price, images, badge, description, inStock,
        specs,
        "category": category->slug.current
      }`
    )
    if (results && results.length > 0) {
      return mergeWithFallback(
        results.map(transformProduct),
        publicProducts.filter((p) => p.badge)
      ).slice(0, 4)
    }
  } catch (e) {
    console.log("Sanity fetch failed, using hardcoded data")
  }
  // Fallback
  return publicProducts.filter((p) => p.badge).slice(0, 4)
}

// Fetch all products (for search)
export async function fetchAllProducts() {
  try {
    const results = await client.fetch(
      `*[_type == "product"] | order(name asc) {
        name, shortName, slug, voltage, capacity, price, images, badge, description, inStock,
        specs,
        "category": category->slug.current
      }`
    )
    if (results && results.length > 0) {
      return mergeWithFallback(results.map(transformProduct), publicProducts)
    }
  } catch (e) {
    console.log("Sanity fetch failed, using hardcoded data")
  }
  return publicProducts
}
