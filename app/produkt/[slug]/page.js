import { products } from "@/lib/products"
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

export default function ProductRoute() {
  return (
    <>
      <TopBar />
      <Header />
      <ProductPageContent />
      <CtaBanner />
      <Footer />
    </>
  )
}
