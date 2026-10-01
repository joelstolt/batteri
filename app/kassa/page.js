import TopBar from "@/components/TopBar"
import Header from "@/components/Header"
import CheckoutContent from "@/components/CheckoutContent"
import Footer from "@/components/Footer"

export const metadata = {
  robots: { index: false, follow: false },
  title: "Kassa | Batteriproffs",
  description: "Slutför din beställning hos Batteriproffs.",
}

export default function KassaPage() {
  return (
    <>
      <TopBar />
      <Header />
      <main id="innehall">
        {" "}
        <CheckoutContent
          reviewPreview={process.env.BP_REVIEW_PREVIEW === "1"}
        />
      </main>
      <Footer />
    </>
  )
}
