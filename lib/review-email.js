import { resend, escape, emailLayout } from "./emails"
import { SITE_URL, EMAIL, SITE_NAME } from "./constants"
import { skapaOmdomeToken } from "./konto-auth"

/**
 * Omdömesmejlet, fem dagar efter att ordern SKICKATS (inte lagts).
 *
 * Skickas från ship-flödet: dragningen och spårningsnumret betyder att
 * batteriet faktiskt är på väg, så mejlet landar efter leverans i stället för
 * före. De två första mejlen som gick ut (SRVAB, Lööve aug 2026) triggades vid
 * orderläggning och gav noll svar.
 *
 * Länken är en signerad direktlänk till /omdome — ETT klick till formuläret,
 * ingen inloggning. Den gamla vägen via /konto krävde en extra mejlrunda med
 * 15-minuterslänk och var i praktiken sex steg; det var tröskeln, inte viljan.
 * Token öppnar bara omdömesformuläret för den ordern, ingen orderdata, så en
 * vidarebefordran exponerar inte mer än mejlet självt.
 *
 * Avsändaren är en svarbar adress. Ett "vad tyckte du?"-mejl från noreply@
 * motsäger sitt eget ärende.
 */
const REVIEW_FROM = process.env.REVIEW_EMAIL_FROM || `${SITE_NAME} <${EMAIL}>`

function reviewUrlFor(piId, epost) {
  const token = piId ? skapaOmdomeToken(piId) : null
  if (token) return `${SITE_URL}/omdome?t=${encodeURIComponent(token)}`
  // Utan ADMIN_TOKEN kan inget signeras — då får kontovägen duga.
  return epost
    ? `${SITE_URL}/konto?epost=${encodeURIComponent(epost)}`
    : `${SITE_URL}/konto`
}
const DELAY_DAYS = Number(process.env.REVIEW_EMAIL_DELAY_DAYS) || 5

function buildReviewBody({ firstName, orderId, reviewUrl }) {
  const greeting = firstName ? `Hej ${escape(firstName)}!` : "Hej!"
  return `
    <h1 style="margin:0 0 12px;font-size:22px;line-height:1.2;font-weight:800;letter-spacing:-0.01em;">
      ${greeting}
    </h1>
    <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#374151;">
      Tack för att du valde Batteriproffs för din order
      <strong style="color:#0A1628;">${escape(orderId)}</strong>!
      Vi hoppas batteriet kom fram bra och att allt fungerar som du tänkte dig.
    </p>
    <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#374151;">
      Om du har en stund över skulle det betyda mycket om du satte ett betyg.
      Vi är ett ungt företag och varje ärligt omdöme hjälper nästa kund att
      våga handla hos oss. Ta gärna med om något inte var bra — det är den
      sortens omdöme vi lär oss mest av.
    </p>
    <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:#0A1628;text-align:center;">
      Tryck på en stjärna:
    </p>
    <p style="margin:0 0 20px;text-align:center;font-size:34px;line-height:1;">
      ${[1, 2, 3, 4, 5]
        .map(
          (n) =>
            `<a href="${escape(reviewUrl)}&betyg=${n}" style="text-decoration:none;color:#FDB813;padding:0 4px;" aria-label="${n} av 5">&#9733;</a>`
        )
        .join("")}
    </p>
    <p style="margin:0 0 24px;font-size:13px;line-height:1.6;color:#6B7280;">
      Stjärnan väljs åt dig — du bekräftar med ett tryck på nästa sida. Ingen
      inloggning, inget krav på text. Omdömet granskas innan det publiceras
      och visas med märkningen verifierat köp.
    </p>
    <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#6B7280;">
      Skulle du istället ha frågor eller om något inte stämmer med ordern —
      svara på det här mejlet
      så löser vi det direkt.
    </p>
  `
}

export async function scheduleReviewEmail({ to, fullName, orderId, piId, replyTo }) {
  if (!to || !orderId) return null

  const firstName = fullName ? fullName.split(" ")[0] : null

  return resend.emails.send({
    from: REVIEW_FROM,
    to,
    replyTo,
    scheduledAt: `in ${DELAY_DAYS} days`,
    subject: firstName
      ? `Hur gick det med din order, ${firstName}?`
      : `Hur gick det med din order?`,
    html: emailLayout({
      title: `Lämna ett omdöme`,
      preheader: `Tack för din order. Vill du dela din upplevelse?`,
      body: buildReviewBody({ firstName, orderId, reviewUrl: reviewUrlFor(piId, to) }),
    }),
  })
}
