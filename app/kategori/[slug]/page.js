import { CATEGORIES } from "@/lib/constants"
import TopBar from "@/components/TopBar"
import Header from "@/components/Header"
import CategoryPageContent from "@/components/CategoryPageContent"
import CtaBanner from "@/components/CtaBanner"
import Footer from "@/components/Footer"

export async function generateStaticParams() {
  return CATEGORIES.map((cat) => ({ slug: cat.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const category = CATEGORIES.find((c) => c.slug === slug)

  if (!category) {
    return { title: "Kategori hittades inte — Batteriproffs" }
  }

  return {
    title: `${category.title} — Batterier | Batteriproffs`,
    description: `Köp ${category.title.toLowerCase()}-batterier hos Batteriproffs. ${category.desc}. Sonnenschein gel-batterier — fri frakt över 2 000 kr.`,
    openGraph: {
      title: `${category.title} — Batteriproffs`,
      description: `${category.desc}. Underhållsfria Sonnenschein gel-batterier.`,
    },
  }
}

export default function CategoryRoute() {
  return (
    <>
      <TopBar />
      <Header />
      <CategoryPageContent />
      <CtaBanner />
      <Footer />
    </>
  )
}
