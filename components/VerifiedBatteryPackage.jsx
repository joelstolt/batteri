"use client"

import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import { useVat } from "@/lib/vat-context"
import { purchaseTotals, verifiedBatteryPackage } from "@/lib/product-purchase"
import { FitGuarantee } from "@/components/ProductPurchase"

const money = (value) => new Intl.NumberFormat("sv-SE").format(value)

export default function VerifiedBatteryPackage({ machine, product }) {
  const { addItem, items = [] } = useCart()
  const { displayPrice, vatLabel } = useVat()
  const pack = verifiedBatteryPackage(machine, product)
  if (!pack) return null
  const quote = purchaseTotals(product, pack.quantity)
  const unavailable = product.inStock === false
  const inCart = items.find((item) => item.slug === product.slug)?.qty || 0
  const exceedsLimit = inCart + quote.quantity > 99

  return (
    <section className="my-6 rounded-2xl border border-navy/20 bg-surface p-5" aria-label="Batteripaket till Tennant T3 och T3+">
      <p className="text-xs font-bold uppercase tracking-wide text-text-mid">Dokumenterat batteripaket</p>
      <h2 className="mt-1 font-heading text-lg font-bold text-navy">2 batterier till Tennant T3 / T3+</h2>
      <p className="mt-2 text-sm leading-relaxed text-text-dark">
        Endast gelutförandet 12V/76Ah från serienummer 20000.
        Tennants manual anger två GF12076V (originalreferens 994200).
      </p>
      <p className="mt-2 text-sm leading-relaxed text-text-mid">
        Kontrollera serienummer, befintliga kablar, infästning och laddarprogram
        före köp. Kablar, infästning och laddare ingår inte. Andra batterivarianter
        i T3/T3+ omfattas inte.
      </p>
      <p className="mt-3 text-sm font-semibold text-navy">
        2 st <Link href={`/produkt/${product.slug}`} className="underline">Sonnenschein GF1276V</Link> à {money(displayPrice(product.price))} kr/st
        {" + "}{quote.shipping === 0 ? "fri frakt" : `${money(displayPrice(quote.shipping))} kr frakt`}
        {" "}({vatLabel.toLowerCase()})
      </p>
      <p className="mt-2 font-heading text-xl font-bold text-navy">
        {money(displayPrice(quote.total))} kr <span className="text-sm font-normal">{vatLabel.toLowerCase()}, med frakt</span>
      </p>
      {exceedsLimit && <p role="status" className="mt-3 text-sm font-semibold text-amber-text">Du har redan {inCart} st i varukorgen. Högst 99 st av samma batteri kan beställas per order.</p>}
      <button type="button" disabled={unavailable || exceedsLimit} onClick={() => { if (!unavailable && !exceedsLimit) addItem(product, pack.quantity) }} className="mt-4 min-h-12 w-full rounded-xl bg-amber-bg px-3 py-3 font-heading text-sm font-bold text-navy hover:bg-amber-bg/85 disabled:cursor-not-allowed disabled:opacity-50">
        {unavailable ? "Paketet är ej beställningsbart" : "Lägg 2 batterier i varukorgen"}
      </button>
      <div className="mt-3"><FitGuarantee /></div>
      <p className="mt-3 text-xs text-text-mid">
        <a href={pack.source} target="_blank" rel="noopener noreferrer" className="underline">Tennant manual 9007692, PDF-sida 85</a>.
        {" "}Kontrollerad {pack.checkedAt}.
      </p>
    </section>
  )
}
