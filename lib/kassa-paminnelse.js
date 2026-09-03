import Stripe from "stripe"
import { parsaItems } from "./orders"
import { resend, FROM, ADMIN_EMAIL, escape, emailLayout, formatPriceKr } from "./emails"
import { skapaAterstallToken, skapaAvregToken } from "./konto-auth"
import { SITE_URL, EMAIL } from "./constants"

/**
 * Påminnelse om övergiven kassa.
 *
 * Två mejl till kunden, inte till oss: ett efter en timme och ett efter ett
 * dygn. Branschstandard i e-handel, och den enskilt mest lönsamma
 * automatiseringen som finns: snittet återvinner 3 till 5 procent av de
 * övergivna korgarna. Augusti 2026 lämnades ~35 000 kr i påbörjade kassor
 * här utan att någon hörde av sig.
 *
 * Fyra regler som aldrig får brytas, för ett påminnelsemejl till någon som
 * redan köpt eller inte vill ha post är värre än inget mejl alls:
 *
 * 1. Aldrig till en betalning som gått igenom (succeeded eller
 *    requires_capture).
 * 2. Aldrig till en adress som köpt något ANNAT sedan dess. Samma person
 *    lägger ofta om ordern i en ny session, och då är den gamla kassan skräp.
 * 3. Aldrig mer än två mejl per betalning, och aldrig alls efter en
 *    avregistrering.
 * 4. Varje mejl har avregistreringslänk. Kassan säljer till företag, så
 *    marknadsföringslagens krav på samtycke i förväg gäller inte, men
 *    avregistreringen ska ändå vara ett klick.
 */

const TIMME = 3600
const DYGN = 86400

/** Fönstret för mejl 1: äldre än en timme, yngre än ett dygn. */
const MEJL1_TIDIGAST = TIMME
/** Fönstret för mejl 2: äldre än ett dygn, yngre än tre. Sen är det för sent. */
const MEJL2_TIDIGAST = DYGN
const MEJL2_SENAST = 3 * DYGN

/** Ingen påminnelse på småbelopp: frakten är 695 kr och gör dem meningslösa. */
const MINSTA_BELOPP = 100000

function stripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY, { maxNetworkRetries: 3 })
}

function betald(pi) {
  return pi.status === "succeeded" || pi.status === "requires_capture"
}

/**
 * Betalningar som förtjänar en påminnelse just nu.
 * Returnerar { pi, steg } där steg är 1 eller 2.
 */
export async function hittaOvergivna(nu = Math.floor(Date.now() / 1000)) {
  const s = stripe()
  const svar = await s.paymentIntents.list({
    limit: 100,
    created: { gte: nu - 7 * DYGN },
  })
  const alla = svar.data

  // Regel 2: alla adresser som har en genomförd betalning, oavsett när.
  const harKopt = new Set(
    alla
      .filter((pi) => betald(pi))
      .flatMap((pi) =>
        [pi.metadata?.buyer_email, pi.metadata?.kontakt_epost]
          .filter(Boolean)
          .map((e) => String(e).trim().toLowerCase())
      )
  )

  // Avregistreringar ligger som markör på betalningarna, eftersom det inte
  // finns någon egen adressdatabas. En avregistrering skrivs på ALLA
  // betalningar med samma adress, så en enda träff räcker för att stoppa.
  const avregistrerade = new Set(
    alla
      .filter((pi) => pi.metadata?.paminnelse_avreg === "1")
      .map((pi) => String(pi.metadata?.kontakt_epost || "").trim().toLowerCase())
      .filter(Boolean)
  )

  const kandidater = []
  const settPerAdress = new Set()

  // Nyast först, så att en adress med flera övergivna kassor bara får
  // påminnelse om den senaste.
  for (const pi of alla) {
    const m = pi.metadata || {}
    const epost = String(m.kontakt_epost || "").trim().toLowerCase()
    if (!epost) continue
    if (betald(pi)) continue
    if (harKopt.has(epost) || avregistrerade.has(epost)) continue
    if (pi.amount < MINSTA_BELOPP) continue
    if (settPerAdress.has(epost)) continue

    const fangad = Number(m.kontakt_epost_at) || pi.created
    const alder = nu - fangad
    let steg = null

    if (!m.paminnelse_1_at && alder >= MEJL1_TIDIGAST && alder < DYGN) {
      steg = 1
    } else if (
      m.paminnelse_1_at &&
      !m.paminnelse_2_at &&
      alder >= MEJL2_TIDIGAST &&
      alder < MEJL2_SENAST
    ) {
      steg = 2
    }
    if (!steg) continue

    settPerAdress.add(epost)
    kandidater.push({ pi, steg, epost, fangad })
  }

  return kandidater
}

