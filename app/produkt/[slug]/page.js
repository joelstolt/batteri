import { products } from "@/lib/products"
import TopBar from "@/components/TopBar"
import Header from "@/components/Header"
import ProductPageContent from "@/components/ProductPageContent"
import CtaBanner from "@/components/CtaBanner"
import Footer from "@/components/Footer"

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const product = products.find((p) => p.slug === slug)

  if (!product) {
    return { title: "Produkt hittades inte — Batteriproffs" }
  }

  const metaDesc = product.metaDescription || product.description?.slice(0, 160)

  return {
    title: `${product.name} — Köp hos Batteriproffs`,
    description: metaDesc,
    keywords: product.seoKeywords || "",
    openGraph: {
      title: `${product.name} — Batteriproffs`,
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
