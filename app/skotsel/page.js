import TopBar from "@/components/TopBar"
import Header from "@/components/Header"
import SkotselContent from "@/components/SkotselContent"
import Footer from "@/components/Footer"

export const metadata = {
  title: "Skötsel av batterier — guide för längre livslängd | Batteriproffs",
  description:
    "Komplett guide till skötsel och underhåll av gel-batterier, AGM och blybatterier. Laddning, förvaring, vanliga misstag och tips från Batteriproffs.",
  alternates: { canonical: "https://www.batteriproffs.se/skotsel" },
  openGraph: {
    title: "Skötsel av batterier — guide för längre livslängd",
    description:
      "Allt du behöver veta om laddning, förvaring och underhåll av gel-, AGM- och blybatterier.",
    type: "article",
  },
}

export default function SkotselPage() {
  return (
    <>
      <TopBar />
      <Header />
      <main id="innehall">        <SkotselContent />
      </main>
      <Footer />
    </>
  )
}
