import { resend, FROM, escape, emailLayout } from "./emails"
import { SITE_URL } from "./constants"

/**
 * Omdömesmejlet, sju dagar efter köp.
 *
 * Låg tidigare och pekade på GOOGLE_REVIEW_URL, en variabel som aldrig var satt
 * och aldrig kunde bli det: verksamheten är dropship utan besöksadress och
 * kvalificerar därför inte för en Google Business Profile. Funktionen
 * returnerade null på första raden och mejlet har alltså aldrig skickats en
 * enda gång, tyst, sedan det byggdes.
 *
 * Nu pekar det på kundkontot, där omdömet knyts till ett verifierat köp.
 */
/**
 * Länken förifyller mejladressen men loggar INTE in direkt.
 *
 * Att lägga en inloggningstoken i ett mejl som ligger kvar i inkorgen i
 * månader vore att göra vidarebefordran till en inloggning. Företagsadresser
 * hamnar i delade inkorgar och vidarebefordras rutinmässigt. Med förifyllning
 * räcker det med ett klick för kunden, och den som råkar läsa mejlet kommer
 * ingenstans utan tillgång till adressen.
 */
function reviewUrlFor(epost) {
  return epost
    ? `${SITE_URL}/konto?epost=${encodeURIComponent(epost)}`
    : `${SITE_URL}/konto`
}
const DELAY_DAYS = Number(process.env.REVIEW_EMAIL_DELAY_DAYS) || 7

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
    <p style="margin:0 0 24px;text-align:center;">
      <a href="${escape(reviewUrl)}" style="display:inline-block;background:#0B1D3A;color:#fff;text-decoration:none;padding:14px 28px;border-radius:10px;font-weight:700;font-size:14px;">
        Lämna ett omdöme →
      </a>
    </p>
    <p style="margin:0 0 24px;font-size:13px;line-height:1.6;color:#6B7280;">
      Du loggar in med den här mejladressen, ingen lösenordskrångel. Omdömet
      visas med märkningen verifierat köp.
    </p>
    <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#6B7280;">
      Skulle du istället ha frågor eller om något inte stämmer med ordern —
      svara på det här mejlet eller ring oss på
      <a href="tel:+46766867752" style="color:#0B1D3A;font-weight:600;text-decoration:none;">076-686 77 52</a>
      så löser vi det direkt.
    </p>
  `
}

export async function scheduleReviewEmail({ to, fullName, orderId, replyTo }) {
  if (!to || !orderId) return null

  const firstName = fullName ? fullName.split(" ")[0] : null

  return resend.emails.send({
    from: FROM,
    to,
    replyTo,
    scheduledAt: `in ${DELAY_DAYS} days`,
    subject: firstName
      ? `Hur gick det med din order, ${firstName}?`
      : `Hur gick det med din order?`,
    html: emailLayout({
      title: `Lämna ett omdöme`,
      preheader: `Tack för din order. Vill du dela din upplevelse?`,
      body: buildReviewBody({ firstName, orderId, reviewUrl: reviewUrlFor(to) }),
    }),
  })
}
