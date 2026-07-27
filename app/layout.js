import { Outfit, DM_Sans } from "next/font/google"
import Script from "next/script"
import Providers from "@/components/Providers"
import CookieBanner from "@/components/CookieBanner"
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

// metadataBase gör relativa OG-bilder absoluta. Det är INTE canonical —
// canonical sätts per sida, aldrig här (ärvs annars till hela sajten).
export const metadata = {
  metadataBase: new URL("https://www.batteriproffs.se"),
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
        {/* Consent Mode måste sättas INNAN Google-taggen laddas, annars hinner
            den sätta annonscookies utan samtycke. Därför beforeInteractive. */}
        <Script id="consent-default" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              analytics_storage: 'denied',
              functionality_storage: 'granted',
              security_storage: 'granted',
              wait_for_update: 500
            });
            try {
              if (localStorage.getItem('bp-consent') === 'granted') {
                gtag('consent', 'update', {
                  ad_storage: 'granted',
                  ad_user_data: 'granted',
                  ad_personalization: 'granted',
                  analytics_storage: 'granted'
                });
              }
            } catch (e) {}
          `}
        </Script>

        <a
          href="#innehall"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-navy focus:px-4 focus:py-2.5 focus:font-heading focus:text-sm focus:font-bold focus:text-white"
        >
          Hoppa till innehåll
        </a>

        <Providers>{children}</Providers>
        <CookieBanner />

        {/* Umami är cookielöst och kräver inget samtycke */}
        <Script
          src="https://umami-analytics-tau-two.vercel.app/script.js"
          data-website-id="99e7d795-e675-49e9-bdea-6499c9e29558"
          strategy="afterInteractive"
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17955953885"
          strategy="afterInteractive"
        />
        <Script id="google-ads-gtag" strategy="afterInteractive">
          {`
            gtag('js', new Date());
            gtag('config', 'AW-17955953885');
          `}
        </Script>
      </body>
    </html>
  )
}
