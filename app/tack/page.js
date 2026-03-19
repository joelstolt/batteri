import { Suspense } from "react"
import TopBar from "@/components/TopBar"
import Header from "@/components/Header"
import ThankYouContent from "@/components/ThankYouContent"
import Footer from "@/components/Footer"

export const metadata = {
  title: "Tack för din beställning — Batteriproffs",
}

export default function ThankYouPage() {
  return (
    <>
      <TopBar />
      <Header />
      <Suspense>
        <ThankYouContent />
      </Suspense>
      <Footer />
    </>
  )
}
