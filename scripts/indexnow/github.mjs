import { STATE_BRANCH, validateManifest } from './core.mjs'

export function githubClient(token, repository, fetchImpl = fetch) {
  if (repository !== 'joelstolt/batteri') throw new Error('Unexpected repository')
  if (!token) throw new Error('GITHUB_TOKEN is required')
  return async (path, { method = 'GET', body, allow404 = false } = {}) => {
    const response = await fetchImpl(`https://api.github.com/repos/${repository}/${path}`, {
      method, redirect: 'error', signal: AbortSignal.timeout(30000),
      headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${token}`, 'X-GitHub-Api-Version': '2022-11-28', 'Content-Type': 'application/json' },
      ...(body ? { body: JSON.stringify(body) } : {}),
    })
    if (response.status === 404 && allow404) return null
    if (!response.ok) throw new Error(`GitHub ${method} ${path}: HTTP ${response.status}`)
    return response.json()
  }
}

export async function loadState(api) {
  const ref = await api(`git/ref/heads/${STATE_BRANCH}`, { allow404: true })
  if (!ref) return { head: null, manifest: null }
  // Pin to the ref SHA so a concurrent update cannot change our read midway.
  const file = await api(`contents/manifest.json?ref=${ref.object.sha}`)
  if (file.encoding !== 'base64' || typeof file.content !== 'string') throw new Error('Invalid state file')
  return { head: ref.object.sha, manifest: validateManifest(JSON.parse(Buffer.from(file.content, 'base64').toString('utf8'))) }
}

export async function saveState(api, state, manifest) {
  validateManifest(manifest)
  // Orphan initial commit. State is data only; no application or workflow code.
  const tree = await api('git/trees', { method: 'POST', body: { tree: [
    { path: 'manifest.json', mode: '100644', type: 'blob', content: `${JSON.stringify(manifest, null, 2)}\n` },
    { path: 'README.md', mode: '100644', type: 'blob', content: '# IndexNow acknowledged baseline\n\nManaged by the IndexNow workflow on the default branch. Updated only after HTTP 200 (or an unchanged catalogue). The initial product-only bootstrap seeds other catalogue pages without historical submission. Never run code from this branch.\n' },
    { path: 'vercel.json', mode: '100644', type: 'blob', content: '{"git":{"deploymentEnabled":false}}\n' },
  ] } })
  const commit = await api('git/commits', { method: 'POST', body: { message: `IndexNow acknowledged ${manifest.revision}`, tree: tree.sha, parents: state.head ? [state.head] : [] } })
  // GitHub rejects a non-fast-forward update (force:false). Never overwrite
  // another acknowledged baseline, even if a second caller bypasses Actions.
  if (state.head) await api(`git/refs/heads/${STATE_BRANCH}`, { method: 'PATCH', body: { sha: commit.sha, force: false } })
  else await api('git/refs', { method: 'POST', body: { ref: `refs/heads/${STATE_BRANCH}`, sha: commit.sha } })
}
