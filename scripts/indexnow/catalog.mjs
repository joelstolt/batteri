import { fingerprint, ORIGIN, validateManifest } from './core.mjs'

// Inputs come only from the public catalogue. Hashes contain no customer/order
// data, clocks, build IDs or revision: rebuilding alone cannot change a page.
export function buildManifest({ revision, products, categories, machines, usages, replacements, relatedFor, templates = {}, assets = {} }) {
  const visible = products.filter(p => !p.hidden)
  const select = slugs => slugs.map(slug => visible.find(p => p.slug === slug)).filter(Boolean)
  const card = p => ({ slug: p.slug, name: p.name, shortName: p.shortName, voltage: p.voltage, capacity: p.capacity, price: p.price, image: p.images?.[0], imageHash: assets[p.images?.[0]], badge: p.badge, inStock: p.inStock, specs: p.specs, totalHeightUnverified: p.totalHeightUnverified })
  const pages = {}
  const add = (path, kind, content) => {
    const url = `${ORIGIN}${path}`
    if (url in pages) throw new Error(`Duplicate catalogue URL: ${url}`)
    pages[url] = fingerprint({ template: templates[kind], content })
  }
  for (const product of visible) {
    add(`/produkt/${product.slug}`, 'product', { product, imageHashes: product.images?.map(image => assets[image]), related: relatedFor(product).filter(p => !p.hidden).map(card), machines: machines.filter(m => m.products.includes(product.slug)), category: categories.find(c => c.slug === product.category)?.title })
  }
  for (const category of categories) {
    const members = category.slug === 'alla' ? visible : visible.filter(p => p.category === category.slug)
    add(`/kategori/${category.slug}`, 'category', { category: { ...category, count: members.length }, products: members.map(card) })
  }
  for (const machine of machines) add(`/batteri-till/${machine.slug}`, 'machine', { machine, products: select(machine.products).map(card) })
  add('/batteri-till', 'hub', machines.map(machine => ({ machine, prices: select(machine.products).map(p => p.price) })))
  for (const usage of usages) add(`/${usage.slug}`, 'usage', { usage, products: select(usage.produkter).map(card), packages: select((usage.paket || []).map(p => p.slug)).map(card) })
  for (const replacement of replacements) {
    const product = visible.find(p => p.slug === replacement.product.slug)
    if (product) add(`/ersatter/${replacement.slug}`, 'replacement', { ...replacement, product, imageHashes: product.images?.map(image => assets[image]) })
  }
  const featured = visible.filter(p => p.badge).slice(0, 8)
  featured.push(...visible.filter(p => !p.badge).sort((a, b) => b.price - a.price).slice(0, 8 - featured.length))
  add('', 'home', { products: featured.map(card), categories: categories.map(c => ({ ...c, count: c.slug === 'alla' ? visible.length : visible.filter(p => p.category === c.slug).length })) })
  return validateManifest({ version: 1, origin: ORIGIN, revision, pages: Object.fromEntries(Object.entries(pages).sort(([a], [b]) => a.localeCompare(b))) })
}
