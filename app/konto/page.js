import { Suspense } from "react"
import TopBar from "@/components/TopBar"
import Header from "@/components/Header"
import KontoContent from "@/components/KontoContent"
import Footer from "@/components/Footer"

export const metadata = {
  title: "Mitt konto — Batteriproffs",
  description: "Se dina ordrar, leveransstatus och beställ om tidigare köp.",
  // Kundens ordersida hör inte hemma i sökresultatet. Ingen canonical heller —
  // sidan ska inte rankas på något.
  robots: { index: false, follow: false },
}

export default function KontoPage() {
  return (
    <>
      <TopBar />
      <Header />
      <main id="innehall">
        {/* KontoContent läser ?fel= via useSearchParams, och utan Suspense
            vägrar Next förrendera sidan statiskt. */}
        <Suspense
          fallback={
            <section className="mx-auto max-w-3xl px-5 py-20">
              <p className="text-sm text-text-light">Hämtar…</p>
            </section>
          }
        >
          <KontoContent />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
