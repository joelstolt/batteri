import Stripe from "stripe"
import { readOrderItems, orderIdFor } from "./orders"
import { lasKallaUrMetadata } from "./attribution"
import { emailLayout, escape, formatPriceKr } from "./emails"

/**
 * Veckorapporten till Joel. Körs av Vercel cron (vercel.json) via
 * /api/cron/veckorapport varje måndagsmorgon och mejlas till ADMIN_EMAIL.
 *
 * Fyra källor, var och en i egen try/catch: Stripe (ordrar), Umami (trafik och
 * sökningar utan träff), DataForSEO (nya länkar) och kassan (adresser som
 * fastnade). En källa som fallerar ska ge en rad "kunde inte hämtas", aldrig
 * ett uteblivet mejl, för ett uteblivet mejl ser likadant ut som en lugn vecka.
 *
 * Ingen personuppgift går till Umami härifrån. Kundmejl i rapporten kommer ur
 * Stripe, som redan är orderregistret.
 */

const DYGN = 86400
const SPAM =
  /(casino|\bbet|slot|poker|porn|xxx|viagra|pharma|loan|crypto|forex|mirror|shorten|short|\.xyz$|\.top$|\.click$|\.icu$|\.buzz$|escort|adult|essay|domain-list|website-list|\.co\.in$|\.in$|pages\.dev$)/i

async function medBackoff(fn, forsok = 5) {
  for (let i = 0; ; i++) {
    try {
      return await fn()
    } catch (err) {
      if (err?.type !== "StripeRateLimitError" || i >= forsok - 1) throw err
      await new Promise((r) => setTimeout(r, 400 * (i + 1)))
    }
  }
}

function riktig(pi) {
  return (
    (pi.status === "succeeded" || pi.status === "requires_capture") &&
    pi.metadata?.buyer_email &&
    pi.metadata?.dold !== "1"
  )
}

/* ── Stripe ─────────────────────────────────────────────────────────────── */

async function hamtaOrdrar(sedan, nu) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { maxNetworkRetries: 3 })
  // 60 dygn bakåt: nog för att fånga ordrar som väntar på spårningsnummer.
  const svar = await medBackoff(() =>
    stripe.paymentIntents.list({ limit: 100, created: { gte: nu - 60 * DYGN } })
  )
  const alla = svar.data
  const riktiga = alla.filter(riktig)

  const nya = riktiga
    .filter((pi) => pi.created >= sedan)
    .map((pi) => ({
      orderId: orderIdFor(pi.id),
      datum: pi.created,
      kund: pi.metadata.company_name || pi.metadata.buyer_name || pi.metadata.buyer_email,
      summa: pi.amount / 100,
      rader: readOrderItems(pi.metadata).rader.map((r) => `${r.qty} x ${r.name}`),
      kalla: (() => {
        const k = lasKallaUrMetadata(pi.metadata)
        return k.matt ? k.channel : ""
      })(),
    }))

  const vantar = riktiga
    .filter((pi) => !pi.metadata.shipped_at)
    .map((pi) => ({
      orderId: orderIdFor(pi.id),
      datum: pi.created,
      kund: pi.metadata.company_name || pi.metadata.buyer_name || pi.metadata.buyer_email,
      summa: pi.amount / 100,
      dygn: Math.floor((nu - pi.created) / DYGN),
      // Reservationen på kortet dör efter sju dygn. Dagar kvar att kapa.
      reservKvar: pi.status === "requires_capture" ? Math.max(0, 7 - Math.floor((nu - pi.created) / DYGN)) : null,
    }))

  // Adresser som lämnades i kassan utan att köpet gick igenom. En adress som
  // senare köpte räknas inte, samma person i två listor är brus.
  const kopte = new Set(riktiga.map((pi) => String(pi.metadata.buyer_email || "").toLowerCase()))
  const settEpost = new Set()
  const fastnade = []
  for (const pi of alla) {
    const e = String(pi.metadata?.kontakt_epost || "").toLowerCase()
    if (!e || pi.created < sedan || riktig(pi) || kopte.has(e) || settEpost.has(e)) continue
    settEpost.add(e)
    fastnade.push({ epost: e, datum: pi.created, summa: pi.amount / 100 })
  }

  const omsattning = nya.reduce((s, o) => s + o.summa, 0)
  return { nya, vantar, fastnade, omsattning }
}

