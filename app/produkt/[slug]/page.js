import { products, getProductImage, getProductBrand } from "@/lib/products"
import TopBar from "@/components/TopBar"
import Header from "@/components/Header"
import ProductPageContent from "@/components/ProductPageContent"
import CtaBanner from "@/components/CtaBanner"
import Footer from "@/components/Footer"

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

const CATEGORY_PREFIX = {
  "traktion-industri": "Traktionsbatteri",
  stadmaskiner: "Gelbatteri städmaskin",
  stationara: "UPS batteri",
  "fritid-solenergi": "Fritidsbatteri",
}

function buildSeoTitle(product) {
  const prefix = CATEGORY_PREFIX[product.category] || "Batteri"
  const v = product.voltage || ""
  const ah = (product.capacity || "").match(/(\d+)\s*Ah/i)?.[0] || ""
  const model = product.shortName || product.name
  const parts = [prefix, v, ah, model].filter(Boolean)
  return `${parts.join(" ")} — Batteriproffs`
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const product = products.find((p) => p.slug === slug)

  if (!product) {
    return { title: "Produkt hittades inte — Batteriproffs" }
  }

  const metaDesc = product.metaDescription || product.description?.slice(0, 160)
  const seoTitle = buildSeoTitle(product)

  return {
    title: seoTitle,
    description: metaDesc,
    keywords: product.seoKeywords || "",
    openGraph: {
      title: seoTitle,
      description: metaDesc,
      images: [{ url: product.images?.[0] }],
    },
  }
}

const SITE = "https://www.batteriproffs.se"

function buildProductJsonLd(product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: `${SITE}${getProductImage(product)}`,
    description: (product.description || product.metaDescription || "").replace(/\n+/g, " "),
    sku: product.slug,
    mpn: product.specs?.["Artikelnummer"] || product.slug.toUpperCase(),
    brand: {
      "@type": "Brand",
      name: getProductBrand(product),
    },
    offers: {
      "@type": "Offer",
      url: `${SITE}/produkt/${product.slug}`,
      priceCurrency: "SEK",
      price: product.price,
      itemCondition: "https://schema.org/NewCondition",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: 695,
          currency: "SEK",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "SE",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 2, unitCode: "DAY" },
          transitTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 5, unitCode: "DAY" },
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "SE",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 30,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/ReturnFeesCustomerResponsibility",
      },
    },
  }
}

export default async function ProductRoute({ params }) {
  const { slug } = await params
  const product = products.find((p) => p.slug === slug)

  return (
    <>
      {product && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildProductJsonLd(product)) }}
        />
      )}
      <TopBar />
      <Header />
      <ProductPageContent />
      <CtaBanner />
      <Footer />
    </>
  )
}
