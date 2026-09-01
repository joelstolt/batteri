import { NextResponse } from "next/server"
import { resend, FROM, ADMIN_EMAIL, escape, emailLayout } from "@/lib/emails"
import { rateLimit, clientIp, isOwnOrigin, ALLOWED_ORIGINS } from "@/lib/rate-limit"

export const runtime = "nodejs"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_MESSAGE = 5000

// Skräppost svarar 200 utan att skicka något — en bot ska inte få veta att
// den fastnade, då justerar den bara och försöker igen.
//
// Måste vara en funktion. Ett återanvänt NextResponse-objekt har en body som
// bara kan läsas en gång, så andra anropet och framåt fick tom kropp.
const silentOk = () => NextResponse.json({ ok: true })

export async function POST(request) {
  try {
    // Bot-trafik postar rakt mot API:et och saknar oftast korrekt Origin
    if (!isOwnOrigin(request, ALLOWED_ORIGINS)) return silentOk()

    const ip = clientIp(request)
    const limit = rateLimit(`contact:${ip}`, 3, 10 * 60 * 1000)
    if (!limit.ok) {
      return NextResponse.json(
        { error: "För många meddelanden. Vänta en stund eller mejla info@batteriproffs.se." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
      )
    }

    const body = await request.json()
    const { name, email, phone, message, type, hp_field } = body || {}

    // Honeypot. Fältet är dolt för människor — är det ifyllt är det en bot.
    // Namnet får ALDRIG vara company/website/url/email: webbläsarnas autofyll
    // fyller i dem åt riktiga kunder och då tappas leadet tyst.
    if (hp_field) return silentOk()

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Namn, e-post och meddelande krävs" },
        { status: 400 }
      )
    }

    if (!EMAIL_RE.test(String(email)) || String(message).length > MAX_MESSAGE) {
      return NextResponse.json({ error: "Ogiltiga uppgifter" }, { status: 400 })
    }

    // Nästan all formulärspam klistrar in länkar. Riktiga batterifrågor gör det inte.
    const linkCount = (String(message).match(/https?:\/\//gi) || []).length
    if (linkCount >= 2) return silentOk()

    if (!process.env.RESEND_API_KEY || !ADMIN_EMAIL) {
      console.error("Missing RESEND_API_KEY or CONTACT_TO_EMAIL")
      return NextResponse.json(
        { error: "Server är inte konfigurerad" },
        { status: 500 }
      )
    }

    const customerType = type === "privat" ? "Privatperson" : "Företag"

    const adminBody = `
      <h1 style="margin:0 0 16px;font-size:18px;font-weight:800;">Nytt meddelande från batteriproffs.se</h1>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
        <tr><td style="padding:6px 0;color:#6B7280;width:120px;">Kundtyp</td><td>${escape(customerType)}</td></tr>
        <tr><td style="padding:6px 0;color:#6B7280;">Namn</td><td>${escape(name)}</td></tr>
        <tr><td style="padding:6px 0;color:#6B7280;">E-post</td><td><a href="mailto:${escape(email)}" style="color:#0B1D3A;">${escape(email)}</a></td></tr>
        ${phone ? `<tr><td style="padding:6px 0;color:#6B7280;">Telefon</td><td><a href="tel:${escape(phone)}" style="color:#0B1D3A;">${escape(phone)}</a></td></tr>` : ""}
      </table>
      <div style="margin-top:18px;padding:16px;background:#F7F8FA;border-radius:10px;white-space:pre-wrap;font-size:14px;line-height:1.6;">${escape(message)}</div>
    `

    const customerBody = `
      <h1 style="margin:0 0 12px;font-size:20px;font-weight:800;">Tack ${escape(name.split(" ")[0])}!</h1>
      <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#374151;">
        Vi har tagit emot ditt meddelande och återkommer normalt inom
        24 timmar på vardagar. Behöver du svar snabbare? Chatta med oss på
        <a href="https://www.batteriproffs.se" style="color:#0B1D3A;font-weight:600;">batteriproffs.se</a>.
      </p>
      <div style="margin-top:8px;padding:14px 16px;background:#F7F8FA;border-radius:10px;font-size:13px;line-height:1.6;color:#6B7280;">
        <div style="font-weight:600;color:#0A1628;margin-bottom:4px;">Ditt meddelande</div>
        <div style="white-space:pre-wrap;">${escape(message)}</div>
      </div>
    `

    const [adminRes] = await Promise.all([
      resend.emails.send({
        from: FROM,
        to: ADMIN_EMAIL,
        replyTo: email,
        subject: `Kontakt (${customerType}): ${name}`,
        html: emailLayout({
          title: `Nytt meddelande — ${name}`,
          preheader: `${customerType} · ${email}`,
          body: adminBody,
        }),
      }),
      resend.emails.send({
        from: FROM,
        to: email,
        replyTo: ADMIN_EMAIL,
        subject: "Tack för ditt meddelande — Batteriproffs",
        html: emailLayout({
          title: "Vi har tagit emot ditt meddelande",
          preheader: "Vi återkommer inom 24 timmar.",
          body: customerBody,
        }),
      }).catch((err) => {
        console.warn("Customer auto-reply failed (non-blocking):", err)
      }),
    ])

    if (adminRes?.error) {
      console.error("Resend admin error:", adminRes.error)
      return NextResponse.json(
        { error: "Kunde inte skicka meddelandet" },
        { status: 502 }
      )
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Contact route error:", err)
    return NextResponse.json(
      { error: "Något gick fel" },
      { status: 500 }
    )
  }
}
