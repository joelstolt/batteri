import { Suspense } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { CATEGORIES } from "@/lib/constants"
import { anvandningBySlug } from "@/lib/anvandning"
import { breadcrumbJsonLd, jsonLdProps } from "@/lib/schema"
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
      "Truckbatteri 24V/48V och traktionsbatteri 6V/12V från Nordmax och Discover. Passformsgaranti.",
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
      "Fritidsbatteri 12V för husvagn, husbil och båt. AGM och gel från 100Ah. Snabb leverans och passformsgaranti.",
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

/**
 * Kategorisidorna är de som har mest auktoritet på sajten, och fritid-solenergi
 * rankar redan på husvagnsbatteri utan att vi gjort något åt det (position 15,
 * uppmätt 2026-08-10). Länkarna härifrån är alltså det starkaste vi kan ge de
 * nya användningssidorna, och de ska peka med sökordet som ankartext.
 */
const ANVANDNINGAR_PER_KATEGORI = {
  "fritid-solenergi": ["husbilsbatteri", "husvagnsbatteri", "marinbatteri", "solcellsbatteri-12v"],
  "traktion-industri": ["golfbilsbatteri"],
  stationara: ["solcellsbatteri-12v"],
  alla: ["husbilsbatteri", "husvagnsbatteri", "marinbatteri", "solcellsbatteri-12v", "golfbilsbatteri"],
}

function AnvandningLankar({ slug }) {
  const sidor = (ANVANDNINGAR_PER_KATEGORI[slug] || [])
    .map((s) => anvandningBySlug(s))
    .filter(Boolean)

  if (!sidor.length) return null

  return (
    <section className="border-t border-border bg-surface">
      <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6">
        <h2 className="mb-1.5 font-heading text-xl font-bold text-text-dark">
          Vet du vad batteriet ska sitta i?
        </h2>
        <p className="mb-6 max-w-2xl text-sm leading-relaxed text-text-mid">
          Då är det oftast snabbare att utgå från användningen än från kategorin. Sidorna
          nedan visar bara de batterier som passar, med råd om kapacitet och montering.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {sidor.map((s) => (
            <Link
              key={s.slug}
              href={`/${s.slug}`}
              className="group flex items-start justify-between gap-3 rounded-2xl border border-border bg-white p-5 transition-colors hover:border-navy"
            >
              <div>
                <div className="font-heading text-base font-bold text-text-dark">{s.h1}</div>
                <div className="mt-1 text-xs text-text-light">{s.eyebrow}</div>
              </div>
              <ChevronRight
                size={16}
                className="mt-0.5 shrink-0 text-text-light transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
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
    alternates: { canonical: `https://www.batteriproffs.se/kategori/${slug}` },
    openGraph: {
      title: seo.ogTitle,
      description: seo.ogDescription,
    },
  }
}

export default async function CategoryRoute({ params }) {
  const { slug } = await params

  // Utan den här svarade okända slugs 200 med en tom kategorivy
  if (!CATEGORIES.some((c) => c.slug === slug)) notFound()

  return (
    <>
      <script {...jsonLdProps(breadcrumbJsonLd([
        { name: "Hem", path: "/" },
        {
          name: CATEGORIES.find((c) => c.slug === slug)?.title || "Batterier",
          path: `/kategori/${slug}`,
        },
      ]))} />
      <TopBar />
      <Header />
      <main id="innehall">        {/* Suspense krävs för att kategorivyn läser ?volt= från URL:en */}
        <Suspense>
          <CategoryPageContent />
        </Suspense>
        <AnvandningLankar slug={slug} />
        <CtaBanner />
      </main>
      <Footer />
    </>
  )
}
