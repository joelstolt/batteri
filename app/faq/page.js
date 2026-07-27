import { faqJsonLd, breadcrumbJsonLd, jsonLdProps } from "@/lib/schema"
import { faqPairs } from "@/lib/faq"
import TopBar from "@/components/TopBar"
import Header from "@/components/Header"
import FaqContent from "@/components/FaqContent"
import Footer from "@/components/Footer"

export const metadata = {
  alternates: { canonical: "https://www.batteriproffs.se/faq" },
  title: "Vanliga frågor — Batteriproffs",
  description:
    "Svar på vanliga frågor om beställning, frakt, betalning, retur och batterival hos Batteriproffs.",
}

export default function FaqPage() {
  return (
    <>
      <script {...jsonLdProps(faqJsonLd(faqPairs))} />
      <script {...jsonLdProps(breadcrumbJsonLd([
        { name: "Hem", path: "/" },
        { name: "Vanliga frågor", path: "/faq" },
      ]))} />
      <TopBar />
      <Header />
      <main id="innehall">        <FaqContent />
      </main>
      <Footer />
    </>
  )
}
