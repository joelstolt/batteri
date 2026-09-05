/**
 * Enkel rate limiting i minnet.
 *
 * Vercels serverless-instanser återanvänds mellan anrop, så räknaren håller
 * inom en instans men delas inte mellan dem. Det stoppar alltså inte en
 * distribuerad attack, men det tar bort hela klassen av "någon hamrar på
 * formuläret från en flik" — vilket är det som faktiskt bränner Resend-kvoten.
 * Behöver vi hårdare skydd är nästa steg Upstash eller Vercel KV.
 */

const buckets = new Map()
const MAX_BUCKETS = 5000

/**
 * @param {string} key      identifierare, oftast IP + rutt
 * @param {number} limit    max antal anrop inom fönstret
 * @param {number} windowMs fönstrets längd i millisekunder
 * @returns {{ ok: boolean, retryAfter: number }}
 */
export function rateLimit(key, limit, windowMs) {
  const now = Date.now()

  // Städa bort utgångna nycklar innan Map:en växer sig stor
  if (buckets.size > MAX_BUCKETS) {
    for (const [k, v] of buckets) {
      if (v.reset <= now) buckets.delete(k)
    }
  }

  const bucket = buckets.get(key)

  if (!bucket || bucket.reset <= now) {
    buckets.set(key, { count: 1, reset: now + windowMs })
    return { ok: true, retryAfter: 0 }
  }

  bucket.count += 1
  if (bucket.count > limit) {
    return { ok: false, retryAfter: Math.ceil((bucket.reset - now) / 1000) }
  }
  return { ok: true, retryAfter: 0 }
}

/** Klientens IP så långt vi kan lita på den bakom Vercels proxy. */
export function clientIp(request) {
  const fwd = request.headers.get("x-forwarded-for")
  if (fwd) return fwd.split(",")[0].trim()
  return request.headers.get("x-real-ip") || "okänd"
}

/**
 * Släpper bara igenom anrop som kommer från vår egen sajt.
 * Bot-trafik som postar rakt mot API:et saknar oftast korrekt Origin.
 */
export function isOwnOrigin(request, allowed = []) {
  const origin = request.headers.get("origin")
  // Vissa klienter skickar ingen Origin på same-origin-POST — släpp igenom då
  if (!origin) return true
  return allowed.some((a) => origin === a)
}

export const ALLOWED_ORIGINS = [
  ...(process.env.BP_PAYMENT_TEST === "1" && process.env.BP_TEST_BASE_URL ? [process.env.BP_TEST_BASE_URL] : []),
  "https://www.batteriproffs.se",
  "https://batteriproffs.se",
]
