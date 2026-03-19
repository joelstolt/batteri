import TopBar from "@/components/TopBar"
import Header from "@/components/Header"
import CheckoutContent from "@/components/CheckoutContent"
import Footer from "@/components/Footer"

export const metadata = {
  title: "Kassa — Batteriproffs",
  description: "Slutför din beställning hos Batteriproffs.",
}

export default function KassaPage() {
  return (
    <>
      <TopBar />
      <Header />
      <CheckoutContent />
      <Footer />
    </>
  )
}
