import { CATEGORIES } from "@/lib/constants"
import TopBar from "@/components/TopBar"
import Header from "@/components/Header"
import CategoryPageContent from "@/components/CategoryPageContent"
import CtaBanner from "@/components/CtaBanner"
import Footer from "@/components/Footer"

export async function generateStaticParams() {
  return CATEGORIES.map((cat) => ({ slug: cat.slug }))
}

const CATEGORY_SEO = {
  "traktion-industri": {
    title: "Truckbatteri & Traktionsbatteri 6V/12V — Batteriproffs",
    description:
      "Köp truckbatteri och traktionsbatteri 6V/12V från 120–420 Ah. Nordmax, Discover Dry Cell. Snabb leverans i hela Sverige.",
    ogTitle: "Truckbatteri & Traktionsbatteri — Batteriproffs",
    ogDescription:
      "Truckbatteri 24V/48V och traktionsbatteri 6V/12V från Nordmax och Discover. 30 dagars öppet köp.",
  },
  stadmaskiner: {
    title: "Gelbatteri städmaskin & skurmaskin 12V — Batteriproffs",
    description:
      "Gelbatterier för städmaskiner, skurmaskiner och poleringsmaskiner. Sonnenschein GF 6V/12V. Underhållsfria, snabb leverans.",
    ogTitle: "Gelbatteri städmaskin & skurmaskin — Batteriproffs",
    ogDescription:
      "Sonnenschein GF gelbatteri 6V/12V för städmaskiner och skurmaskiner. Underhållsfria med snabb leverans.",
  },
  stationara: {
    title: "UPS batteri & backup batteri — Batteriproffs",
    description:
      "Stationära batterier för UPS, batteribackup och reservkraft. Driftsäker reservström för permobiler, hissar, larm och sprinklersystem.",
    ogTitle: "UPS batteri & batteribackup — Batteriproffs",
    ogDescription:
      "UPS batteri, backup batteri och stationära batterier. Driftsäker reservkraft för larm, hissar och sprinklersystem.",
  },
  "fritid-solenergi": {
    title: "Fritidsbatteri & Husvagnsbatteri 12V — Batteriproffs",
    description:
      "Fritidsbatteri 12V för husvagn, husbil och båt. AGM och gel från 100Ah. Snabb leverans, 30 dagars öppet köp.",
    ogTitle: "Fritidsbatteri & Husvagnsbatteri 12V — Batteriproffs",
    ogDescription:
      "Fritidsbatteri 12V 100Ah och uppåt för husvagn, husbil och båt. AGM och gel — snabb leverans.",
  },
  alla: {
    title: "Alla batterier — Fritidsbatteri, traktionsbatteri & gelbatteri",
    description:
      "Hela vårt sortiment av fritidsbatteri, traktionsbatteri, truckbatteri och gelbatteri för städmaskiner. Snabb leverans i hela Sverige.",
    ogTitle: "Alla batterier — Batteriproffs",
    ogDescription:
      "Fritidsbatteri, traktionsbatteri, truckbatteri och gelbatteri. Snabb leverans i hela Sverige.",
  },
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const category = CATEGORIES.find((c) => c.slug === slug)

  if (!category) {
    return { title: "Kategori hittades inte — Batteriproffs" }
  }

  const seo = CATEGORY_SEO[slug] || {
    title: `${category.title} — Batteriproffs`,
    description: `${category.desc}. Snabb leverans i hela Sverige.`,
    ogTitle: `${category.title} — Batteriproffs`,
    ogDescription: `${category.desc}. Snabb leverans i hela Sverige.`,
  }

  return {
    title: seo.title,
    description: seo.description,
    openGraph: {
      title: seo.ogTitle,
      description: seo.ogDescription,
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
