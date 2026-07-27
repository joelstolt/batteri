import { Suspense } from "react"
import TopBar from "@/components/TopBar"
import Header from "@/components/Header"
import ThankYouContent from "@/components/ThankYouContent"
import Footer from "@/components/Footer"

export const metadata = {
  robots: { index: false, follow: false },
  title: "Tack för din beställning — Batteriproffs",
}

export default function ThankYouPage() {
  return (
    <>
      <TopBar />
      <Header />
      <main id="innehall">        <Suspense>
          <ThankYouContent />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
