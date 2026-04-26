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
  title: "Batteriproffs — Professionella batterilösningar för företag",
  description:
    "Traktionsbatterier, gel-batterier för städmaskiner, stationära batterier och fritidsbatterier. Snabb leverans i hela Sverige och 30 dagars öppet köp.",
  openGraph: {
    title: "Batteriproffs — Professionella batterilösningar",
    description:
      "Experter på traktion, städmaskin och stationära batterier. 20+ år i branschen.",
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
