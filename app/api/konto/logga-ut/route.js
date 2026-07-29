import { NextResponse } from "next/server"
import { SESSION_COOKIE, SESSION_COOKIE_OPTIONS } from "@/lib/konto-auth"

export const runtime = "nodejs"

export async function POST() {
  const svar = NextResponse.json({ ok: true })
  // maxAge 0 raderar. Övriga flaggor måste vara identiska med när cookien
  // sattes, annars ser webbläsaren det som en annan cookie och den gamla
  // ligger kvar.
  svar.cookies.set(SESSION_COOKIE, "", { ...SESSION_COOKIE_OPTIONS, maxAge: 0 })
  return svar
}
