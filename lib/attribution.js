/**
 * Varifrån ordern kom.
 *
 * Källan fångas i webbläsaren vid första sidladdningen och fästs på
 * PaymentIntent precis innan betalningen bekräftas, exakt som
 * företagsuppgifterna. Stripe är orderdatabasen, alltså hör källan hemma där
 * och inte bara i Umami: analysverktyget gallrar sin historik, kan ligga nere
 * när man frågar, och kräver att man manuellt letar rätt på sessionen som
 * råkar bära rätt payment_intent i adressraden.
 *
 * INGET lagras på kundens enhet. Signalerna läses ur document.referrer och
 * adressraden vid mount och hålls i React-state, som är flyktigt minne.
 * ePrivacy art. 5(3) gäller all lagring på terminalutrustning, inte bara
 * kakor, och annonsattribution är inte "strikt nödvändigt" — localStorage
 * hade alltså krävt samtycke. Fångsten sker i lib/attribution-context.js.
 *
 * Den här filen är avsiktligt fri från React så att både kassa-routen och
 * adminvyn kan tolka samma fält på samma sätt.
 */

/** Egna värdnamn. En referrer härifrån betyder att mätpunkten missade entrén. */
const EGNA_VARDAR = ["batteriproffs.se", "www.batteriproffs.se"]

/**
 * Sökmotorer vi vill namnge. Listan behöver inte vara komplett — allt som inte
 * matchar hamnar som "Hänvisning <domän>", vilket är läsbart i sig.
 */
const SOKMOTORER = [
  [/(^|\.)google\./, "Google"],
  [/(^|\.)bing\./, "Bing"],
  [/(^|\.)duckduckgo\./, "DuckDuckGo"],
  [/(^|\.)yahoo\./, "Yahoo"],
  [/(^|\.)ecosia\./, "Ecosia"],
  [/(^|\.)brave\./, "Brave"],
  [/(^|\.)yandex\./, "Yandex"],
  [/(^|\.)baidu\./, "Baidu"],
]

/** AI-assistenter skickar också trafik, och den är värd att skilja ut. */
const AI_KALLOR = [
  [/(^|\.)chatgpt\.com|(^|\.)openai\./, "ChatGPT"],
  [/(^|\.)perplexity\./, "Perplexity"],
  [/(^|\.)claude\.ai/, "Claude"],
  [/(^|\.)copilot\.microsoft\./, "Copilot"],
  [/(^|\.)gemini\.google\./, "Gemini"],
]

/** Värdnamnet ur en adress. Tom sträng när adressen saknas eller är trasig. */
export function vardnamn(url) {
  if (!url) return ""
  try {
    return new URL(url).hostname.toLowerCase()
  } catch {
    return ""
  }
}

/**
 * Läser källsignalerna ur webbläsarens tillstånd.
 *
 * @param {string} referrer  document.referrer
 * @param {Location|URL} location  window.location
 */
export function lasKallsignaler(referrer, location) {
  let params
  try {
    params = new URLSearchParams(location?.search || "")
  } catch {
    params = new URLSearchParams()
  }
  return {
    referrer: vardnamn(referrer),
    landing: String(location?.pathname || "/"),
    gclid: params.get("gclid") || params.get("wbraid") || params.get("gbraid") || "",
    utmSource: params.get("utm_source") || "",
    utmMedium: params.get("utm_medium") || "",
    utmCampaign: params.get("utm_campaign") || "",
  }
}

/**
 * AI-källan ur vilken signal som helst som kan bära den.
 *
 * ChatGPT skickar `noreferrer` och märker i stället länken med
 * `?utm_source=chatgpt.com`, alltså finns källan bara i adressraden. Därför
 * matchas både referrern och utm_source här. Punkten som läggs på utm_source
 * finns för att värdet ibland kommer utan toppdomän ("perplexity"), och
 * mönstren nedan är skrivna för värdnamn: "perplexity" + "." matchar samma
 * regel som referrern perplexity.ai.
 */
function hittaAiKalla(...signaler) {
  const kandidater = []
  for (const s of signaler) {
    const v = String(s || "").toLowerCase().trim()
    if (!v) continue
    kandidater.push(v)
    if (!v.includes(".")) kandidater.push(`${v}.`)
  }
  const traff = AI_KALLOR.find(([re]) => kandidater.some((k) => re.test(k)))
  return traff ? traff[1] : ""
}

