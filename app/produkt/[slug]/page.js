import { notFound } from "next/navigation"
import { products } from "@/lib/products"
import { breadcrumbJsonLd, jsonLdProps } from "@/lib/schema"
import { buildProductJsonLd } from "@/lib/product-schema"
import { hamtaGodkandaCachat, sammanfatta } from "@/lib/omdomen"
import { hamtaKopPerProduktCachat } from "@/lib/orders"
import { CATEGORIES } from "@/lib/constants"
import TopBar from "@/components/TopBar"
import Header from "@/components/Header"
import ProductPageContent from "@/components/ProductPageContent"
import ProduktOmdomen from "@/components/ProduktOmdomen"
import { PrisforklaringKort } from "@/components/Prisforklaring"
import CtaBanner from "@/components/CtaBanner"
import Footer from "@/components/Footer"

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

/**
 * Sidan byggs om varje timme.
 *
 * Omdömena måste ligga i server-HTML för att Google och AI-botarna ska se dem,
 * så de kan inte hämtas i webbläsaren. Med ISR hämtas de på servern och
 * hamnar i råmarkeringen, utan att sidan blir dynamisk och tappar sin
 * laddningstid. Ett godkänt omdöme syns alltså inom en timme.
 */
export const revalidate = 3600

const CATEGORY_PREFIX = {
  "traktion-industri": "Traktionsbatteri",
  stadmaskiner: "Gelbatteri städmaskin",
  stationara: "UPS batteri",
  "fritid-solenergi": "Fritidsbatteri",
}

/**
 * Titeln på en produktsida.
 *
 * Varumärke och artikelnummer först, och det är hela poängen.
 *
 * Den som söker på ett artikelnummer har redan bestämt sig och letar bara
 * efter var man beställer. Det är den trafiken som faktiskt köper: ordern
 * 2026-08-04 kom från en sökning som landade rakt på produktsidan för exakt
 * det batteriet, utan att besökaren rörde vare sig startsidan eller en
 * kategorisida. Fram till dess byggdes titeln av shortName ("Dry Cell 8V
 * 160Ah"), så artikelnumret saknades helt i title-taggen på alla 20 sidorna
 * och volt och amperetimmar stod dubbelt.
 *
 * Kategoriordet ligger kvar efter modellen, så sidorna behåller sin chans på
 * de generiska sökningarna ("traktionsbatteri 12V").
 */
function buildSeoTitle(product) {
  const prefix = CATEGORY_PREFIX[product.category] || "Batteri"
  const v = product.voltage || ""
  const ah = (product.capacity || "").match(/(\d+)\s*Ah/i)?.[0] || ""
  // Medvetet INTE getProductBrand här: den faller tillbaka på "Batteriproffs",
  // och "Batteriproffs NM125 ... | Batteriproffs" vore en sämre titel än ingen.
  const brand = product.specs?.["Varumärke"] || ""
  const artNr = product.specs?.["Artikelnummer"] || ""
  const modell = [brand, artNr].filter(Boolean).join(" ") || product.shortName || product.name
  const parts = [modell, prefix, v, ah].filter(Boolean)
  return `${parts.join(" ")} | Batteriproffs`
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const product = products.find((p) => p.slug === slug)

  if (!product) {
    return { title: "Produkt hittades inte — Batteriproffs" }
  }

  // Interna testartiklar ska aldrig indexeras
  if (product.hidden) {
    return {
      title: `${product.name} — Batteriproffs`,
      robots: { index: false, follow: false },
    }
  }

  const metaDesc = product.metaDescription || product.description?.slice(0, 160)
  const seoTitle = buildSeoTitle(product)

  return {
    title: seoTitle,
    description: metaDesc,
    keywords: product.seoKeywords || "",
    alternates: { canonical: `https://www.batteriproffs.se/produkt/${slug}` },
    openGraph: {
      title: seoTitle,
      description: metaDesc,
      images: [{ url: product.images?.[0] }],
    },
  }
}

export default async function ProductRoute({ params }) {
  const { slug } = await params
  const product = products.find((p) => p.slug === slug)

  // Utan den här svarade okända slugs 200 med en "hittades inte"-vy, vilket
  // låter Google indexera hur många skräp-URL:er som helst.
  if (!product) notFound()

  // Går Stripe ned ska produktsidan fortfarande fungera. Omdömen är ett
  // tillägg, inte en förutsättning för att kunna sälja batteriet.
  let omdomen = []
  let senasteKop = null
  try {
    senasteKop = (await hamtaKopPerProduktCachat())[slug] || null
  } catch (err) {
    console.error("Kunde inte läsa senaste köp:", err)
  }
  if (!product.hidden) {
    try {
      omdomen = (await hamtaGodkandaCachat()).filter((o) => o.slug === slug)
    } catch (err) {
      console.error("Kunde inte hämta omdömen för", slug, err)
    }
  }

  return (
    <>
      {/* Ingen Product-schema på interna testartiklar — 5 kr-priset skulle
          annars kunna plockas upp av Google och Merchant Center */}
      {product && !product.hidden && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildProductJsonLd(product, sammanfatta(omdomen))).replace(/</g, "\\u003c") }}
        />
      )}
      {product && (
        <script {...jsonLdProps(breadcrumbJsonLd([
          { name: "Hem", path: "/" },
          {
            name: CATEGORIES.find((c) => c.slug === product.category)?.title || "Batterier",
            path: `/kategori/${product.category}`,
          },
          { name: product.shortName, path: `/produkt/${product.slug}` },
        ]))} />
      )}
      <TopBar />
      <Header />
      <main id="innehall">
        {/* Betygssammanfattningen visas vid priset (social proof där köpbeslutet
            tas); hela listan ligger som egen sektion direkt under köpboxen. */}
        <ProductPageContent betyg={sammanfatta(omdomen)} senasteKop={senasteKop} />
        <ProduktOmdomen omdomen={omdomen} />
        <PrisforklaringKort />
        <CtaBanner />
      </main>
      <Footer />
    </>
  )
}
