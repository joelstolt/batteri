import test from 'node:test'
import assert from 'node:assert/strict'
import { register } from 'node:module'
import { readFile } from 'node:fs/promises'
import { buildManifest } from '../scripts/indexnow/catalog.mjs'
import { ORIGIN, KEY, KEY_LOCATION, MANIFEST_URL, fingerprint, validateManifest, diffManifests, fetchLiveManifest, verifyOwnership, verifyPages, submitIndexNow } from '../scripts/indexnow/core.mjs'
import { run } from '../scripts/indexnow/run.mjs'
import { saveState } from '../scripts/indexnow/github.mjs'
register('../scripts/indexnow/loader.mjs', import.meta.url)
const [{ products }, { CATEGORIES }, { machines }, { anvandningar }, { replacements }, { relatedProducts }] = await Promise.all([
  import('../lib/products.js'), import('../lib/constants.js'), import('../lib/machines.js'), import('../lib/anvandning.js'), import('../lib/replacements.js'), import('../lib/product-selection.js'),
])
const revision = 'a'.repeat(40)
const nextRevision = 'b'.repeat(40)
const url = `${ORIGIN}/produkt/example`
const manifest = (hash = fingerprint('original'), sha = revision) => ({ version: 1, origin: ORIGIN, revision: sha, pages: { [url]: hash } })
const catalogue = () => buildManifest({ revision, products, categories: CATEGORIES, machines, usages: anvandningar, replacements, relatedFor: relatedProducts })
const response = (status, value = '', headers = {}) => new Response(typeof value === 'string' ? value : JSON.stringify(value), { status, headers })
const noSleep = async () => {}

// These run against the actual catalogue, not a second fixture catalogue.
test('initial bootstrap contains exactly the 20 public products; private pages stay out', () => {
  const current = catalogue()
  const diff = diffManifests(null, current, { initialProductsBootstrap: true })
  assert.equal(diff.urls.length, 20)
  assert.deepEqual(diff.urls, products.filter(p => !p.hidden).map(p => `${ORIGIN}/produkt/${p.slug}`).sort())
  assert.equal(Object.keys(current.pages).length, 68)
  for (const p of products.filter(p => p.hidden)) assert.equal(current.pages[`${ORIGIN}/produkt/${p.slug}`], undefined)
  assert.throws(() => diffManifests(null, current), /No acknowledged baseline/)
})

test('fingerprints ignore object key order and deploy revision, unchanged reruns are empty', () => {
  assert.equal(fingerprint({ b: 2, a: 1 }), fingerprint({ a: 1, b: 2 }))
  assert.deepEqual(diffManifests(manifest(), manifest(undefined, nextRevision)).urls, [])
  assert.deepEqual(diffManifests(catalogue(), catalogue()).urls, [])
})

for (const field of ['price', 'inStock', 'specs']) {
  test(`real ${field} change reaches product, relevant listings and related cards only`, () => {
    const product = products.find(p => p.slug === 'nm125-6et')
    const before = catalogue()
    const old = product[field]
    try {
      product[field] = field === 'price' ? old + 100 : field === 'inStock' ? !old : { ...old, Mått: '261 × 180 × 279 mm' }
      const diff = diffManifests(before, catalogue())
      assert.ok(diff.changed.includes(`${ORIGIN}/produkt/nm125-6et`))
      assert.ok(diff.changed.includes(`${ORIGIN}/kategori/traktion-industri`))
      assert.ok(diff.changed.includes(`${ORIGIN}/kategori/alla`))
      assert.ok(diff.changed.includes(`${ORIGIN}/ersatter/trojan-t-125`))
      assert.ok(diff.changed.includes(`${ORIGIN}/batteri-till/club-car-ds-36v`) || diff.changed.some(u => u.startsWith(`${ORIGIN}/batteri-till/`)))
      assert.ok(!diff.changed.includes(`${ORIGIN}/kategori/stationara`))
      if (field === 'price') {
        assert.ok(diff.changed.includes(`${ORIGIN}/batteri-till`))
        assert.ok(diff.changed.filter(u => u.startsWith(`${ORIGIN}/produkt/`)).length > 1)
      }
    } finally { product[field] = old }
  })
}

test('hidden/deleted products are submitted as removals and disappear from listings', () => {
  const product = products.find(p => p.slug === 'nm125-6et')
  const before = catalogue()
  try {
    product.hidden = true
    const diff = diffManifests(before, catalogue())
    assert.ok(diff.removed.includes(`${ORIGIN}/produkt/${product.slug}`))
    assert.ok(diff.removed.includes(`${ORIGIN}/ersatter/trojan-t-125`))
    assert.ok(diff.changed.includes(`${ORIGIN}/kategori/traktion-industri`))
  } finally { delete product.hidden }
  const current = manifest()
  const extra = `${ORIGIN}/produkt/deleted`
  assert.deepEqual(diffManifests({ ...current, pages: { ...current.pages, [extra]: fingerprint(1) } }, current).removed, [extra])
})

