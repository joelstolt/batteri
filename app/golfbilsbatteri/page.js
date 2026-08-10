import AnvandningRoute, { anvandningMetadata } from "@/components/AnvandningRoute"

export const metadata = anvandningMetadata("golfbilsbatteri")

export default function Page() {
  return <AnvandningRoute slug="golfbilsbatteri" />
}
