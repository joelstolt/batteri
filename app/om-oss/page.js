import TopBar from "@/components/TopBar"
import Header from "@/components/Header"
import AboutContent from "@/components/AboutContent"
import CtaBanner from "@/components/CtaBanner"
import Footer from "@/components/Footer"

export const metadata = {
  title: "Om oss — Batteriproffs",
  description: "Batteriproffs är Sveriges auktoriserade Sonnenschein-partner. Lär känna oss och vår expertis inom professionella batterilösningar.",
}

export default function AboutPage() {
  return (
    <>
      <TopBar />
      <Header />
      <AboutContent />
      <CtaBanner />
      <Footer />
    </>
  )
}
