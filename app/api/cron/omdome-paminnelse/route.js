import Stripe from "stripe"
import { NextResponse } from "next/server"
import {
  hittaOmdomesPaminnelser,
  skickaOmdomesPaminnelse,
} from "@/lib/omdome-paminnelse"
import { orderIdFor } from "@/lib/orders"

/**
 * Kör en gång om dagen via Vercel cron (vercel.json) och skickar de
 * omdömespåminnelser som är mogna. Urvalet ligger i lib/omdome-paminnelse.js.
 *
 * `?torrkor=1` visar vad som SKULLE skickas utan att skicka något. Använd det
 * före varje ändring i urvalet, ett felaktigt utskick går inte att ta tillbaka.
 */

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 60

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { maxNetworkRetries: 2 })

export async function GET(req) {
  const secret = process.env.CRON_SECRET
  const auth = req.headers.get("authorization") || ""
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const torrkor = new URL(req.url).searchParams.get("torrkor") === "1"

  try {
    const mogna = await hittaOmdomesPaminnelser(stripe)

    if (torrkor) {
      return NextResponse.json({
        ok: true,
        torrkor: true,
        antal: mogna.length,
        kandidater: mogna.map((pi) => ({
          order: orderIdFor(pi.id),
          epost: pi.metadata?.buyer_email || pi.receipt_email,
          omdomesmejlKoat: new Date(Number(pi.metadata.review_email_at) * 1000).toISOString(),
        })),
      })
    }

    const resultat = []
    for (const pi of mogna) {
      try {
        resultat.push(await skickaOmdomesPaminnelse(pi, stripe))
      } catch (err) {
        console.error("Omdömespåminnelse misslyckades:", pi.id, err)
        resultat.push({ ok: false, order: orderIdFor(pi.id), fel: String(err?.message || err) })
      }
    }

    return NextResponse.json({
      ok: true,
      skickade: resultat.filter((r) => r.ok).length,
      misslyckade: resultat.filter((r) => !r.ok).length,
      resultat,
    })
  } catch (err) {
    console.error("Omdömespåminnelse-jobbet kraschade:", err)
    return NextResponse.json({ ok: false, fel: String(err?.message || err) }, { status: 500 })
  }
}