/* ── Umami ──────────────────────────────────────────────────────────────── */

async function umami(path, token) {
  const r = await fetch(`${process.env.UMAMI_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  })
  if (!r.ok) throw new Error(`Umami ${path.split("?")[0]}: HTTP ${r.status}`)
  return r.json()
}

async function hamtaUmami(sedan, nu) {
  const { UMAMI_URL, UMAMI_USERNAME, UMAMI_PASSWORD, UMAMI_WEBSITE_ID } = process.env
  if (!UMAMI_URL || !UMAMI_USERNAME || !UMAMI_PASSWORD || !UMAMI_WEBSITE_ID) {
    throw new Error("UMAMI_* saknas i miljön")
  }
  const login = await fetch(`${UMAMI_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: UMAMI_USERNAME, password: UMAMI_PASSWORD }),
    cache: "no-store",
  })
  if (!login.ok) throw new Error(`Umami login: HTTP ${login.status}`)
  const { token } = await login.json()

  const q = `startAt=${sedan * 1000}&endAt=${nu * 1000}`
  const w = `/api/websites/${UMAMI_WEBSITE_ID}`
  const [stats, sidor, kallor, event, utanTraff] = await Promise.all([
    umami(`${w}/stats?${q}`, token),
    umami(`${w}/metrics?type=path&${q}&limit=8`, token),
    umami(`${w}/metrics?type=referrer&${q}&limit=6`, token),
    umami(`${w}/metrics?type=event&${q}`, token),
    umami(`${w}/event-data/events?${q}&event=sok-utan-traff`, token).catch(() => []),
  ])

  // Samma term kan komma i flera rader (en per sessions-batch). Summera.
  const termer = {}
  for (const rad of utanTraff) {
    if (rad.propertyName !== "term") continue
    const t = String(rad.propertyValue || "").trim().toLowerCase()
    if (!t) continue
    termer[t] = (termer[t] || 0) + (Number(rad.total) || 0)
  }
  const sokUtanTraff = Object.entries(termer)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([term, antal]) => ({ term, antal }))

  const ev = Object.fromEntries((event || []).map((e) => [e.x, e.y]))
  return {
    besokare: stats.visitors,
    besokareForra: stats.comparison?.visitors ?? null,
    sidvisningar: stats.pageviews,
    sidvisningarForra: stats.comparison?.pageviews ?? null,
    sidor: (sidor || []).map((s) => ({ sida: s.x, antal: s.y })),
    kallor: (kallor || []).map((s) => ({ kalla: s.x || "direkt", antal: s.y })),
    sok: ev["sok"] || 0,
    sokUtanTraff,
    sokUtanTraffAntal: ev["sok-utan-traff"] || 0,
    varukorg: ev["lagg-i-varukorg"] || 0,
    paborjadKassa: ev["paborjad-kassa"] || 0,
    kop: ev["kop"] || 0,
  }
}

/* ── DataForSEO ─────────────────────────────────────────────────────────── */

