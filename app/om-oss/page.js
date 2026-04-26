import TopBar from "@/components/TopBar"
import Header from "@/components/Header"
import AboutContent from "@/components/AboutContent"
import CtaBanner from "@/components/CtaBanner"
import Footer from "@/components/Footer"

export const metadata = {
  title: "Om oss — Batteriproffs",
  description: "Batteriproffs är ett svenskt företag med över 20 års erfarenhet av professionella batterilösningar för företag och privatpersoner.",
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