/**
 * Signalerna till en mening en människa kan läsa i adminvyn.
 *
 * Ordningen är inte godtycklig:
 * - en gclid är ett bevis på ett annonsklick och slår allt annat, eftersom
 *   referrern då ändå står som google.com och skulle få köpet att se organiskt ut.
 * - AI-källan ligger FÖRE utm_source. Annars vinner utm-grenen alltid för
 *   ChatGPT (som både strippar referrern och taggar länken), kanalen blir den
 *   råa strängen "chatgpt.com" och AI-trafiken går inte att räkna på etiketten.
 */
export function klassificeraKalla(source) {
  const { referrer = "", gclid = "", utmSource = "", utmMedium = "" } = source || {}

  if (gclid) return "Google Ads (betald)"

  const ai = hittaAiKalla(referrer, utmSource)
  if (ai) return `AI-assistent ${ai}`

  if (utmSource) return utmMedium ? `${utmSource} / ${utmMedium}` : String(utmSource)
  if (!referrer) return "Direkt"
  if (EGNA_VARDAR.includes(referrer)) return "Egen sajt (sidan laddades om)"

  const motor = SOKMOTORER.find(([re]) => re.test(referrer))
  if (motor) return `Organiskt ${motor[1]}`

  return `Hänvisning ${referrer}`
}

/**
 * Kanalen som den ska läsas, även på ordrar som lades före omflyttningen ovan.
 *
 * Kanalen fryses i metadatan när ordern läggs, alltså bär ordrar från före
 * 2026-08-24 råsträngen "chatgpt.com". Utan det här hade en räkning på
 * "AI-assistent" missat dem, och adminvyn hade visat två namn på samma källa.
 */
export function pyntaKanal(kanal) {
  const v = String(kanal || "").trim()
  if (!v || v.startsWith("AI-assistent")) return v
  const ai = hittaAiKalla(v.split("/")[0].trim())
  return ai ? `AI-assistent ${ai}` : v
}

/**
 * Källan som Stripe-metadata.
 *
 * Tomma fält utelämnas helt. Stripe tar 50 nycklar per objekt och ordern
 * använder ett tjugotal, så det finns gott om utrymme, men tomma nycklar gör
 * bara dashboarden svårare att läsa.
 */
export function buildSourceMetadata(source) {
  if (!source || typeof source !== "object") return {}

  // Bara primitiver släpps igenom. Ett objekt hade annars blivit strängen
  // "[object Object]" och förgiftat t.ex. en gclid-export till Google Ads.
  const t = (v, max) =>
    typeof v === "string" || typeof v === "number" ? String(v).trim().slice(0, max) : ""
  const rensad = {
    referrer: t(source.referrer, 120),
    landing: t(source.landing, 200),
    gclid: t(source.gclid, 200),
    utmSource: t(source.utmSource, 60),
    utmMedium: t(source.utmMedium, 60),
    utmCampaign: t(source.utmCampaign, 60),
  }

  const meta = {
    source_channel: klassificeraKalla(rensad).slice(0, 100),
    source_landing: rensad.landing || "/",
  }
  if (rensad.referrer) meta.source_referrer = rensad.referrer
  if (rensad.gclid) meta.source_gclid = rensad.gclid
  if (rensad.utmCampaign) meta.source_campaign = rensad.utmCampaign

  return meta
}

/**
 * Källan tillbaka ur metadatan.
 *
 * Ordrar som lades före den här mätningen saknar fälten helt. De ska visa
 * "Okänd" och inte "Direkt" — skillnaden mellan omätt och uppmätt-till-noll
 * är hela poängen med att mäta.
 */
export function lasKallaUrMetadata(meta = {}) {
  const kanal = pyntaKanal(meta.source_channel || "")
  return {
    channel: kanal || "Okänd (ordern lades före mätningen)",
    matt: Boolean(kanal),
    referrer: meta.source_referrer || "",
    landing: meta.source_landing || "",
    gclid: meta.source_gclid || "",
    campaign: meta.source_campaign || "",
  }
}