async function hamtaLankar(sedanIso) {
  const { DATAFORSEO_USERNAME, DATAFORSEO_PASSWORD } = process.env
  if (!DATAFORSEO_USERNAME || !DATAFORSEO_PASSWORD) throw new Error("DATAFORSEO_* saknas i miljön")
  const auth = "Basic " + Buffer.from(`${DATAFORSEO_USERNAME}:${DATAFORSEO_PASSWORD}`).toString("base64")
  const post = async (path, body) => {
    const r = await fetch(`https://api.dataforseo.com/v3/${path}`, {
      method: "POST",
      headers: { Authorization: auth, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    })
    if (!r.ok) throw new Error(`DataForSEO ${path}: HTTP ${r.status}`)
    const j = await r.json()
    const t = j?.tasks?.[0]
    if (!t || t.status_code !== 20000) throw new Error(`DataForSEO ${path}: ${t?.status_message || "tomt svar"}`)
    return t.result?.[0] || {}
  }
  const [sammanfattning, nya] = await Promise.all([
    post("backlinks/summary/live", [{ target: "batteriproffs.se", include_subdomains: true, exclude_internal_backlinks: true }]),
    post("backlinks/backlinks/live", [
      {
        target: "batteriproffs.se",
        include_subdomains: true,
        exclude_internal_backlinks: true,
        mode: "one_per_domain",
        limit: 50,
        order_by: ["domain_from_rank,desc"],
        filters: ["first_seen", ">", sedanIso],
      },
    ]),
  ])
  const items = (nya.items || []).map((i) => ({
    doman: i.domain_from,
    rank: i.domain_from_rank,
    url: i.url_from,
    ankare: i.anchor || "",
    dofollow: !!i.dofollow,
    skrap: SPAM.test(i.domain_from || "") || SPAM.test(i.url_from || ""),
  }))
  return {
    domaner: sammanfattning.referring_main_domains ?? sammanfattning.referring_domains ?? null,
    rank: sammanfattning.rank ?? null,
    nya: items.filter((i) => !i.skrap),
    nyaSkrap: items.filter((i) => i.skrap).length,
  }
}

/* ── Sammanställning ────────────────────────────────────────────────────── */

async function forsok(fn) {
  try {
    return { data: await fn(), fel: null }
  } catch (err) {
    return { data: null, fel: err?.message || String(err) }
  }
}

export async function byggVeckorapport({ dagar = 7 } = {}) {
  const nu = Math.floor(Date.now() / 1000)
  const sedan = nu - dagar * DYGN
  const sedanIso = new Date(sedan * 1000).toISOString().slice(0, 19).replace("T", " ")
  const [ordrar, trafik, lankar] = await Promise.all([
    forsok(() => hamtaOrdrar(sedan, nu)),
    forsok(() => hamtaUmami(sedan, nu)),
    forsok(() => hamtaLankar(sedanIso)),
  ])
  return { period: { sedan, nu, dagar }, ordrar, trafik, lankar }
}

/* ── Mejlet ─────────────────────────────────────────────────────────────── */

const dat = (s) =>
  new Intl.DateTimeFormat("sv-SE", { day: "numeric", month: "short", timeZone: "Europe/Stockholm" }).format(
    new Date(s * 1000)
  )

function isoVecka(d) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  const dag = t.getUTCDay() || 7
  t.setUTCDate(t.getUTCDate() + 4 - dag)
  const start = new Date(Date.UTC(t.getUTCFullYear(), 0, 1))
  return Math.ceil(((t - start) / 86400000 + 1) / 7)
}

const h2 = (t) => `<h2 style="margin:22px 0 8px;font-size:15px;color:#0B1D3A;">${escape(t)}</h2>`
const p = (t) => `<p style="margin:0 0 8px;font-size:14px;line-height:1.5;color:#374151;">${t}</p>`
const felrad = (k, f) => p(`<span style="color:#B45309;">${escape(k)} kunde inte hämtas: ${escape(f)}</span>`)
const li = (rader) =>
  `<ul style="margin:0 0 8px 18px;padding:0;font-size:14px;line-height:1.55;color:#374151;">${rader
    .map((r) => `<li>${r}</li>`)
    .join("")}</ul>`
const diff = (nu, forra) => {
  if (forra == null || !forra) return ""
  const pct = Math.round(((nu - forra) / forra) * 100)
  const farg = pct >= 0 ? "#047857" : "#B91C1C"
  return ` <span style="color:${farg};font-size:12px;">(${pct >= 0 ? "+" : ""}${pct} % mot veckan innan)</span>`
}