test('category migration updates both category memberships', () => {
  const product = products.find(p => p.slug === 'nm125-6et')
  const before = catalogue()
  const old = product.category
  try {
    product.category = 'stationara'
    const diff = diffManifests(before, catalogue())
    assert.ok(diff.changed.includes(`${ORIGIN}/kategori/stationara`))
    assert.ok(diff.changed.includes(`${ORIGIN}/kategori/traktion-industri`))
  } finally { product.category = old }
})

test('host, path, hash, revision and manifest schema validation fail closed', () => {
  for (const badUrl of ['https://evil.test/produkt/example', 'http://www.batteriproffs.se/produkt/example', `${url}?foo=bar`, `${url}#x`, `${ORIGIN}/api/private`, `${ORIGIN}/kassa`, `${ORIGIN}/produkt/../api/private`]) {
    assert.throws(() => validateManifest({ ...manifest(), pages: { [badUrl]: fingerprint(1) } }))
  }
  assert.throws(() => validateManifest({ ...manifest(), origin: 'https://evil.test' }))
  assert.throws(() => validateManifest({ ...manifest(), pages: {} }))
  assert.throws(() => validateManifest({ ...manifest(), revision: 'not-a-sha' }))
  assert.throws(() => validateManifest({ ...manifest(), pages: { [url]: 'bad' } }))
  assert.throws(() => validateManifest(manifest(), nextRevision), /differs/)
})

test('stale revision, HTTP errors and bad ownership fail; revision rollout retries', async () => {
  await assert.rejects(fetchLiveManifest(nextRevision, { attempts: 1, fetchImpl: async () => response(200, manifest()) }), /differs/)
  await assert.rejects(fetchLiveManifest(revision, { attempts: 1, fetchImpl: async () => response(503) }), /503/)
  await assert.rejects(verifyOwnership(async () => response(200, 'wrong-key')), /ownership/)
  let calls = 0
  const live = await fetchLiveManifest(nextRevision, { sleep: noSleep, fetchImpl: async () => response(200, manifest(undefined, calls++ ? nextRevision : revision)) })
  assert.equal(live.revision, nextRevision)
})

test('only 200 acknowledges; pending 202 retries, 4xx/5xx are visible errors', async () => {
  for (const status of [400, 403, 422, 429, 500, 503]) await assert.rejects(submitIndexNow([url], { fetchImpl: async () => response(status) }), new RegExp(String(status)))
  await assert.rejects(submitIndexNow([url], { sleep: noSleep, fetchImpl: async () => response(202) }), /pending/)
  let attempts = 0
  await submitIndexNow([url], { sleep: noSleep, fetchImpl: async (_url, options) => {
    assert.equal(JSON.parse(options.body).keyLocation, KEY_LOCATION)
    assert.deepEqual(JSON.parse(options.body).urlList, [url])
    return response(attempts++ === 0 ? 202 : 200)
  } })
  assert.equal(attempts, 2)
})

test('live removals accept 404/noindex 200/onsite redirects; additions require 200', async () => {
  await verifyPages({ urls: [url], removed: [url] }, async () => response(404))
  await verifyPages({ urls: [url], removed: [url] }, async () => response(200))
  await verifyPages({ urls: [url], removed: [url] }, async () => response(301, '', { location: '/kategori/alla' }))
  await assert.rejects(verifyPages({ urls: [url], removed: [] }, async () => response(404)), /404/)
  await assert.rejects(verifyPages({ urls: [url], removed: [url] }, async () => response(302, '', { location: 'https://evil.test' })), /Off-host/)
})

function pipelineFixture({ previous = manifest(), current = manifest(fingerprint('changed'), nextRevision), submitStatus = 200, changeOnRecheck = false } = {}) {
  const writes = []
  const posts = []
  let manifestReads = 0
  const api = async (path, options = {}) => {
    if (options.method) { writes.push({ path, ...options }); return { sha: 'c'.repeat(40) } }
    if (path.startsWith('git/ref/')) return previous ? { object: { sha: 'd'.repeat(40) } } : null
    if (path.startsWith('contents/')) return { encoding: 'base64', content: Buffer.from(JSON.stringify(previous)).toString('base64') }
    throw new Error(`Unexpected API path ${path}`)
  }
  const fetchImpl = async (address, options) => {
    if (address.startsWith(MANIFEST_URL)) {
      manifestReads++
      return response(200, changeOnRecheck && manifestReads > 1 ? manifest(undefined, revision) : current)
    }
    if (address === KEY_LOCATION) return response(200, KEY)
    if (address === 'https://api.indexnow.org/indexnow') { posts.push(options); return response(submitStatus) }
    if (options.method === 'HEAD') return response(200)
    throw new Error(`Unexpected URL ${address}`)
  }
  return { api, fetchImpl, writes, posts, revision: current.revision, sleep: noSleep, report: () => {} }
}

