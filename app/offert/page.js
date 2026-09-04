import TopBar from "@/components/TopBar"
import Header from "@/components/Header"
import ContactContent from "@/components/ContactContent"
import Footer from "@/components/Footer"

export const metadata = {
  alternates: { canonical: "https://www.batteriproffs.se/offert" },
  title: "Begär offert | Batteriproffs",
  description: "Begär offert på artiklarna i din varukorg.",
}

export default function QuotePage() {
  return (
    <>
      <TopBar />
      <Header />
      <main id="innehall">
        {" "}
        <ContactContent
          reviewPreview={process.env.BP_REVIEW_PREVIEW === "1"}
          quote
        />
      </main>
      <Footer />
    </>
  )
}
