import { NextResponse } from "next/server"
import { kravAdmin } from "@/lib/admin-auth"
import { hamtaAllaOmdomen, moderera, GODKANT, NEKAT, VANTAR } from "@/lib/omdomen"
import { publicProducts } from "@/lib/products"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function produktnamn(slug) {
  return publicProducts.find((p) => p.slug === slug)?.shortName || slug
}

/** Alla omdömen, oberett först — det är de som kräver en åtgärd. */
export async function GET(request) {
  const avvisad = kravAdmin(request)
  if (avvisad) return avvisad

  try {
    const alla = await hamtaAllaOmdomen()
    const ordning = { [VANTAR]: 0, [GODKANT]: 1, [NEKAT]: 2 }

    const omdomen = alla
      .map((o) => ({ ...o, produkt: produktnamn(o.slug) }))
      .sort((a, b) => (ordning[a.status] ?? 9) - (ordning[b.status] ?? 9) || b.datum - a.datum)

    return NextResponse.json({
      omdomen,
      antalVantande: omdomen.filter((o) => o.status === VANTAR).length,
    })
  } catch (err) {
    console.error("Admin omdömen error:", err)
    return NextResponse.json({ error: "Kunde inte hämta omdömen" }, { status: 500 })
  }
}

/** Godkänner eller nekar ett omdöme. */
export async function POST(request) {
  const avvisad = kravAdmin(request)
  if (avvisad) return avvisad

  const body = await request.json().catch(() => null)
  const { paymentIntentId, slug, status } = body || {}

  if (!paymentIntentId || !slug || ![GODKANT, NEKAT, VANTAR].includes(status)) {
    return NextResponse.json({ error: "Ofullständigt anrop" }, { status: 400 })
  }

  try {
    await moderera(paymentIntentId, slug, status)
    return NextResponse.json({ ok: true, status })
  } catch (err) {
    console.error("Moderering misslyckades:", err)
    return NextResponse.json({ error: err.message || "Kunde inte uppdatera" }, { status: 500 })
  }
}
