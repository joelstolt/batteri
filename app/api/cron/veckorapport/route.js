import { NextResponse } from "next/server"
import { byggVeckorapport, renderaVeckorapport } from "@/lib/veckorapport"
import { resend, FROM, ADMIN_EMAIL } from "@/lib/emails"

/**
 * Veckorapporten. Vercel cron anropar den här med
 * `Authorization: Bearer <CRON_SECRET>` enligt schemat i vercel.json.
 * Samma header fungerar för ett manuellt anrop, t.ex. för att testa eller
 * dra en rapport över en annan period: ?dagar=30.
 */

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 60

function svar(body, status = 200) {
  return NextResponse.json(body, { status })
}

export async function GET(req) {
  const secret = process.env.CRON_SECRET
  const auth = req.headers.get("authorization") || ""
  if (!secret || auth !== `Bearer ${secret}`) return svar({ error: "unauthorized" }, 401)
  if (!ADMIN_EMAIL) return svar({ error: "CONTACT_TO_EMAIL saknas" }, 500)

  const dagar = Math.min(90, Math.max(1, Number(new URL(req.url).searchParams.get("dagar")) || 7))
  const rapport = await byggVeckorapport({ dagar })
  const { subject, html } = renderaVeckorapport(rapport)

  const r = await resend.emails.send({ from: FROM, to: ADMIN_EMAIL, subject, html })
  if (r?.error) return svar({ ok: false, subject, fel: r.error }, 502)

  return svar({
    ok: true,
    id: r?.data?.id || null,
    subject,
    fel: {
      ordrar: rapport.ordrar.fel,
      trafik: rapport.trafik.fel,
      lankar: rapport.lankar.fel,
    },
  })
}
