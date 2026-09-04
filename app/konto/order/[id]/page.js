import OrderDocument from "@/components/OrderDocument"
export const metadata = {
  title: "Orderunderlag | Batteriproffs",
  robots: { index: false, follow: false },
}
export default async function Page({ params }) {
  const { id } = await params
  return (
    <main id="innehall">
      <OrderDocument id={id} />
    </main>
  )
}
