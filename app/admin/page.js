import AdminOrders from "@/components/AdminOrders"

/**
 * Internt verktyg. Ingen TopBar, Header eller Footer — det här är inte en
 * sida på sajten, det är arbetsytan för er tre.
 */
export const metadata = {
  title: "Ordrar — Batteriproffs admin",
  // Sidan ligger också i robots.txt, men noindex är det som faktiskt håller
  // den ur indexet. Disallow hindrar bara crawlen, inte indexeringen av en
  // URL någon har länkat till.
  robots: { index: false, follow: false },
}

export default function AdminPage() {
  return (
    <main id="innehall" className="min-h-screen bg-surface">
      <AdminOrders />
    </main>
  )
}
