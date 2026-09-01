import { createHmac, timingSafeEqual } from "node:crypto"

/**
 * Inloggning till kundkontot, utan databas och utan lösenord.
 *
 * Kunden skriver in sin mejladress, får en länk, klickar, och är inne. Det
 * finns inget lösenord att glömma, ingen användartabell att synka mot Stripe
 * och inget kontoregister att läcka. Adressen ÄR kontot: ordrarna hittas på
 * metadatafältet buyer_email i Stripe.
 *
 * Signeringsnyckeln härleds ur ADMIN_TOKEN i stället för att vara en egen
 * miljövariabel. Det är en vanlig nyckelhärledning: HMAC med en fast etikett
 * ger en nyckel som är kryptografiskt oberoende av rotnyckeln, så en läckt
 * sessionscookie säger ingenting om ADMIN_TOKEN. Konsekvensen att känna till:
 * roteras ADMIN_TOKEN loggas alla kunder ut. Det är acceptabelt — de begär
 * bara en ny länk. Vill man koppla isär dem är nästa steg en egen KONTO_SECRET.
 */

const MAGISK_LANK_SEKUNDER = 15 * 60

/**
 * Sessionen håller i 90 dagar, inte 30.
 *
 * B2B-kunder beställer kvartalsvis. Med en månad hade i praktiken varje besök
 * krävt en ny mejlrunda, och då slutar folk gå in. Kontot visar orderhistorik
 * och leveransadresser men kan varken betala något eller ändra uppgifter, så
 * en längre session kostar lite och sparar ett steg varje gång.
 */
const SESSION_SEKUNDER = 90 * 24 * 60 * 60

export const SESSION_COOKIE = "bp-konto"

function nyckel(etikett) {
  const rot = process.env.ADMIN_TOKEN
  if (!rot) return null
  return createHmac("sha256", rot).update(etikett).digest()
}

function b64url(buf) {
  return Buffer.from(buf).toString("base64url")
}

function signera(data, etikett) {
  const k = nyckel(etikett)
  if (!k) return null
  const payload = b64url(JSON.stringify(data))
  const sig = b64url(createHmac("sha256", k).update(payload).digest())
  return `${payload}.${sig}`
}

function verifiera(token, etikett) {
  const k = nyckel(etikett)
  if (!k || typeof token !== "string") return null

  const delar = token.split(".")
  if (delar.length !== 2) return null
  const [payload, sig] = delar

  const forvantad = b64url(createHmac("sha256", k).update(payload).digest())
  const a = Buffer.from(sig)
  const b = Buffer.from(forvantad)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null

  let data
  try {
    data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"))
  } catch {
    return null
  }

  // Utgångstiden ligger inuti det signerade fältet, så den går inte att skruva
  // på utan att signaturen slutar stämma.
  if (!data?.exp || data.exp < Math.floor(Date.now() / 1000)) return null
  return data
}

/** Kortlivad token som mejlas ut. Giltig i 15 minuter. */
export function skapaMagiskToken(epost) {
  return signera(
    { epost, exp: Math.floor(Date.now() / 1000) + MAGISK_LANK_SEKUNDER },
    "batteriproffs-magisk-lank-v1"
  )
}

export function lasMagiskToken(token) {
  return verifiera(token, "batteriproffs-magisk-lank-v1")?.epost || null
}

/** Långlivad session. Egen etikett, så en magisk länk aldrig duger som session. */
export function skapaSessionToken(epost) {
  return signera(
    { epost, exp: Math.floor(Date.now() / 1000) + SESSION_SEKUNDER },
    "batteriproffs-session-v1"
  )
}

export function lasSessionToken(token) {
  return verifiera(token, "batteriproffs-session-v1")?.epost || null
}

/**
 * Omdömestoken: mejlas i omdömesmejlet och öppnar EN sak — formuläret för att
 * betygsätta artiklarna på just den ordern. Den ger ingen inloggning, ingen
 * orderhistorik och inga kunduppgifter, så en vidarebefordran exponerar inte
 * mer än mejlet självt redan gör. Egen etikett så den aldrig duger som session.
 *
 * 90 dagar: omdömesmejl ligger kvar i B2B-inkorgar och betas av sent. En kund
 * som svarar efter en månad är fortfarande ett omdöme värt att ha.
 */
const OMDOME_SEKUNDER = 90 * 24 * 60 * 60

export function skapaOmdomeToken(piId) {
  return signera(
    { pi: piId, exp: Math.floor(Date.now() / 1000) + OMDOME_SEKUNDER },
    "batteriproffs-omdome-v1"
  )
}

export function lasOmdomeToken(token) {
  return verifiera(token, "batteriproffs-omdome-v1")?.pi || null
}

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  // lax krävs: kunden kommer hit via en toppnivånavigering från sin mejlklient,
  // och med strict skulle cookien inte följa med på just det anropet.
  sameSite: "lax",
  path: "/",
  maxAge: SESSION_SEKUNDER,
}

/** Konservativ adresskontroll. Ska bara släppa igenom det som kan ta emot mejl. */
export function giltigEpost(v) {
  const s = String(v || "").trim()
  return s.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)
}

/** Läser inloggad adress ur cookien, eller null. */
export function inloggadEpost(request) {
  const token = request.cookies.get(SESSION_COOKIE)?.value
  return token ? lasSessionToken(token) : null
}
