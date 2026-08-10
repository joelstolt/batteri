import AnvandningRoute, { anvandningMetadata } from "@/components/AnvandningRoute"

export const metadata = anvandningMetadata("husvagnsbatteri")

export default function Page() {
  return <AnvandningRoute slug="husvagnsbatteri" />
}
