import { NextResponse } from "next/server"
import { hittaOvergivna, skickaPaminnelse } from "@/lib/kassa-paminnelse"

/**
 * Kör var kvart via Vercel cron (vercel.json) och skickar de påminnelser som
 * är mogna. Kvartsupplösning räcker: mejl 1 går efter en timme, och några
 * minuter hit eller dit spelar ingen roll för kunden.
 *
 * `?torrkor=1` visar vad som SKULLE skickas utan att skicka något. Använd det
 * före varje ändring i urvalet, ett felaktigt utskick går inte att ta tillbaka.
 */

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 60

export async function GET(req) {
  const secret = process.env.CRON_SECRET
  const auth = req.headers.get("authorization") || ""
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const torrkor = new URL(req.url).searchParams.get("torrkor") === "1"

  try {
    const kandidater = await hittaOvergivna()

    if (torrkor) {
      return NextResponse.json({
        ok: true,
        torrkor: true,
        antal: kandidater.length,
        kandidater: kandidater.map((k) => ({
          order: k.pi.id,
          steg: k.steg,
          epost: k.epost,
          belopp: k.pi.amount / 100,
          fangad: new Date(k.fangad * 1000).toISOString(),
        })),
      })
    }

    const resultat = []
    for (const k of kandidater) {
      try {
        resultat.push(await skickaPaminnelse(k))
      } catch (err) {
        console.error("Påminnelse misslyckades:", k.pi.id, err)
        resultat.push({ ok: false, epost: k.epost, steg: k.steg, fel: String(err?.message || err) })
      }
    }

    return NextResponse.json({
      ok: true,
      skickade: resultat.filter((r) => r.ok).length,
      misslyckade: resultat.filter((r) => !r.ok).length,
      resultat,
    })
  } catch (err) {
    console.error("Kassepåminnelse-jobbet kraschade:", err)
    return NextResponse.json({ ok: false, fel: String(err?.message || err) }, { status: 500 })
  }
}
