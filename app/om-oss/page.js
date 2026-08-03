import TopBar from "@/components/TopBar"
import Header from "@/components/Header"
import AboutContent from "@/components/AboutContent"
import CtaBanner from "@/components/CtaBanner"
import Footer from "@/components/Footer"

export const metadata = {
  alternates: { canonical: "https://www.batteriproffs.se/om-oss" },
  title: "Om oss — Batteriproffs",
  description: "Batteriproffs säljer traktionsbatterier, gelbatterier och laddare till företag i hela Sverige. Drivs av Joel Stolt, enskild firma med säte i Hässleholm.",
}

export default function AboutPage() {
  return (
    <>
      <TopBar />
      <Header />
      <main id="innehall">        <AboutContent />
        <CtaBanner />
      </main>
      <Footer />
    </>
  )
}
