import Stripe from "stripe"
import Link from "next/link"
import TopBar from "@/components/TopBar"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import OmdomeDirektContent from "@/components/OmdomeDirektContent"
import { lasOmdomeToken } from "@/lib/konto-auth"
import { normaliseraOrder } from "@/lib/orders"
import { omdomenUrPI } from "@/lib/omdomen"
import ChattKnapp from "@/components/ChattKnapp"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const metadata = {
  title: "Lämna ett omdöme — Batteriproffs",
  description: "Betygsätt din order hos Batteriproffs.",
  robots: { index: false, follow: false },
}

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/**
 * Direktlänken ur omdömesmejlet. Token i ?t= pekar ut EN order och släpper
 * bara fram omdömesformuläret för artiklarna på den — ingen inloggning, ingen
 * orderhistorik. Kundkontots väg via /konto finns kvar för den som hellre
 * loggar in.
 */
export default async function OmdomePage({ searchParams }) {
  const { t } = await searchParams
  const piId = lasOmdomeToken(t)

  let order = null
  let redanLamnade = []
  if (piId) {
    try {
      const pi = await stripe.paymentIntents.retrieve(piId, {
        expand: ["latest_charge"],
      })
      // Bara genomförda köp kan betygsättas — samma regel som i kontot.
      if (pi.status === "succeeded") {
        order = normaliseraOrder(pi)
        redanLamnade = omdomenUrPI(pi).map((o) => o.slug)
      }
    } catch {
      // Ogiltigt pi-id behandlas som utgången länk nedan.
    }
  }

  return (
    <>
      <TopBar />
      <Header />
      <main id="innehall">
        {order ? (
          <OmdomeDirektContent
            token={t}
            orderId={order.orderId}
            buyerName={order.customer.name}
            items={order.items}
            redanLamnade={redanLamnade}
          />
        ) : (
          <section className="mx-auto max-w-xl px-5 py-20 text-center">
            <h1 className="font-heading text-2xl font-bold text-navy">
              Länken har gått ut
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-text-mid">
              Omdömeslänkar är giltiga i 90 dagar. Du kan fortfarande lämna ett
              omdöme via{" "}
              <Link href="/konto" className="font-semibold text-navy underline">
                ditt konto
              </Link>{" "}
              eller{" "}
              <ChattKnapp className="font-semibold text-navy hover:underline">
                chatta med oss
              </ChattKnapp>{" "}
              så hjälper vi dig.
            </p>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}
