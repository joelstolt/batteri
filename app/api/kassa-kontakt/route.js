import { readOrderItems } from "@/lib/order-items"
import Stripe from "stripe"
import { NextResponse } from "next/server"
import { giltigEpost } from "@/lib/konto-auth"
import { resend, FROM, ADMIN_EMAIL, escape, emailLayout } from "@/lib/emails"
import { rateLimit, clientIp, isOwnOrigin, ALLOWED_ORIGINS } from "@/lib/rate-limit"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const runtime = "nodejs"

/**
 * Fäster beställarens mejladress på betalningen SÅ FORT den är ifylld i
 * kassan, långt före bekräftelsen. Utan det här är en övergiven kassa helt
 * anonym — augusti 2026 lämnades ~35 000 kr i påbörjade kassor som aldrig
 * gick att följa upp.
 *
 * Nyckeln heter kontakt_epost, INTE buyer_email. buyer_email är markören för
 * en genomförd order: kundkontot söker på den och adminvyn litar på den.
 * Skrevs den här skulle varje övergiven kassa dyka upp som en order i kundens
 * konto.
 */
export async function POST(request) {
  try {
    if (!isOwnOrigin(request, ALLOWED_ORIGINS)) {
      return NextResponse.json({ error: "Ogiltigt anrop" }, { status: 403 })
    }
    const limit = rateLimit(`kontakt:${clientIp(request)}`, 20, 10 * 60 * 1000)
    if (!limit.ok) {
      return NextResponse.json(
        { error: "För många försök" },
        { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
      )
    }

    const body = await request.json().catch(() => null)
    const { paymentIntentId, clientSecret, epost, namn, foretag } = body || {}

    if (!paymentIntentId || !clientSecret || !giltigEpost(epost)) {
      return NextResponse.json({ error: "Ogiltigt anrop" }, { status: 400 })
    }

    const pi = await stripe.paymentIntents.retrieve(paymentIntentId)

    // Bara den som har betalningens client_secret får ändra på den
    if (pi.client_secret !== clientSecret) {
      return NextResponse.json({ error: "Ogiltigt anrop" }, { status: 403 })
    }

    // En redan betald order får inte skrivas om i efterhand
    if (pi.status !== "requires_payment_method" && pi.status !== "requires_confirmation") {
      return NextResponse.json({ error: "Betalningen kan inte ändras" }, { status: 409 })
    }

    const adress = String(epost).trim().toLowerCase()
    // Samma adress på samma betalning = redan noterad, ingen ny notis.
    const redan = (pi.metadata?.kontakt_epost || "") === adress

    /*
     * Namn och företag sparas med, när de är ifyllda. Påminnelsemejlet kan
     * annars bara säga "Hej", och ett anonymt mejl om en övergiven kassa
     * läser som spam. Fälten är frivilliga: kunden hinner ofta fylla i
     * mejladressen först.
     */
    const trimma = (v, max) =>
      typeof v === "string" && v.trim() ? v.trim().slice(0, max) : undefined
    await stripe.paymentIntents.update(paymentIntentId, {
      metadata: {
        kontakt_epost: adress,
        kontakt_epost_at: String(Math.floor(Date.now() / 1000)),
        ...(trimma(namn, 80) ? { kontakt_namn: trimma(namn, 80) } : {}),
        ...(trimma(foretag, 100) ? { kontakt_foretag: trimma(foretag, 100) } : {}),
      },
    })

    // Notis till Joel: någon står i kassan med ifylld mejladress. Poängen är
    // uppföljningen — köper de inte inom en timme går det att mejla och fråga
    // om de behöver hjälp. Notisen får aldrig fälla själva sparningen.
    if (!redan && ADMIN_EMAIL) {
      let rader = []
      try {
        rader = readOrderItems(pi.metadata).rader
          .map((r) => `${r.q ?? r.qty ?? 1} st ${r.n ?? r.name ?? "?"}`)
      } catch {}
      resend.emails
        .send({
          from: FROM,
          to: ADMIN_EMAIL,
          replyTo: adress,
          subject: `I kassan nu: ${adress} (${Math.round(pi.amount / 100)} kr)`,
          html: emailLayout({
            title: "Någon står i kassan",
            preheader: `${adress} · ${Math.round(pi.amount / 100)} kr`,
            internt: true,
            body: `
              <h1 style="margin:0 0 12px;font-size:20px;font-weight:800;">Någon står i kassan</h1>
              <p style="margin:0 0 14px;font-size:14px;line-height:1.7;color:#374151;">
                <strong>${escape(adress)}</strong> har fyllt i sin mejladress i kassan.
                Varukorg: ${Math.round(pi.amount / 100)} kr.
              </p>
              <p style="margin:0 0 14px;font-size:14px;line-height:1.7;color:#374151;">
                ${rader.length ? rader.map(escape).join("<br>") : "(rader saknas i metadatan)"}
              </p>
              <p style="margin:0;font-size:13px;line-height:1.6;color:#6B7280;">
                Kommer ingen orderbekräftelse inom en timme har köpet troligen
                fastnat — svara på det här mejlet (går direkt till kunden) och
                fråga om de behöver hjälp. Kolla först i Stripe att ordern inte
                gick igenom.
              </p>`,
          }),
        })
        .catch((err) => console.error("Kassanotis kunde inte skickas:", err))
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Kassa-kontakt kunde inte sparas:", error)
    return NextResponse.json({ error: "Kunde inte spara" }, { status: 500 })
  }
}
