import { NextResponse } from "next/server"
import { kravAdmin } from "@/lib/admin-auth"
import { hamtaFakturor, skapaFaktura, markeraBetald, makulera } from "@/lib/fakturor"
import { skickaFakturaMejl } from "@/lib/faktura-email"
import { giltigEpost } from "@/lib/konto-auth"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request) {
  const avvisad = kravAdmin(request)
  if (avvisad) return avvisad

  try {
    return NextResponse.json({ fakturor: await hamtaFakturor() })
  } catch (err) {
    console.error("Kunde inte hämta fakturor:", err)
    return NextResponse.json({ error: "Kunde inte hämta fakturor" }, { status: 500 })
  }
}

/** Skapar fakturan och mejlar underlaget. */
export async function POST(request) {
  const avvisad = kravAdmin(request)
  if (avvisad) return avvisad

  const body = await request.json().catch(() => null)
  const { epost, foretag, orgnr, referens, rader, meddelande } = body || {}

  if (!giltigEpost(epost)) {
    return NextResponse.json({ error: "Ogiltig mejladress" }, { status: 400 })
  }
  if (!foretag || !String(foretag).trim()) {
    return NextResponse.json({ error: "Ange företagsnamn" }, { status: 400 })
  }
  if (!Array.isArray(rader) || rader.length === 0) {
    return NextResponse.json({ error: "Lägg till minst en artikel" }, { status: 400 })
  }

  let skapad
  try {
    skapad = await skapaFaktura({
      epost: String(epost).trim().toLowerCase(),
      foretag: String(foretag).trim(),
      orgnr,
      referens,
      rader,
      meddelande,
    })
  } catch (err) {
    console.error("Kunde inte skapa faktura:", err)
    return NextResponse.json({ error: err.message || "Kunde inte skapa faktura" }, { status: 400 })
  }

  // Fakturan finns nu i Stripe med ett nummer. Går mejlet fel ska det INTE
  // rullas tillbaka — fakturan är giltig och går att mejla om från listan.
  try {
    await skickaFakturaMejl({
      faktura: skapad.faktura,
      berakning: skapad.berakning,
      epost,
      foretag,
      referens,
    })
  } catch (err) {
    console.error("Fakturan skapad men mejlet gick inte iväg:", err)
    return NextResponse.json({
      ok: true,
      nummer: skapad.faktura.number,
      varning:
        "Fakturan är skapad men mejlet gick inte iväg. Skicka om från listan.",
    })
  }

  return NextResponse.json({
    ok: true,
    nummer: skapad.faktura.number,
    total: skapad.berakning.totalInkl,
  })
}

/** Markerar betald eller makulerar. */
export async function PATCH(request) {
  const avvisad = kravAdmin(request)
  if (avvisad) return avvisad

  const body = await request.json().catch(() => null)
  const { fakturaId, atgard } = body || {}

  if (!fakturaId || !["betald", "makulera"].includes(atgard)) {
    return NextResponse.json({ error: "Ofullständigt anrop" }, { status: 400 })
  }

  try {
    if (atgard === "betald") await markeraBetald(fakturaId)
    else await makulera(fakturaId)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Fakturaåtgärd misslyckades:", err)
    return NextResponse.json({ error: err.message || "Kunde inte uppdatera" }, { status: 500 })
  }
}