test('pipeline saves only after acceptance; dry run, stale recheck and failures never save', async () => {
  const success = pipelineFixture()
  await run({ ...success, dryRun: false })
  assert.equal(success.posts.length, 1)
  assert.equal(success.writes.length, 3)
  assert.equal(success.writes.at(-1).body.force, false)
  const tree = success.writes[0].body.tree
  assert.deepEqual(tree.map(f => f.path), ['manifest.json', 'README.md', 'vercel.json'])
  assert.equal(JSON.parse(tree[2].content).git.deploymentEnabled, false)
  for (const submitStatus of [202, 429, 500]) {
    const failed = pipelineFixture({ submitStatus })
    await assert.rejects(run({ ...failed, dryRun: false }))
    assert.equal(failed.writes.length, 0)
  }
  const dry = pipelineFixture()
  await run(dry)
  assert.equal(dry.posts.length + dry.writes.length, 0)
  const stale = pipelineFixture({ changeOnRecheck: true })
  await assert.rejects(run({ ...stale, dryRun: false }), /differs/)
  assert.equal(stale.posts.length + stale.writes.length, 0)
})

test('unchanged retry posts nothing; missing baseline asks for explicit bootstrap', async () => {
  const fixture = pipelineFixture({ previous: manifest(), current: manifest() })
  await run({ ...fixture, dryRun: false })
  assert.equal(fixture.posts.length + fixture.writes.length, 0)
  const empty = pipelineFixture({ previous: null })
  const result = await run({ ...empty, dryRun: false })
  assert.equal(result.actionRequired, true)
  assert.equal(empty.posts.length + empty.writes.length, 0)
  await run({ ...empty, dryRun: false, initialProductsBootstrap: true })
  assert.equal(empty.posts.length, 1)
  assert.deepEqual(empty.writes[1].body.parents, [])
})

test('concurrent state writer is not force-overwritten', async () => {
  const writes = []
  const api = async (path, options) => {
    writes.push(options)
    if (options.method === 'PATCH') throw new Error('GitHub non-fast-forward HTTP 422')
    return { sha: 'c'.repeat(40) }
  }
  await assert.rejects(saveState(api, { head: 'd'.repeat(40) }, manifest()), /422/)
  assert.equal(writes.at(-1).body.force, false)
})

test('workflow serializes runs, checks production bot, and executes default-branch code only', async () => {
  const workflow = await readFile(new URL('../.github/workflows/indexnow.yml', import.meta.url), 'utf8')
  assert.match(workflow, /group: indexnow-production-catalogue\n  cancel-in-progress: false/)
  assert.match(workflow, /DEFAULT_BRANCH: \$\{\{ github.event.repository.default_branch \}\}/)
  assert.match(workflow, /deployment.environment == 'Production'/)
  assert.match(workflow, /deployment_status.creator.login == 'vercel\[bot\]'/)
  assert.match(workflow, /commits\/\$DEFAULT_BRANCH/)
  assert.match(workflow, /\?ref=\$TRUSTED_SHA/)
  assert.match(workflow, /for module in core github run/)
  assert.doesNotMatch(workflow, /actions\/checkout/)
})


test('replacing local image bytes changes product and its cards without changing the URL', () => {
  const args = { revision, products, categories: CATEGORIES, machines, usages: anvandningar, replacements, relatedFor: relatedProducts }
  const product = products.find(p => p.slug === 'nm125-6et')
  const before = buildManifest({ ...args, assets: { [product.images[0]]: fingerprint('old bytes') } })
  const after = buildManifest({ ...args, assets: { [product.images[0]]: fingerprint('new bytes') } })
  const diff = diffManifests(before, after)
  assert.ok(diff.changed.includes(`${ORIGIN}/produkt/${product.slug}`))
  assert.ok(diff.changed.includes(`${ORIGIN}/ersatter/trojan-t-125`))
  assert.ok(diff.changed.includes(`${ORIGIN}/kategori/traktion-industri`))
  assert.ok(!diff.changed.includes(`${ORIGIN}/kategori/stationara`))
})
