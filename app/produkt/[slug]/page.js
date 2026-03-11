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

  return {
    title: `${product.name} — Köp hos Batteriproffs`,
    description: product.description,
    openGraph: {
      title: `${product.name} — Batteriproffs`,
      description: product.description,
      images: [{ url: product.image }],
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
