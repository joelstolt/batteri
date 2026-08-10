import { notFound } from "next/navigation"
import { anvandningBySlug, produkterFor, prisFran } from "@/lib/anvandning"
import { getProductImage } from "@/lib/products"
import { SITE_URL } from "@/lib/constants"
import { breadcrumbJsonLd, jsonLdProps } from "@/lib/schema"
import TopBar from "@/components/TopBar"
import Header from "@/components/Header"
import AnvandningPageContent from "@/components/AnvandningPageContent"
import CtaBanner from "@/components/CtaBanner"
import Footer from "@/components/Footer"

/**
 * Delad route för användningssidorna i lib/anvandning.js.
 *
 * Varje sida har en egen mapp under app/ i stället för en dynamisk [slug] i
 * roten. En rot-dynamisk segment hade fångat varenda okänd sökväg på sajten och
 * gjort 404-hanteringen beroende av generateStaticParams, vilket inte är värt
 * det för fem sidor.
 */
export function anvandningMetadata(slug) {
  const sida = anvandningBySlug(slug)
  if (!sida) return { title: "Sidan hittades inte | Batteriproffs" }

  const fran = prisFran(sida)
  const description = fran
    ? `${sida.seo.description} Från ${new Intl.NumberFormat("sv-SE").format(fran)} kr inkl. moms.`
    : sida.seo.description

  return {
    title: sida.seo.title,
    description,
    alternates: { canonical: `${SITE_URL}/${slug}` },
    openGraph: {
      title: sida.seo.title,
      description,
      url: `${SITE_URL}/${slug}`,
      siteName: "Batteriproffs",
      locale: "sv_SE",
      type: "website",
    },
  }
}

function itemListJsonLd(sida, produkter) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: sida.h1,
    description: sida.intro,
    numberOfItems: produkter.length,
    itemListElement: produkter.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: p.name,
        url: `${SITE_URL}/produkt/${p.slug}`,
        image: `${SITE_URL}${getProductImage(p)}`,
        sku: p.slug,
        offers: {
          "@type": "Offer",
          priceCurrency: "SEK",
          price: p.price,
          availability: p.inStock
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        },
      },
    })),
  }
}

export default function AnvandningRoute({ slug }) {
  const sida = anvandningBySlug(slug)
  if (!sida) notFound()

  const produkter = produkterFor(sida)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd(sida, produkter)) }}
      />
      <script {...jsonLdProps(breadcrumbJsonLd([
        { name: "Hem", path: "/" },
        { name: sida.h1, path: `/${sida.slug}` },
      ]))} />
      <TopBar />
      <Header />
      <main id="innehall">
        <AnvandningPageContent sida={sida} produkter={produkter} />
        <CtaBanner />
      </main>
      <Footer />
    </>
  )
}
