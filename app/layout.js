import { Outfit, DM_Sans } from "next/font/google"
import Providers from "@/components/Providers"
import "./globals.css"

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700", "800"],
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
})

export const metadata = {
  title: "Batteriproffs — Professionella batterilösningar | Sonnenschein-partner",
  description:
    "Sveriges auktoriserade Sonnenschein-partner. Traktionsbatterier, gel-batterier för städmaskiner, stationära batterier och fritidsbatterier. Fri frakt över 2 000 kr.",
  openGraph: {
    title: "Batteriproffs — Professionella batterilösningar",
    description:
      "Sveriges auktoriserade Sonnenschein-partner. Experter på traktion, städmaskin och stationära batterier.",
    url: "https://www.batteriproffs.se",
    siteName: "Batteriproffs",
    locale: "sv_SE",
    type: "website",
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="sv" className={`${outfit.variable} ${dmSans.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
