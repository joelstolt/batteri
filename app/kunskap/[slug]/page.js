import { notFound } from "next/navigation"
import { artiklar, artikelBySlug } from "@/lib/kunskap"
import { breadcrumbJsonLd, jsonLdProps } from "@/lib/schema"
import { pageMeta } from "@/lib/seo"
import { SITE_URL, SITE_NAME } from "@/lib/constants"
import TopBar from "@/components/TopBar"
import Header from "@/components/Header"
import KunskapArtikel from "@/components/KunskapArtikel"
import CtaBanner from "@/components/CtaBanner"
import Footer from "@/components/Footer"

export async function generateStaticParams() {
  return artiklar.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const a = artikelBySlug(slug)
  if (!a) return { title: "Sidan hittades inte — Batteriproffs" }

  return {
    ...pageMeta({
      path: `/kunskap/${a.slug}`,
      title: a.seoTitle,
      description: a.metaDescription,
      ogTitle: a.title,
    }),
    openGraph: {
      ...pageMeta({ path: `/kunskap/${a.slug}`, title: a.seoTitle, description: a.metaDescription })
        .openGraph,
      type: "article",
      publishedTime: a.uppdaterad,
    },
  }
}

/** Article-schema. Renderas inline i server-HTML, aldrig via next/script. */
function articleJsonLd(a) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.metaDescription,
    datePublished: a.uppdaterad,
    dateModified: a.uppdaterad,
    inLanguage: "sv-SE",
    mainEntityOfPage: `${SITE_URL}/kunskap/${a.slug}`,
    author: { "@type": "Organization", name: SITE_NAME, "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
  }
}

export default async function KunskapArtikelRoute({ params }) {
  const { slug } = await params
  const artikel = artikelBySlug(slug)

  // Utan notFound svarar okända slugs 200 med en tom vy, och då indexerar
  // Google hur många skräp-URL:er som helst.
  if (!artikel) notFound()

  return (
    <>
      <script {...jsonLdProps(articleJsonLd(artikel))} />
      <script
        {...jsonLdProps(
          breadcrumbJsonLd([
            { name: "Hem", path: "/" },
            { name: "Kunskapsbank", path: "/kunskap" },
            { name: artikel.title, path: `/kunskap/${artikel.slug}` },
          ])
        )}
      />
      <TopBar />
      <Header />
      <main id="innehall">
        <KunskapArtikel artikel={artikel} />
        <CtaBanner />
      </main>
      <Footer />
    </>
  )
}
