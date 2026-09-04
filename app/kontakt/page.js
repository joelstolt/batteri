import TopBar from "@/components/TopBar"
import Header from "@/components/Header"
import ContactContent from "@/components/ContactContent"
import Footer from "@/components/Footer"

export const metadata = {
  alternates: { canonical: "https://www.batteriproffs.se/kontakt" },
  title: "Kontakta oss — Batteriproffs",
  description:
    "Kontakta Batteriproffs för rådgivning om batterier. Vi hjälper dig hitta rätt batteri för din verksamhet.",
}

export default async function ContactPage({ searchParams }) {
  const params = await searchParams
  const order =
    typeof params.order === "string" && /^BP-[A-Z0-9]{1,20}$/.test(params.order)
      ? params.order
      : ""
  const reasons = {
    reklamation: "Fel på produkten",
    transportskada: "Transportskada",
    felartikel: "Fel artikel levererad",
    retur: "Fråga om retur",
  }
  const reason =
    params.arende === "retur"
      ? reasons[params.orsak] || "Retur eller reklamation"
      : "Fråga"
  const article =
    typeof params.artikel === "string" ? params.artikel.slice(0, 200) : ""
  const qty = /^\d{1,2}$/.test(params.antal || "") ? params.antal : ""
  const initialMessage = order
    ? `${reason} för order ${order}.\n\nArtikel: ${article}\nAntal: ${qty}\nBeskrivning:\n`
    : ""

  return (
    <>
      <TopBar />
      <Header />
      <main id="innehall">
        {" "}
        <ContactContent
          reviewPreview={process.env.BP_REVIEW_PREVIEW === "1"}
          initialMessage={initialMessage}
        />
      </main>
      <Footer />
    </>
  )
}
