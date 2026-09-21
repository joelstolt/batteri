import { createHash } from 'node:crypto'

export const ORIGIN = 'https://www.batteriproffs.se'
export const HOST = 'www.batteriproffs.se'
export const STATE_BRANCH = 'indexnow-state'
export const KEY = '194a88a18a3a4eaa18f55ab2f6a74722'
export const KEY_LOCATION = `${ORIGIN}/${KEY}.txt`
export const MANIFEST_URL = `${ORIGIN}/indexnow-manifest.json`
const shaPattern = /^[a-f0-9]{40}$/
const hashPattern = /^[a-f0-9]{64}$/

function stable(value) {
  if (Array.isArray(value)) return value.map(stable)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().filter(k => value[k] !== undefined).map(k => [k, stable(value[k])]))
  }
  return value
}
export const fingerprint = value => createHash('sha256').update(JSON.stringify(stable(value))).digest('hex')

export function validateManifest(manifest, expectedRevision) {
  if (!manifest || manifest.version !== 1 || manifest.origin !== ORIGIN || !shaPattern.test(manifest.revision)) throw new Error('Invalid manifest identity/revision')
  if (expectedRevision && manifest.revision !== expectedRevision) throw new Error(`Live revision ${manifest.revision} differs from deployment ${expectedRevision}`)
  if (!manifest.pages || Array.isArray(manifest.pages) || typeof manifest.pages !== 'object') throw new Error('Invalid manifest pages')
  const pages = Object.entries(manifest.pages)
  if (!pages.length || pages.length > 10000) throw new Error('Invalid manifest page count')
  for (const [url, hash] of pages) {
    const parsed = new URL(url)
    if (parsed.origin !== ORIGIN || parsed.username || parsed.password || parsed.search || parsed.hash || url !== `${ORIGIN}${parsed.pathname === '/' ? '' : parsed.pathname}` || !hashPattern.test(hash)) throw new Error(`Invalid canonical URL/hash: ${url}`)
    if (!/^\/(?:$|produkt\/[a-z0-9-]+$|kategori\/[a-z0-9-]+$|batteri-till(?:\/[a-z0-9-]+)?$|ersatter\/[a-z0-9-]+$|golfbilsbatteri$|solcellsbatteri-12v$|husbilsbatteri$|husvagnsbatteri$|marinbatteri$)/.test(parsed.pathname)) throw new Error(`Unsupported public path: ${url}`)
  }
  return manifest
}

export function diffManifests(previous, current, { initialProductsBootstrap = false } = {}) {
  validateManifest(current)
  if (previous) validateManifest(previous)
  else if (!initialProductsBootstrap) throw new Error('No acknowledged baseline. Run workflow_dispatch with initial_products_bootstrap=true after reviewing the 20 product URLs.')
  const before = previous?.pages || {}
  const added = Object.keys(current.pages).filter(url => !(url in before) && (previous || url.startsWith(`${ORIGIN}/produkt/`))).sort()
  const changed = Object.keys(current.pages).filter(url => url in before && before[url] !== current.pages[url]).sort()
  const removed = Object.keys(before).filter(url => !(url in current.pages)).sort()
  return { added, changed, removed, urls: [...added, ...changed, ...removed] }
}

export async function fetchLiveManifest(expectedRevision, { fetchImpl = fetch, attempts = 6, sleep = ms => new Promise(resolve => setTimeout(resolve, ms)) } = {}) {
  let lastError
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      const response = await fetchImpl(`${MANIFEST_URL}?revision=${expectedRevision}&check=${Date.now()}`, { cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(20000) })
      if (response.status !== 200) throw new Error(`Manifest HTTP ${response.status}`)
      return validateManifest(await response.json(), expectedRevision)
    } catch (error) { lastError = error }
    if (attempt + 1 < attempts) await sleep(15000)
  }
  throw lastError
}

export async function verifyOwnership(fetchImpl = fetch) {
  const response = await fetchImpl(KEY_LOCATION, { redirect: 'error', cache: 'no-store', signal: AbortSignal.timeout(20000) })
  if (response.status !== 200 || (await response.text()).trim() !== KEY) throw new Error('Live IndexNow ownership file does not match')
}

export async function verifyPages(diff, fetchImpl = fetch) {
  const removed = new Set(diff.removed)
  // Sequential requests avoid a crawl burst against the store.
  for (const url of diff.urls) {
    const response = await fetchImpl(url, { method: 'HEAD', redirect: 'manual', cache: 'no-store', signal: AbortSignal.timeout(20000) })
    const allowed = removed.has(url) ? [200, 301, 302, 307, 308, 404, 410] : [200]
    if (!allowed.includes(response.status)) throw new Error(`Live page HTTP ${response.status}: ${url}`)
    // Hidden products remain 200 + noindex; they are intentionally submitted as
    // removals so search engines can discover the new noindex themselves.
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location')
      if (!location || new URL(location, url).origin !== ORIGIN) throw new Error(`Off-host removal redirect: ${url}`)
    }
  }
}

export async function submitIndexNow(urls, { fetchImpl = fetch, sleep = ms => new Promise(resolve => setTimeout(resolve, ms)), attempts = 3 } = {}) {
  if (!urls.length) return
  for (let attempt = 0; attempt < attempts; attempt++) {
    const response = await fetchImpl('https://api.indexnow.org/indexnow', {
      method: 'POST', redirect: 'error', signal: AbortSignal.timeout(30000),
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: urls }),
    })
    if (response.status === 200) return
    if (response.status !== 202) throw new Error(`IndexNow HTTP ${response.status}; baseline NOT acknowledged`)
    console.warn(`IndexNow HTTP 202: ownership validation pending (${attempt + 1}/${attempts}); baseline NOT acknowledged`)
    if (attempt + 1 < attempts) await sleep(20000)
  }
  throw new Error('IndexNow remains HTTP 202 (pending). Rerun later; baseline NOT acknowledged.')
}
