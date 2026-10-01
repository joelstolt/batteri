import { sendReviewReminder, DELAY_DAYS } from "./review-email"
import { omdomenUrPI } from "./omdomen"
import { orderIdFor } from "./orders"
import { ADMIN_EMAIL } from "./emails"

/**
 * En påminnelse om omdöme, en vecka efter omdömesmejlet, till kunder som inte
 * svarat. Elva omdömesmejl i sep 2026 gav ett enda betyg, och en påminnelse är
 * det som brukar lyfta svaren mest.
 *
 * Fönstret är en vecka. Missar cron-jobbet några dagar går påminnelsen ändå,
 * men en order som passerat fönstret får aldrig någon. Utan fönstret hade
 * första körningen mejlat varenda gammal kund på en gång.
 */
const DAG = 86400
// review_email_at är när mejlet köades, det går DELAY_DAYS senare.
export const PAMINN_EFTER_DAGAR = DELAY_DAYS + 7
const FONSTER_DAGAR = 7
const OMFORSOK_MS = 2000

const nuSek = () => Math.floor(Date.now() / 1000)
const epostFor = (pi) => pi.metadata?.buyer_email || pi.receipt_email || ""

export function arMogen(pi, nu = nuSek()) {
  const m = pi.metadata || {}
  if (pi.status !== "succeeded") return false
  if (m.dold === "1" || m.review_reminder_at) return false
  if (!epostFor(pi)) return false
  const koad = Number(m.review_email_at)
  if (!koad) return false
  const forfaller = koad + PAMINN_EFTER_DAGAR * DAG
  if (nu < forfaller || nu >= forfaller + FONSTER_DAGAR * DAG) return false
  // Har kunden betygsatt något på ordern, även ett nekat omdöme, är den klar.
  return omdomenUrPI(pi).length === 0
}

export async function hittaOmdomesPaminnelser(stripe, nu = nuSek()) {
  // Fönstret stänger PAMINN_EFTER_DAGAR + FONSTER_DAGAR efter köningen, och
  // köningen sker när ordern skickas. 60 dagar bakåt täcker med god marginal.
  const mogna = []
  for await (const pi of stripe.paymentIntents.list({
    limit: 100,
    created: { gte: nu - 60 * DAG },
  })) {
    if (arMogen(pi, nu)) mogna.push(pi)
  }
  return mogna
}

async function skickaMedOmforsok(args) {
  try {
    return await sendReviewReminder(args)
  } catch {
    // Resend svarar ibland 500. Samma idempotensnyckel gör omförsöket ofarligt.
    await new Promise((r) => setTimeout(r, OMFORSOK_MS))
    return sendReviewReminder(args)
  }
}

export async function skickaOmdomesPaminnelse(pi, stripe, nu = nuSek()) {
  const orderId = orderIdFor(pi.id)
  // Markeringen skrivs FÖRE utskicket. Kraschar något mitt emellan uteblir
  // påminnelsen hellre än att kunden får två.
  await stripe.paymentIntents.update(pi.id, {
    metadata: { review_reminder_at: String(nu) },
  })
  try {
    await skickaMedOmforsok({
      to: epostFor(pi),
      fullName: pi.metadata?.buyer_name || "",
      orderId,
      piId: pi.id,
      replyTo: ADMIN_EMAIL,
    })
  } catch (err) {
    // Mejlet gick inte iväg: ta bort markeringen så nästa körning försöker
    // igen. Tom sträng raderar nyckeln hos Stripe.
    await stripe.paymentIntents
      .update(pi.id, { metadata: { review_reminder_at: "" } })
      .catch((e) => console.error("Kunde inte ta bort påminnelsemarkering:", pi.id, e))
    throw err
  }
  return { ok: true, order: orderId, epost: epostFor(pi) }
}