export function renderaVeckorapport({ period, ordrar, trafik, lankar }) {
  const o = ordrar.data
  const t = trafik.data
  const l = lankar.data
  const delar = []

  // Ordrar
  delar.push(h2("Ordrar"))
  if (!o) delar.push(felrad("Stripe", ordrar.fel))
  else {
    delar.push(
      p(`<strong>${o.nya.length} ordrar</strong>, ${formatPriceKr(o.omsattning)} kr inkl. moms senaste ${period.dagar} dagarna.`)
    )
    if (o.nya.length)
      delar.push(
        li(
          o.nya.map(
            (x) =>
              `${dat(x.datum)} <strong>${escape(x.orderId)}</strong> ${escape(x.kund)}, ${formatPriceKr(x.summa)} kr` +
              (x.rader.length ? `: ${escape(x.rader.join(", "))}` : "") +
              (x.kalla ? ` <span style="color:#6B7280;">via ${escape(x.kalla)}</span>` : "")
          )
        )
      )
    if (o.vantar.length) {
      delar.push(h2("Väntar på spårningsnummer"))
      delar.push(
        li(
          o.vantar.map((x) => {
            const varning =
              x.reservKvar != null && x.reservKvar <= 2
                ? ` <strong style="color:#B91C1C;">reservationen dör om ${x.reservKvar} dygn</strong>`
                : x.reservKvar != null
                  ? ` <span style="color:#6B7280;">reserverad, ${x.reservKvar} dygn kvar</span>`
                  : ""
            return `${escape(x.orderId)} ${escape(x.kund)}, ${formatPriceKr(x.summa)} kr, ${x.dygn} dygn sedan köp${varning}`
          })
        )
      )
      delar.push(p(`<a href="https://www.batteriproffs.se/admin" style="color:#0B1D3A;">Öppna admin</a> och lägg in numret, då går leveransmejlet och pengarna dras.`))
    }
    if (o.fastnade.length) {
      delar.push(h2("Kom till kassan, köpte inte"))
      delar.push(li(o.fastnade.map((x) => `${dat(x.datum)} <a href="mailto:${escape(x.epost)}" style="color:#0B1D3A;">${escape(x.epost)}</a>, ${formatPriceKr(x.summa)} kr i korgen`)))
      delar.push(p(`Ett kort mejl med "Fastnade det på något?" brukar räcka. Ingen automatik här, det ska kännas som en människa.`))
    }
  }

  // Trafik
  delar.push(h2("Trafik"))
  if (!t) delar.push(felrad("Umami", trafik.fel))
  else {
    delar.push(p(`<strong>${t.besokare} besökare</strong>${diff(t.besokare, t.besokareForra)}, ${t.sidvisningar} sidvisningar${diff(t.sidvisningar, t.sidvisningarForra)}.`))
    delar.push(p(`Lade i varukorg: ${t.varukorg}. Påbörjad kassa: ${t.paborjadKassa}. Köp-event: ${t.kop}. Sökningar: ${t.sok}, varav ${t.sokUtanTraffAntal} utan träff.`))
    if (t.sokUtanTraff.length) {
      delar.push(p(`<strong>Sökte utan att hitta:</strong> ${t.sokUtanTraff.map((s) => `${escape(s.term)} (${s.antal})`).join(", ")}.`))
      delar.push(p(`<span style="color:#6B7280;">Återkommande termer här är nästa produkt eller nästa synonym i sökregistret.</span>`))
    }
    if (t.sidor.length) delar.push(p(`<strong>Mest besökt:</strong> ${t.sidor.map((s) => `${escape(s.sida)} (${s.antal})`).join(", ")}.`))
    if (t.kallor.length) delar.push(p(`<strong>Källor:</strong> ${t.kallor.map((s) => `${escape(s.kalla)} (${s.antal})`).join(", ")}.`))
  }

  // Länkar
  delar.push(h2("Länkar"))
  if (!l) delar.push(felrad("DataForSEO", lankar.fel))
  else {
    delar.push(p(`Hänvisande domäner totalt: <strong>${l.domaner ?? "?"}</strong>. Domänrank: ${l.rank ?? "?"}.`))
    if (l.nya.length) delar.push(li(l.nya.map((x) => `<a href="${escape(x.url)}" style="color:#0B1D3A;">${escape(x.doman)}</a> (rank ${x.rank}${x.dofollow ? ", dofollow" : ""})${x.ankare ? `: "${escape(x.ankare.slice(0, 60))}"` : ""}`)))
    else delar.push(p(`Inga nya riktiga länkar den här veckan.${l.nyaSkrap ? ` ${l.nyaSkrap} skräplänkar ignorerade.` : ""}`))
  }

  const vecka = isoVecka(new Date(period.nu * 1000))
  const subject = o
    ? `Batteriproffs v${vecka}: ${o.nya.length} ordrar, ${formatPriceKr(o.omsattning)} kr${t ? `, ${t.besokare} besökare` : ""}${o.vantar.length ? `, ${o.vantar.length} väntar på spårning` : ""}`
    : `Batteriproffs v${vecka}: rapport med fel`

  const html = emailLayout({
    title: subject,
    preheader: subject,
    internt: true,
    body:
      `<h1 style="margin:0 0 4px;font-size:20px;color:#0A1628;">Vecka ${vecka}</h1>` +
      p(`<span style="color:#6B7280;">${dat(period.sedan)} till ${dat(period.nu)}. Skickas automatiskt varje måndag.</span>`) +
      delar.join(""),
  })
  return { subject, html }
}
