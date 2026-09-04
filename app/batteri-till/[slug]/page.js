import { notFound } from "next/navigation"
import { machines, machineBySlug } from "@/lib/machines"
import { publicProducts, getProductImage } from "@/lib/products"
import { SITE_URL } from "@/lib/constants"
import { breadcrumbJsonLd, faqJsonLd, jsonLdProps } from "@/lib/schema"
import TopBar from "@/components/TopBar"
import Header from "@/components/Header"
import MachinePageContent from "@/components/MachinePageContent"
import CtaBanner from "@/components/CtaBanner"
import Footer from "@/components/Footer"

export async function generateStaticParams() {
  return machines.map((m) => ({ slug: m.slug }))
}

/** Batterierna som är kopplade till maskinen, i den ordning registret anger. */
function productsFor(machine) {
  return machine.products
    .map((slug) => publicProducts.find((p) => p.slug === slug))
    .filter(Boolean)
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const machine = machineBySlug(slug)
  if (!machine) return { title: "Sidan hittades inte — Batteriproffs" }

  const products = productsFor(machine)
  const priceFrom = products.length ? Math.min(...products.map((p) => p.price)) : null

  // Genererad titel som standard. Sidor med uppmätt egen efterfrågan sätter
  // title/description i registret i stället, eftersom mallens variant blir för
  // lång och upprepar maskinnamnet. Se lib/machines.js.
  const title =
    machine.title || `Batteri till ${machine.name} — ${machine.type} | Batteriproffs`
  const description =
    machine.description ||
    (priceFrom
      ? `Batterival för ${machine.name}. ${products.length} alternativ att kontrollera från ${priceFrom} kr inkl. moms. Snabb leverans i hela Sverige och hjälp att välja rätt.`
      : `Hjälp med batterival för ${machine.name}. Snabb leverans i hela Sverige och hjälp att välja rätt.`)

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/batteri-till/${slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/batteri-till/${slug}`,
      siteName: "Batteriproffs",
      locale: "sv_SE",
      type: "website",
      images: products[0] ? [{ url: `${SITE_URL}${getProductImage(products[0])}` }] : undefined,
    },
  }
}

/**
 * ItemList-schema med de batterier som passar. Ger Google en maskinläsbar
 * koppling mellan maskinmodellen och produkterna, vilket är hela poängen
 * med sidan.
 */
function buildJsonLd(machine, products) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Batteri till ${machine.name}`,
    description: machine.intro,
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
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

export default async function MachineRoute({ params }) {
  const { slug } = await params
  const machine = machineBySlug(slug)
  if (!machine) notFound()

  const products = productsFor(machine)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(machine, products)) }}
      />
      {machine.faq?.length ? <script {...jsonLdProps(faqJsonLd(machine.faq))} /> : null}
      <script {...jsonLdProps(breadcrumbJsonLd([
        { name: "Hem", path: "/" },
        { name: "Batteri till maskin", path: "/batteri-till" },
        { name: machine.name, path: `/batteri-till/${machine.slug}` },
      ]))} />
      <TopBar />
      <Header />
      <main id="innehall">        <MachinePageContent machine={machine} products={products} />
        <CtaBanner />
      </main>
      <Footer />
    </>
  )
}