function radlista(pi) {
  const { rader } = parsaItems(pi.metadata?.items)
  if (rader.length === 0) return ""
  return `
    <table role="presentation" width="100%" style="border-collapse:collapse;margin:0 0 20px;">
      ${rader
        .map(
          (r) => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #F0F1F4;font-size:14px;color:#0A1628;">
            ${escape(String(r.qty))} st ${escape(r.name || r.slug || "")}
          </td>
          <td align="right" style="padding:8px 0;border-bottom:1px solid #F0F1F4;font-size:14px;font-weight:700;color:#0A1628;white-space:nowrap;">
            ${formatPriceKr(r.price * r.qty)} kr
          </td>
        </tr>`
        )
        .join("")}
    </table>`
}

function knapp(url, text) {
  return `<p style="margin:0 0 22px;">
    <a href="${url}" style="display:inline-block;background:#0B1D3A;color:#fff;text-decoration:none;padding:13px 24px;border-radius:10px;font-weight:700;font-size:15px;">
      ${escape(text)}
    </a>
  </p>`
}

function fot(avregUrl) {
  return `<p style="margin:26px 0 0;font-size:12px;line-height:1.6;color:#9AA0A6;">
    Du får det här mejlet för att du fyllde i din adress i kassan på batteriproffs.se.
    <a href="${avregUrl}" style="color:#6B7280;">Vill du inte bli påmind igen, klicka här.</a>
  </p>`
}

export function byggPaminnelse({ pi, steg, epost }) {
  const fornamn = String(pi.metadata?.kontakt_namn || "").trim().split(" ")[0]
  const halsning = fornamn ? `Hej ${escape(fornamn)}!` : "Hej!"
  const aterstall = skapaAterstallToken(pi.id)
  const url = aterstall ? `${SITE_URL}/aterstall/${aterstall}` : `${SITE_URL}/kassa`
  const avregUrl = `${SITE_URL}/kassa-avreg/${skapaAvregToken(epost)}`
  const summa = formatPriceKr(pi.amount / 100)

  if (steg === 1) {
    return {
      subject: "Din varukorg ligger kvar hos oss",
      html: emailLayout({
        title: "Din varukorg ligger kvar",
        preheader: `${summa} kr, sparad och klar att slutföra.`,
        body: `
          <h1 style="margin:0 0 12px;font-size:22px;line-height:1.2;font-weight:800;letter-spacing:-0.01em;">${halsning}</h1>
          <p style="margin:0 0 18px;font-size:14px;line-height:1.7;color:#374151;">
            Du var inne i kassan hos oss men blev inte klar. Varukorgen ligger
            kvar, så du kan fortsätta där du slutade.
          </p>
          ${radlista(pi)}
          ${knapp(url, "Fortsätt till kassan")}
          <p style="margin:0 0 8px;font-size:14px;line-height:1.7;color:#374151;">
            Fastnade det på något? Vanligaste frågorna vi får är om batteriet
            passar maskinen och hur frakten fungerar. Svara på det här mejlet
            med din maskinmodell, så kollar vi passformen åt dig innan du köper.
          </p>
          <p style="margin:0;font-size:14px;line-height:1.7;color:#374151;">
            Frakt är 695 kr oavsett antal batterier, och leverans sker normalt
            inom 1 till 3 arbetsdagar.
          </p>
          ${fot(avregUrl)}`,
      }),
    }
  }

  return {
    subject: "Behöver du hjälp att välja rätt batteri?",
    html: emailLayout({
      title: "Behöver du hjälp att välja?",
      preheader: "Din varukorg ligger kvar. Vi kollar passformen gratis.",
      body: `
        <h1 style="margin:0 0 12px;font-size:22px;line-height:1.2;font-weight:800;letter-spacing:-0.01em;">${halsning}</h1>
        <p style="margin:0 0 18px;font-size:14px;line-height:1.7;color:#374151;">
          Din varukorg från i går ligger kvar. Hörde inget från dig, så jag
          gissar att något är oklart.
        </p>
        ${radlista(pi)}
        <p style="margin:0 0 18px;font-size:14px;line-height:1.7;color:#374151;">
          Är du osäker på om batteriet passar: svara med maskinens modell eller
          en bild på batteriet som sitter i i dag, så säger vi rakt ut om vårt
          passar. Gör det inte det säger vi det också.
        </p>
        ${knapp(url, "Öppna min varukorg")}
        <p style="margin:0;font-size:14px;line-height:1.7;color:#374151;">
          Har du redan löst det är det helt lugnt, då hör du inget mer från oss
          om den här varukorgen.
        </p>
        ${fot(avregUrl)}`,
    }),
  }
}

/** Skickar ett mejl och märker betalningen. Returnerar vad som hände. */
export async function skickaPaminnelse(kandidat) {
  const { pi, steg, epost } = kandidat
  const { subject, html } = byggPaminnelse(kandidat)

  const r = await resend.emails.send({
    from: FROM,
    to: epost,
    replyTo: ADMIN_EMAIL || EMAIL,
    subject,
    html,
  })
  if (r?.error) {
    return { ok: false, epost, steg, fel: r.error?.message || String(r.error) }
  }

  // Märkningen sker EFTER utskicket. Skulle den falla får kunden i värsta
  // fall mejlet en gång till nästa körning, vilket är bättre än att en tyst
  // märkning stoppar ett mejl som aldrig gick.
  await stripe().paymentIntents.update(pi.id, {
    metadata: { [`paminnelse_${steg}_at`]: String(Math.floor(Date.now() / 1000)) },
  })

  return { ok: true, epost, steg, belopp: pi.amount / 100, id: r?.data?.id || null }
}

/** Skriver avregistreringen på alla betalningar med samma adress. */
export async function avregistrera(epost) {
  const adress = String(epost).trim().toLowerCase()
  const s = stripe()
  const svar = await s.paymentIntents.list({ limit: 100 })
  const traffar = svar.data.filter(
    (pi) => String(pi.metadata?.kontakt_epost || "").trim().toLowerCase() === adress
  )
  for (const pi of traffar) {
    await s.paymentIntents.update(pi.id, { metadata: { paminnelse_avreg: "1" } })
  }
  return traffar.length
}
