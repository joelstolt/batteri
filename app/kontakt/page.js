import TopBar from "@/components/TopBar"
import Header from "@/components/Header"
import ContactContent from "@/components/ContactContent"
import Footer from "@/components/Footer"

export const metadata = {
  title: "Kontakta oss — Batteriproffs",
  description: "Kontakta Batteriproffs för rådgivning om batterier. Vi hjälper dig hitta rätt batteri för din verksamhet.",
}

export default function ContactPage() {
  return (
    <>
      <TopBar />
      <Header />
      <ContactContent />
      <Footer />
    </>
  )
}
