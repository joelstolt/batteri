// One codec for payment, account, emails and reporting. Old orders stay readable.
export const MAX_METADATA_VALUE = 500
// Operational keys: totals/source, buyer, attribution, contact, shipping,
// reminder flags, visibility and three delivery receipts. Two manifest keys extra.
// 4 totals + 15 buyer + 5 source + 4 contact + 3 reminders +
// 3 mail receipts + 4 shipping/review + 1 visibility + 2 manifest.
const RESERVED_FIELDS = 41
const MAX_PARTS = 8

function normalize(row) {
  if (!row || typeof row !== "object") throw new Error("Ogiltig orderrad")
  if ((row.s ?? row.slug) != null && typeof (row.s ?? row.slug) !== "string")
    throw new Error("Ogiltig artikel")
  if ((row.n ?? row.name) != null && typeof (row.n ?? row.name) !== "string")
    throw new Error("Ogiltigt artikelnamn")
  const qty = Number(row.q ?? row.qty),
    price = Number(row.p ?? row.price)
  if (
    !Number.isInteger(qty) ||
    qty < 1 ||
    qty > 99 ||
    !Number.isFinite(price) ||
    price < 0 ||
    Math.abs(price * 100 - Math.round(price * 100)) > 1e-6
  )
    throw new Error("Ogiltig orderrad")
  return {
    slug: row.s || row.slug || null,
    name: row.n || row.name || "",
    qty,
    price,
  }
}
export function serializeOrderItems(rows) {
  if (!Array.isArray(rows) || !rows.length || rows.length > 50)
    throw new Error("Ogiltig varukorg")
  const normalized = rows.map(normalize)
  // One potential review field per distinct article must also fit later.
  const reviews = new Set(normalized.map((r) => r.slug)).size
  const maxParts = Math.min(MAX_PARTS, 50 - RESERVED_FIELDS - reviews)
  const parts = []
  let batch = []
  for (const r of normalized) {
    const compact = { s: r.slug, n: r.name, q: r.qty, p: r.price }
    if (JSON.stringify([compact]).length > MAX_METADATA_VALUE)
      throw new Error("Orderraden är för lång")
    if (JSON.stringify([...batch, compact]).length > MAX_METADATA_VALUE) {
      parts.push(JSON.stringify(batch))
      batch = []
    }
    batch.push(compact)
  }
  if (batch.length) parts.push(JSON.stringify(batch))
  if (parts.length > maxParts)
    throw new Error(
      "För många olika artiklar för kortköp. Kontakta oss så hjälper vi dig med hela beställningen."
    )
  return {
    items_version: "2",
    items_parts: String(parts.length),
    ...Object.fromEntries(
      parts.map((p, i) => [i ? `items_${i + 1}` : "items", p])
    ),
  }
}
export function readOrderItems(metadata = {}) {
  if (!metadata || typeof metadata !== "object")
    return { rader: [], strukna: 0, incomplete: true }
  let strukna = 0,
    incomplete = false
  const rader = []
  const version = metadata.items_version
  let count = version === "2" ? Number(metadata.items_parts) : 1
  if (
    (version && version !== "2") ||
    !Number.isInteger(count) ||
    count < 1 ||
    count > MAX_PARTS
  )
    return { rader, strukna, incomplete: true }
  for (let i = 0; i < count; i++) {
    const raw = metadata[i ? `items_${i + 1}` : "items"]
    if (!raw) {
      incomplete = true
      continue
    }
    try {
      const parsed = JSON.parse(raw)
      if (!Array.isArray(parsed) || !parsed.length) throw new Error("empty")
      for (const row of parsed) {
        if (row?.o !== undefined) {
          strukna += Number(row.o) || 0
          incomplete = true
          continue
        }
        try {
          rader.push(normalize(row))
        } catch {
          incomplete = true
        }
      }
    } catch {
      incomplete = true
    }
  }
  return { rader, strukna, incomplete }
}
export function assertMetadataFits(metadata) {
  if (
    Object.keys(metadata).length > 50 ||
    Object.entries(metadata).some(
      ([k, v]) => k.length > 40 || String(v).length > 500
    )
  )
    throw new Error("Orderuppgifterna ryms inte. Kontakta oss för hjälp.")
}
