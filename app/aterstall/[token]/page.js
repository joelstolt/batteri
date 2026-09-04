import { notFound } from "next/navigation"
import Stripe from "stripe"
import { lasAterstallToken } from "@/lib/konto-auth"
import { readOrderItems } from "@/lib/orders"
import { publicProducts } from "@/lib/products"
import AterstallContent from "@/components/AterstallContent"

/**
 * Länken i påminnelsemejlet.
 *
 * Varukorgen bor i localStorage, så ett mejl som bara pekar på /kassa möter
 * kunden med en tom korg och kravet att bygga om den. Den här sidan läser
 * raderna ur den övergivna betalningen, lägger tillbaka dem och skickar
 * kunden vidare till kassan.
 *
 * Sluggen valideras mot publicProducts: priser och namn tas ALDRIG ur
 * metadatan, bara ur produktdatan. Annars skulle en gammal kassa kunna
 * återuppstå med ett pris som inte gäller längre.
 */

export const metadata = {
  title: "Din varukorg",
  description: "Vi lägger tillbaka din varukorg.",
  robots: { index: false, follow: false },
}

export const dynamic = "force-dynamic"

export default async function AterstallPage({ params }) {
  const { token } = await params
  const piId = lasAterstallToken(token)
  if (!piId) notFound()

  let rader = []
  let redanBetald = false
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      maxNetworkRetries: 3,
    })
    const pi = await stripe.paymentIntents.retrieve(piId)

    // Redan betald: skicka ingen tillbaka till kassan med en dubblett.
    if (pi.status === "succeeded" || pi.status === "requires_capture") {
      redanBetald = true
    }

    const parsed = readOrderItems(pi.metadata)
    rader = (parsed.incomplete ? [] : parsed.rader)
      .map((r) => {
        const produkt = publicProducts.find((p) => p.slug === r.slug)
        if (!produkt) return null
        return {
          slug: produkt.slug,
          name: produkt.name,
          price: produkt.price,
          qty: Math.max(1, Math.min(99, Number(r.qty) || 1)),
          images: produkt.images,
        }
      })
      .filter(Boolean)
  } catch (err) {
    console.error("Kunde inte läsa den övergivna kassan:", err)
  }

  return (
    <AterstallContent
      items={redanBetald ? [] : rader}
      redanBetald={redanBetald}
    />
  )
}
