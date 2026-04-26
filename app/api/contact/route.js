import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const TO = process.env.CONTACT_TO_EMAIL
const FROM = process.env.CONTACT_FROM_EMAIL || "Batteriproffs <noreply@batteriproffs.se>"

function escape(s = "") {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, email, phone, message, type } = body || {}

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Namn, e-post och meddelande krävs" },
        { status: 400 }
      )
    }

    if (!process.env.RESEND_API_KEY || !TO) {
      console.error("Missing RESEND_API_KEY or CONTACT_TO_EMAIL")
      return NextResponse.json(
        { error: "Server är inte konfigurerad" },
        { status: 500 }
      )
    }

    const customerType = type === "privat" ? "Privatperson" : "Företag"

    const html = `
      <div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#0A1628;">
        <h2 style="margin:0 0 16px;font-size:18px;">Nytt meddelande från batteriproffs.se</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr><td style="padding:6px 0;color:#666;width:120px;">Kundtyp</td><td>${escape(customerType)}</td></tr>
          <tr><td style="padding:6px 0;color:#666;">Namn</td><td>${escape(name)}</td></tr>
          <tr><td style="padding:6px 0;color:#666;">E-post</td><td><a href="mailto:${escape(email)}">${escape(email)}</a></td></tr>
          ${phone ? `<tr><td style="padding:6px 0;color:#666;">Telefon</td><td><a href="tel:${escape(phone)}">${escape(phone)}</a></td></tr>` : ""}
        </table>
        <div style="margin-top:20px;padding:16px;background:#F7F8FA;border-radius:8px;white-space:pre-wrap;font-size:14px;line-height:1.5;">${escape(message)}</div>
      </div>
    `

    const { error } = await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `Kontakt (${customerType}): ${name}`,
      html,
    })

    if (error) {
      console.error("Resend error:", error)
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
