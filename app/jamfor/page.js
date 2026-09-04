import { Suspense } from "react"
import TopBar from "@/components/TopBar"
import Header from "@/components/Header"
import ComparisonContent from "@/components/ComparisonContent"
import Footer from "@/components/Footer"

export const metadata = {
  title: "Jämför batterier | Batteriproffs",
  description: "Jämför specifikationer och priser för batterier.",
  // Kundens ordersida hör inte hemma i sökresultatet. Ingen canonical heller —
  // sidan ska inte rankas på något.
  robots: { index: false, follow: false },
}

export default function ComparisonPage() {
  return (
    <>
      <TopBar />
      <Header />
      <main id="innehall">
        {/* ComparisonContent läser ?fel= via useSearchParams, och utan Suspense
            vägrar Next förrendera sidan statiskt. */}
        <Suspense
          fallback={
            <section className="mx-auto max-w-3xl px-5 py-20">
              <p className="text-sm text-text-light">Hämtar…</p>
            </section>
          }
        >
          <ComparisonContent />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
