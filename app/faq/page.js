import TopBar from "@/components/TopBar"
import Header from "@/components/Header"
import FaqContent from "@/components/FaqContent"
import Footer from "@/components/Footer"

export const metadata = {
  title: "Vanliga frågor — Batteriproffs",
  description:
    "Svar på vanliga frågor om beställning, frakt, betalning, retur och batterival hos Batteriproffs. Auktoriserad Sonnenschein-partner.",
}

export default function FaqPage() {
  return (
    <>
      <TopBar />
      <Header />
      <FaqContent />
      <Footer />
    </>
  )
}
