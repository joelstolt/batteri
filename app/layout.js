import { Outfit, DM_Sans } from "next/font/google"
import Script from "next/script"
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
  title: "Batteriproffs — Fritidsbatteri, traktionsbatteri & truckbatteri",
  description:
    "Köp fritidsbatteri, traktionsbatteri, truckbatteri och gelbatteri. 20+ års erfarenhet, snabb leverans i hela Sverige och 30 dagars öppet köp.",
  openGraph: {
    title: "Batteriproffs — Fritidsbatteri, traktionsbatteri & truckbatteri",
    description:
      "Fritidsbatteri, traktionsbatteri, truckbatteri och gelbatteri för städmaskiner. Snabb leverans i hela Sverige.",
    url: "https://www.batteriproffs.se",
    siteName: "Batteriproffs",
    locale: "sv_SE",
    type: "website",
  },
  verification: {
    google: "1vKK5ivGl-0FRnfRNTsD7sAW6TLncah2EOMI6yvKINs",
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="sv" className={`${outfit.variable} ${dmSans.variable}`}>
      <body>
        <Providers>{children}</Providers>
        <Script
          src="https://umami-analytics-tau-two.vercel.app/script.js"
          data-website-id="99e7d795-e675-49e9-bdea-6499c9e29558"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
