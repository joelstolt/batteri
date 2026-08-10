import AnvandningRoute, { anvandningMetadata } from "@/components/AnvandningRoute"

export const metadata = anvandningMetadata("marinbatteri")

export default function Page() {
  return <AnvandningRoute slug="marinbatteri" />
}
