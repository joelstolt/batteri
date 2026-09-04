export function cartFingerprint(items) {
  return JSON.stringify(
    items
      .map(({ slug, qty, lineId }) => ({ slug, qty, lineId }))
      .sort((a, b) => a.slug.localeCompare(b.slug))
  )
}
export function validStoredCart(raw) {
  if (!Array.isArray(raw)) return []
  const seen = new Set()
  return raw.filter((r) => {
    if (
      !r ||
      typeof r.slug !== "string" ||
      !Number.isInteger(r.qty) ||
      r.qty < 1 ||
      r.qty > 99 ||
      seen.has(r.slug)
    )
      return false
    seen.add(r.slug)
    return true
  })
}
export function removePurchased(current, pending, order) {
  if (order.incompleteItems || !Array.isArray(order.items)) return current
  const bought = new Map()
  for (const row of order.items)
    if (row.slug) bought.set(row.slug, (bought.get(row.slug) || 0) + row.qty)
  const snapshot = new Map(pending.map((r) => [r.slug, r]))
  return current.flatMap((row) => {
    const old = snapshot.get(row.slug)
    if (!old?.lineId || old.lineId !== row.lineId) return [row]
    const qty = row.qty - Math.min(old.qty, bought.get(row.slug) || 0)
    return qty > 0 ? [{ ...row, qty }] : []
  })
}
export function quoteHasChanged(current, quote) {
  return current.some((r) => {
    const q = quote.items.find((i) => i.slug === r.slug)
    return (
      !q ||
      q.price !== r.price ||
      q.qty !== r.qty ||
      !!q.freeShipping !== !!r.freeShipping
    )
  })
}
