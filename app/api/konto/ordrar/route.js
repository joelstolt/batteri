import Stripe from "stripe"
import { NextResponse } from "next/server"
import { inloggadEpost } from "@/lib/konto-auth"
import { normaliseraOrder, orderEpost } from "@/lib/orders"
import { omdomenUrPI } from "@/lib/omdomen"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/**
 * Kundens egna ordrar.
 *
 * Söker i Stripe på metadatafältet buyer_email, som /api/order-details skriver
 * dit direkt efter betalningen. Stripes sökindex ligger någon minut efter, så
 * en helt färsk order kan saknas en kort stund. Det är den enda kostnaden för
 * att slippa en egen databas som kan gå ur synk med betalningarna.
 */
export async function GET(request) {
  const epost = inloggadEpost(request)
  if (!epost) {
    return NextResponse.json({ error: "Inte inloggad" }, { status: 401 })
  }

  try {
    // Adressen är redan validerad av giltigEpost innan den signerades, så den
    // kan inte innehålla citattecken. Apostrofer strippas ändå — frågan är en
    // sträng och en oväntad apostrof skulle bryta ut ur den.
    const sokvarde = epost.replace(/'/g, "")
    const svar = await stripe.paymentIntents.search({
      query: `metadata['buyer_email']:'${sokvarde}'`,
      limit: 100,
      expand: ["data.latest_charge"],
    })

    // Sista spärren: släpp bara igenom det som faktiskt tillhör den inloggade.
    // Skulle sökningen någonsin matcha bredare än tänkt vill vi inte att någon
    // annans leveransadress dyker upp här.
    const ordrar = svar.data
      .filter(
        (pi) => pi.status === "succeeded" || pi.status === "requires_capture",
      )
      .map((pi) => ({
        ...normaliseraOrder(pi),
        // Attributionen är vår affärsdata, inte kundens orderuppgift. Den ska
        // inte ligga i ett svar som går ut till webbläsaren hos kunden.
        source: undefined,
        // Vilka artiklar kunden redan recenserat, så formuläret bara visas där
        // det går att lämna ett omdöme. Statusen följer med så kunden ser att
        // omdömet ligger på granskning i stället för att undra vart det tog vägen.
        omdomen: omdomenUrPI(pi).map((o) => ({
          slug: o.slug,
          status: o.status,
        })),
      }))
      .filter((o) => orderEpost(o) === epost)
      .sort((a, b) => b.created - a.created)

    return NextResponse.json(
      { epost, ordrar },
      { headers: { "Cache-Control": "private, no-store" } },
    )
  } catch (err) {
    console.error("Konto orders error:", err)
    return NextResponse.json(
      { error: "Kunde inte hämta ordrar" },
      { status: 500 },
    )
  }
}
