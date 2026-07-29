import { NextResponse } from "next/server"
import { resend, FROM, ADMIN_EMAIL, escape, emailLayout } from "@/lib/emails"
import { rateLimit, clientIp, isOwnOrigin, ALLOWED_ORIGINS } from "@/lib/rate-limit"
import { skapaMagiskToken, giltigEpost } from "@/lib/konto-auth"
import { SITE_URL } from "@/lib/constants"

export const runtime = "nodejs"

/**
 * Skickar inloggningslänken.
 *
 * Svaret är ALLTID detsamma, oavsett om adressen har ordrar eller inte. Skilde
 * de sig åt vore endpointen ett sätt att fråga sajten vilka företag som handlat
 * här, en adress i taget.
 */
export async function POST(request) {
  if (!isOwnOrigin(request, ALLOWED_ORIGINS)) {
    return NextResponse.json({ error: "Ogiltigt anrop" }, { status: 403 })
  }

  const ip = clientIp(request)
  // Varje anrop kan skicka ett mejl. Utan tak går det att bränna Resend-kvoten
  // och samtidigt spamma en adress som inte bett om något.
  const limit = rateLimit(`konto-login:${ip}`, 5, 15 * 60 * 1000)
  if (!limit.ok) {
    return NextResponse.json(
      { error: "För många försök. Vänta en stund." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    )
  }

  const body = await request.json().catch(() => null)
  const epost = String(body?.epost || "").trim().toLowerCase()

  if (!giltigEpost(epost)) {
    return NextResponse.json({ error: "Ogiltig mejladress" }, { status: 400 })
  }

  // Andra taket, per adress. Stoppar den som byter IP men hamrar på samma
  // mottagare — det är mottagaren som drabbas av spammen.
  const adressLimit = rateLimit(`konto-login-adress:${epost}`, 5, 15 * 60 * 1000)
  if (!adressLimit.ok) {
    return NextResponse.json({ ok: true })
  }

  const token = skapaMagiskToken(epost)
  if (!token) {
    console.error("ADMIN_TOKEN saknas — kan inte signera inloggningslänkar")
    return NextResponse.json({ error: "Inloggning är inte tillgänglig" }, { status: 503 })
  }

  const lank = `${SITE_URL}/api/konto/verifiera?t=${encodeURIComponent(token)}`

  try {
    await resend.emails.send({
      from: FROM,
      to: epost,
      replyTo: ADMIN_EMAIL,
      subject: "Din inloggningslänk till Batteriproffs",
      html: emailLayout({
        title: "Logga in på ditt konto",
        preheader: "Länken gäller i 15 minuter.",
        body: `
          <h1 style="margin:0 0 6px;font-size:22px;font-weight:800;letter-spacing:-0.01em;">
            Logga in på ditt konto
          </h1>
          <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#374151;">
            Klicka på knappen så kommer du in på ${escape(epost)} och ser dina
            ordrar. Länken gäller i 15 minuter.
          </p>
          <a href="${escape(lank)}" style="display:inline-block;background:#0B1D3A;color:#fff;text-decoration:none;padding:13px 26px;border-radius:10px;font-weight:700;font-size:14px;">
            Logga in
          </a>
          <p style="margin-top:26px;font-size:13px;line-height:1.6;color:#6B7280;">
            Bad du inte om den här länken kan du strunta i mejlet. Ingen kommer
            in på kontot utan att klicka.
          </p>
        `,
      }),
    })
  } catch (err) {
    // Loggas, men kunden får samma svar som vanligt. Ett felmeddelande här
    // skulle avslöja vilka adresser Resend accepterar.
    console.error("Kunde inte skicka inloggningslänk:", err)
  }

  return NextResponse.json({ ok: true })
}
