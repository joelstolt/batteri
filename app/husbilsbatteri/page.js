import AnvandningRoute, { anvandningMetadata } from "@/components/AnvandningRoute"

export const metadata = anvandningMetadata("husbilsbatteri")

export default function Page() {
  return <AnvandningRoute slug="husbilsbatteri" />
}
