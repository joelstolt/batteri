import { readFile, appendFile } from 'node:fs/promises'
import { diffManifests, fetchLiveManifest, verifyOwnership, verifyPages, submitIndexNow } from './core.mjs'
import { githubClient, loadState, saveState } from './github.mjs'

export async function run({ revision, dryRun = true, initialProductsBootstrap = false, api, fetchImpl = fetch, sleep, report = console.log }) {
  if (!/^[a-f0-9]{40}$/.test(revision || '')) throw new Error('Expected an explicit 40-character deployment revision')
  const current = await fetchLiveManifest(revision, { fetchImpl, sleep })
  await verifyOwnership(fetchImpl)
  const state = await loadState(api)
  if (!state.manifest && !initialProductsBootstrap) {
    await report('ACTION REQUIRED: no acknowledged baseline. Run workflow_dispatch with initial_products_bootstrap=true, dry_run=true, review the product list, then dry_run=false.')
    return { actionRequired: true }
  }
  const diff = diffManifests(state.manifest, current, { initialProductsBootstrap })
  await report(JSON.stringify({ revision, dryRun, initialProductsBootstrap, added: diff.added, changed: diff.changed, removed: diff.removed, total: diff.urls.length }, null, 2))
  await verifyPages(diff, fetchImpl)
  // Re-read immediately before sending. A stale deployment event cannot submit
  // its manifest after the production alias has moved to another revision.
  const latest = await fetchLiveManifest(revision, { fetchImpl, attempts: 1, sleep })
  if (JSON.stringify(latest) !== JSON.stringify(current)) throw new Error('Live manifest changed during verification')
  if (dryRun) return { diff, dryRun }
  if (diff.urls.length) await submitIndexNow(diff.urls, { fetchImpl, sleep })
  if (state.manifest?.revision !== current.revision || diff.urls.length) await saveState(api, state, current)
  await report(diff.urls.length ? `IndexNow accepted HTTP 200; ${diff.urls.length} URLs; baseline saved.` : 'No changed URLs; no IndexNow POST.')
  return { diff, dryRun }
}

if (process.argv[1] && import.meta.url === new URL(process.argv[1], 'file:').href) {
  try {
    const event = process.env.GITHUB_EVENT_PATH ? JSON.parse(await readFile(process.env.GITHUB_EVENT_PATH, 'utf8')) : null
    if (process.env.GITHUB_EVENT_NAME === 'deployment_status' && (
      event?.repository?.full_name !== 'joelstolt/batteri' || event?.deployment_status?.state !== 'success' ||
      event?.deployment?.environment !== 'Production' || event?.deployment?.creator?.login !== 'vercel[bot]' || event?.deployment_status?.creator?.login !== 'vercel[bot]'
    )) throw new Error('Untrusted or non-production deployment event')
    const report = async text => {
      console.log(text)
      if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, `\n\`\`\`text\n${text}\n\`\`\`\n`)
    }
    await run({
      revision: process.env.EXPECTED_REVISION,
      dryRun: process.env.INDEXNOW_SUBMIT !== 'true',
      initialProductsBootstrap: process.env.INDEXNOW_INITIAL_PRODUCTS_BOOTSTRAP === 'true',
      api: githubClient(process.env.GITHUB_TOKEN, process.env.GITHUB_REPOSITORY || 'joelstolt/batteri'),
      report,
    })
  } catch (error) { console.error(error.message); process.exitCode = 1 }
}
