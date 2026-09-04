"use client"
import { useCompare } from "@/lib/compare-context"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { comparisonProducts, productAttributes } from "@/lib/product-selection"
import { teknikFor } from "@/lib/teknik"
import { useVat } from "@/lib/vat-context"
import { useCart } from "@/lib/cart-context"
export default function ComparisonContent() {
  const params = useSearchParams()
  const compare = useCompare()
  const products = comparisonProducts(params.get("produkter"))
  const { displayPrice, vatLabel } = useVat()
  const { addItem } = useCart()
  const rows = [
    ["Artikelnummer", (p) => p.specs?.Artikelnummer || p.slug.toUpperCase()],
    ["Spänning per batteri", (p) => p.voltage],
    ["Batterityp", (p) => productAttributes(p).chemistry],
    ...["C5", "C20"].map((b) => [
      `Kapacitet ${b}`,
      (p) =>
        productAttributes(p).capacity[b]
          ? `${productAttributes(p).capacity[b]} Ah`
          : null,
    ]),
    [
      "Längd × bredd × höjd",
      (p) =>
        p.totalHeightUnverified
          ? `${p.specs.Mått}. Totalhöjd med poler behöver bekräftas.`
          : p.specs?.Mått,
    ],
    [
      "Pol / anslutning",
      (p) =>
        p.specs?.Poltyp ||
        p.specs?.Pol ||
        teknikFor(p)?.rader.find((r) => r.label === "Pol")?.value,
    ],
    [
      "Vikt",
      (p) =>
        p.specs?.Vikt ||
        teknikFor(p)?.rader.find((r) => r.label === "Vikt")?.value,
    ],
    [
      "Beställningsstatus",
      (p) =>
        p.inStock === false
          ? "Ej beställningsbar"
          : "Beställningsbar från leverantör",
    ],
    [
      `Pris ${vatLabel.toLowerCase()}`,
      (p) => `${displayPrice(p.price).toLocaleString("sv-SE")} kr`,
    ],
  ]
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6">
      <h1 className="font-heading text-3xl font-bold text-navy">
        Jämför batterier
      </h1>
      <p className="my-4 max-w-2xl text-sm text-text-mid">
        Välj två eller tre batterier i sortimentet. C5 och C20 är olika
        mätgrunder och visas separat. Kontrollera också polplacering, laddare
        och maskinens krav före köp. Lika mått betyder inte automatiskt att
        batterierna kan ersätta varandra.
      </p>
      <Link href="/kategori/alla" className="text-sm font-semibold underline">
        Välj fler produkter
      </Link>
      {products.length ? (
        <div
          className="mt-6 overflow-x-auto rounded-xl border border-border"
          role="region"
          aria-label="Jämförelsetabell"
          tabIndex={0}
        >
          <table className="w-full min-w-[600px] text-left text-sm">
            <caption className="sr-only">
              Tekniska uppgifter och priser för valda batterier
            </caption>
            <thead className="bg-surface">
              <tr>
                <th scope="col" className="p-4">
                  Egenskap
                </th>
                {products.map((p) => (
                  <th scope="col" className="p-4" key={p.slug}>
                    <Link className="underline" href={`/produkt/${p.slug}`}>
                      {p.shortName}
                    </Link>
                    <Link
                      onClick={() => {
                        if (compare?.slugs.includes(p.slug))
                          compare.toggle(p.slug)
                      }}
                      className="mt-2 block text-xs font-normal underline"
                      href={`/jamfor?produkter=${products
                        .filter((x) => x.slug !== p.slug)
                        .map((x) => x.slug)
                        .join(",")}`}
                    >
                      Ta bort {p.specs?.Artikelnummer}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, value]) => (
                <tr className="border-t border-border" key={label}>
                  <th scope="row" className="p-4 font-medium">
                    {label}
                  </th>
                  {products.map((p) => (
                    <td className="p-4" key={p.slug}>
                      {value(p) || "Uppgift saknas"}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="border-t border-border">
                <th scope="row" className="p-4">
                  Beställ
                </th>
                {products.map((p) => (
                  <td className="p-4" key={p.slug}>
                    <button
                      disabled={p.inStock === false}
                      onClick={() => addItem(p, 1)}
                      className="rounded-lg bg-navy px-4 py-2 font-semibold text-white disabled:opacity-50"
                    >
                      Lägg i varukorg
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <p className="my-10">
          Inga produkter valda. Använd Jämför på produktkorten.
        </p>
      )}
      <p className="mt-4 text-xs text-text-mid">
        Frakt tillkommer per order. Beställningsstatus bygger på sortimentets
        registrerade uppgifter, inte ett lagersaldo i realtid.
      </p>
    </section>
  )
}
