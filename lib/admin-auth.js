import { timingSafeEqual } from "node:crypto"
import { NextResponse } from "next/server"
import { rateLimit, clientIp } from "./rate-limit"

/**
 * Delad tokenkoll för admin-endpointerna.
 *
 * Token skickas i headern `x-admin-token`, aldrig i URL:en — query-strängar
 * hamnar i Vercels accessloggar och i webbläsarhistoriken.
 *
 * Jämförelsen är konstanttid. En timingattack över HTTP är i praktiken svår,
 * men `!==` avbryter på första felaktiga tecknet och det finns ingen anledning
 * att lämna den signalen när node:crypto redan har rätt verktyg.
 */
function tokenMatchar(kandidat, facit) {
  const a = Buffer.from(String(kandidat))
  const b = Buffer.from(String(facit))
  // timingSafeEqual kastar om längderna skiljer sig, så längden måste kollas
  // först. Att längden läcker är ointressant — hemligheten är innehållet.
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

/**
 * Returnerar null när anropet är godkänt, annars ett färdigt felsvar.
 *
 * Svaret byggs i en ny NextResponse varje gång. Ett delat svarsobjekt går inte
 * att återanvända mellan anrop — kroppen är en ström som läses en enda gång.
 */
export function kravAdmin(request) {
  const ip = clientIp(request)

  // Bromsar tokengissning. WAF-regeln på /api/* tar den distribuerade varianten,
  // den här tar den enkla: någon som sitter och hamrar från en och samma adress.
  const limit = rateLimit(`admin:${ip}`, 30, 60 * 1000)
  if (!limit.ok) {
    return NextResponse.json(
      { error: "För många försök" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    )
  }

  const forvantad = process.env.ADMIN_TOKEN
  if (!forvantad) {
    console.error("ADMIN_TOKEN saknas i miljön — admin-endpointen är stängd")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const token = request.headers.get("x-admin-token")
  if (!token || !tokenMatchar(token, forvantad)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return null
}
