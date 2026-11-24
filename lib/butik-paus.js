/**
 * Pausläge: butiken visar "Under konstruktion" och tar inte emot beställningar.
 *
 * Slå på eller av med BUTIKEN_PAUSAD och deploya. proxy.js läser beslutet för
 * varje anrop, och cron-jobben som mejlar kunder (kassapåminnelse,
 * omdömespåminnelse) hoppar över sina utskick medan pausen gäller.
 *
 * Det som hålls öppet är det befintliga kunder och Joel behöver: admin,
 * Stripe-webhooken, Mitt konto, omdömeslänkar och avregistrering från mejl
 * som redan skickats, samt köpvillkor och integritetspolicy.
 */

export const BUTIKEN_PAUSAD = true

export const PAUS_KONTAKT = "info@batteriproffs.se"

const OPPNA_SIDOR = [
  "/admin",
  "/konto",
  "/aterstall",
  "/omdome",
  "/kassa-avreg",
  "/villkor",
  "/integritet",
  "/marginaler",
]

const OPPNA_API = [
  "/api/stripe/webhook",
  "/api/admin",
  "/api/order",
  "/api/konto",
  "/api/omdome",
  "/api/cron",
]

const OPPNA_FILER = ["/robots.txt"]

const STATISK_FIL = /\.(svg|png|jpe?g|webp|avif|gif|ico|woff2?|mp3|css|js|map)$/i

function underSokvag(path, prefix) {
  return path === prefix || path.startsWith(prefix + "/")
}

/**
 * "oppen" = släpp igenom, "api" = svara 503 JSON, "sida" = visa pausidan (503).
 */
export function pausBeslut(path, pausad = BUTIKEN_PAUSAD) {
  if (!pausad) return "oppen"
  if (path.startsWith("/_next/")) return "oppen"
  if (OPPNA_FILER.includes(path) || STATISK_FIL.test(path)) return "oppen"
  if (path.startsWith("/api/")) {
    return OPPNA_API.some((p) => underSokvag(path, p)) ? "oppen" : "api"
  }
  return OPPNA_SIDOR.some((p) => underSokvag(path, p)) ? "oppen" : "sida"
}

export const PAUS_API_FEL = `Butiken är tillfälligt stängd och tar inte emot beställningar just nu. Mejla ${PAUS_KONTAKT} så hjälper vi dig.`

export const PAUS_HTML = `<!doctype html>
<html lang="sv">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Under konstruktion | Batteriproffs</title>
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<style>
  *{box-sizing:border-box}
  body{margin:0;min-height:100vh;display:flex;flex-direction:column;background:#0B1D3A;color:#fff;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;line-height:1.55}
  main{flex:1;display:flex;align-items:center;justify-content:center;padding:48px 20px}
  .kort{max-width:560px;width:100%}
  .logo{font-size:28px;font-weight:800;letter-spacing:-0.02em;margin:0 0 40px}
  .logo span{color:#FDB813}
  .etikett{display:inline-block;background:#FDB813;color:#0B1D3A;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;padding:6px 12px;border-radius:999px;margin-bottom:20px}
  h1{font-size:clamp(30px,6vw,44px);line-height:1.15;margin:0 0 16px;letter-spacing:-0.02em}
  p{margin:0 0 16px;color:#D6DCE6;font-size:17px}
  a{color:#FFCA28}
  .mejl{display:inline-block;margin-top:8px;background:#fff;color:#0B1D3A;font-weight:700;text-decoration:none;padding:12px 20px;border-radius:8px}
  .mejl:hover{background:#FFCA28}
  footer{padding:24px 20px;font-size:14px;color:#9AA6B8;text-align:center}
  footer a{color:#C9D2DF;margin:0 8px}
</style>
</head>
<body>
<main>
  <div class="kort">
    <p class="logo">Batteri<span>proffs</span></p>
    <div class="etikett">Under konstruktion</div>
    <h1>Vi bygger om butiken</h1>
    <p>Just nu tar vi inte emot några beställningar.</p>
    <p>Har du en pågående order eller en fråga? Mejla oss så hjälper vi dig.</p>
    <a class="mejl" href="mailto:${PAUS_KONTAKT}">${PAUS_KONTAKT}</a>
  </div>
</main>
<footer>
  <div><a href="/konto">Mitt konto</a><a href="/villkor">Köpvillkor</a><a href="/integritet">Integritetspolicy</a></div>
  <div style="margin-top:10px">Joel Stolt · Org.nr 901108-0851</div>
</footer>
</body>
</html>`
