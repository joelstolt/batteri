import { register } from 'node:module'
import { createHash } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import { buildManifest } from './catalog.mjs'
import { fingerprint } from './core.mjs'
register('./loader.mjs', import.meta.url)
const [{ products }, { CATEGORIES }, { machines }, { anvandningar }, { replacements }, { relatedProducts }] = await Promise.all([
  import('../../lib/products.js'), import('../../lib/constants.js'), import('../../lib/machines.js'), import('../../lib/anvandning.js'), import('../../lib/replacements.js'), import('../../lib/product-selection.js'),
])
// Do not hash products.js wholesale: doing so would notify every unrelated page.
// Hash rendering modules to also catch deploy-time copy/schema/template changes.
const sources = {
  product: ['app/produkt/[slug]/page.js', 'components/ProductPageContent.jsx', 'components/ProductDocuments.jsx', 'components/ProductCard.jsx', 'lib/product-schema.js', 'lib/product-discovery.js', 'lib/product-evidence.js', 'lib/product-selection.js', 'lib/teknik.js', 'lib/store-policy.js'],
  category: ['app/kategori/[slug]/page.js', 'components/CategoryPageContent.jsx', 'components/ProductCard.jsx', 'lib/product-selection.js'],
  machine: ['app/batteri-till/[slug]/page.js', 'components/MachinePageContent.jsx', 'components/ProductCard.jsx'],
  hub: ['app/batteri-till/page.js'],
  replacement: ['app/ersatter/[slug]/page.js', 'components/ProductCard.jsx'],
  usage: ['components/AnvandningRoute.jsx', 'components/AnvandningPageContent.jsx', 'components/ProductCard.jsx'],
  home: ['app/page.js', 'components/FeaturedProducts.jsx', 'components/ProductCard.jsx', 'components/Categories.jsx'],
}
const sharedSources = ['app/layout.js', 'components/Header.jsx', 'components/Footer.jsx', 'components/TopBar.jsx', 'components/CtaBanner.jsx', 'lib/constants.js', 'lib/schema.js', 'lib/store-policy.js']
const sharedHash = fingerprint(await Promise.all(sharedSources.map(path => readFile(new URL(`../../${path}`, import.meta.url), 'utf8'))))
const templates = {}
for (const [kind, paths] of Object.entries(sources)) templates[kind] = fingerprint([sharedHash, await Promise.all(paths.map(path => readFile(new URL(`../../${path}`, import.meta.url), 'utf8')))])
const assets = {}
for (const path of new Set(products.filter(p => !p.hidden).flatMap(p => p.images || []))) {
  if (path.startsWith('/') && !path.startsWith('//')) {
    assets[path] = createHash('sha256').update(await readFile(new URL(`../../public${path}`, import.meta.url))).digest('hex')
  }
}
const revision = process.env.VERCEL_GIT_COMMIT_SHA || execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim()
const manifest = buildManifest({ revision, products, categories: CATEGORIES, machines, usages: anvandningar, replacements, relatedFor: relatedProducts, templates, assets })
await writeFile(new URL('../../public/indexnow-manifest.json', import.meta.url), `${JSON.stringify(manifest, null, 2)}\n`)
console.log(`IndexNow manifest: ${Object.keys(manifest.pages).length} public URLs, revision ${revision}`)
