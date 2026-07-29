import { NextResponse } from "next/server"
import {
  lasMagiskToken,
  skapaSessionToken,
  SESSION_COOKIE,
  SESSION_COOKIE_OPTIONS,
} from "@/lib/konto-auth"
import { SITE_URL } from "@/lib/constants"

export const runtime = "nodejs"

/**
 * Tar emot klicket från inloggningsmejlet, växlar den kortlivade token mot en
 * session och skickar kunden vidare.
 *
 * Svaret är alltid en omdirigering, aldrig en sida. Token ligger i URL:en och
 * URL:er hamnar i webbläsarhistorik och i Referer-headern mot varje bild och
 * skript sidan sen laddar. Genom att omdirigera direkt är adressen med token
 * aldrig den sida som blir kvar i fältet.
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const epost = lasMagiskToken(searchParams.get("t"))

  if (!epost) {
    return NextResponse.redirect(`${SITE_URL}/konto?fel=lank`, { status: 303 })
  }

  const session = skapaSessionToken(epost)
  if (!session) {
    return NextResponse.redirect(`${SITE_URL}/konto?fel=lank`, { status: 303 })
  }

  const svar = NextResponse.redirect(`${SITE_URL}/konto`, { status: 303 })
  svar.cookies.set(SESSION_COOKIE, session, SESSION_COOKIE_OPTIONS)
  return svar
}
