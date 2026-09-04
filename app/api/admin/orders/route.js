import { orderHealth } from "@/lib/order-health"
import Stripe from "stripe"
import { NextResponse } from "next/server"
import { kravAdmin } from "@/lib/admin-auth"
import { normaliseraOrder } from "@/lib/orders"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const runtime = "nodejs"
// Ordrarna hämtas live ur Stripe vid varje anrop. Cachas de blir listan
// inaktuell precis när den används som mest, direkt efter ett köp.
export const dynamic = "force-dynamic"

const PER_SIDA = 50

/**
 * Orderlistan för admin.
 *
 * Läser rakt ur Stripe i stället för en egen tabell. Fördelen är att det inte
 * finns någon synk som kan gå isär; nackdelen är att listan bara går att
 * bläddra framåt i, vilket är precis vad Stripes API stödjer.
 *
 * Query:
 *   ?efter=pi_xxx  hämtar sidan efter den ordern
 */
export async function GET(request) {
  const avvisad = kravAdmin(request)
  if (avvisad) return avvisad

  try {
    const { searchParams } = new URL(request.url)
    const efter = searchParams.get("efter")

    const svar = await stripe.paymentIntents.list({
      limit: PER_SIDA,
      // Sparar ett extra anrop per order. Utan expand skulle kortuppgifter och
      // faktureringsadress kräva en charges.list per rad, alltså 50 anrop.
      expand: ["data.latest_charge"],
      ...(efter ? { starting_after: efter } : {}),
    })

    // Misslyckade och avbrutna betalningsförsök är inte ordrar. De ligger kvar
    // i Stripe som requires_payment_method och skulle annars fylla listan.
    // requires_capture ÄR däremot en order: kunden har bekräftat och pengarna
    // är reserverade — det är precis de ordrarna som ska skickas (och dras)
    // härifrån, så de måste synas. Filtret dolde PCB-ordern 2026-09-01.
    // dold=1 i metadatan gömmer interna testköp ur vyn. Stripe raderar aldrig
    // betalningar, så dölja är det som finns — flaggan går att ta bort i
    // Stripe-dashboarden om en rad behöver fram igen.
    const ordrar = svar.data
      .filter(
        (pi) => pi.status === "succeeded" || pi.status === "requires_capture",
      )
      .filter((pi) => pi.metadata?.dold !== "1")
      .map((pi) => ({ ...normaliseraOrder(pi), warnings: orderHealth(pi) }))

    return NextResponse.json({
      ordrar,
      // has_more gäller den ohämtade råa listan, inte den filtrerade
      merFinns: svar.has_more,
      sistaId: svar.data.at(-1)?.id || null,
    })
  } catch (err) {
    console.error("Admin orders error:", err)
    return NextResponse.json(
      { error: "Kunde inte hämta ordrar" },
      { status: 500 },
    )
  }
}
