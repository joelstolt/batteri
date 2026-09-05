import { Outfit, DM_Sans } from "next/font/google"
import Script from "next/script"
import Providers from "@/components/Providers"
import { hamtaGodkandaCachat, betygPerProdukt } from "@/lib/omdomen"
import { hamtaKopPerProduktCachat } from "@/lib/orders"
import { unstable_noStore as noStore } from "next/cache"
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
  // INGA erfarenhetspåståenden här. Det stod "20+ års erfarenhet" fram till
  // 2026-08-03, på ett bolag som gjort sin första order i juli 2026. Eftersom
  // det är root-layouten ärvdes påståendet av varje sida som inte satte egen
  // description. Google flaggade sajten för Felaktig framställning och
  // stoppade alla 20 produkter i Merchant Center. Skriv bara sånt som går att
  // verifiera utifrån.
  //
  // Av samma skäl ströks "30 dagars öppet köp" 2026-08-04: kassan kräver
  // organisationsnummer, och vid företagsköp finns ingen ångerrätt att lova
  // bort. Löftet gick inte att infria för någon som faktiskt kunde handla här.
  description:
    "Köp fritidsbatteri, traktionsbatteri, truckbatteri och gelbatteri till företag. Priser öppet på sajten, leverans i hela Sverige och passformsgaranti på alla batterier.",
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

// Timvis ISR på allt: omdömesdatan i layouten ska inte frysa vid bygget.
// Godkännande i admin revaliderar dessutom direkt (tag + layout-path).
export const revalidate = 3600

export default async function RootLayout({ children }) {
  // Ett trasigt Stripe-anrop får aldrig fälla sajten — då visas inga stjärnor.
  let betyg = {}
  let kop = {}
  try {
    const [godkanda, kopPer] = await Promise.all([
      hamtaGodkandaCachat(),
      hamtaKopPerProduktCachat(),
    ])
    betyg = betygPerProdukt(godkanda)
    kop = kopPer
  } catch (err) {
    // Sidan får inga stjärnor den här gången — men cacha inte det i en timme.
    console.error("Kunde inte läsa omdömen/köp till layouten:", err)
    noStore()
  }
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

        {(process.env.BP_REVIEW_PREVIEW === "1" || process.env.BP_PAYMENT_TEST === "1") && (
          <div
            style={{
              background: "#E8B931",
              color: "#182421",
              padding: 8,
              textAlign: "center",
              fontSize: 13,
            }}
          >
            Skyddat betalningstest. Endast testkort. Ingen riktig beställning.
          </div>
        )}
        <Providers betyg={betyg} kop={kop}>
          {children}
        </Providers>
        {(process.env.BP_REVIEW_PREVIEW !== "1" && process.env.BP_PAYMENT_TEST !== "1") && <CookieBanner />}
        {(process.env.BP_REVIEW_PREVIEW !== "1" && process.env.BP_PAYMENT_TEST !== "1") && (
          <>
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

            {/* Chatten är sajtens primära kontaktväg (telefonen är nedtonad tills
            verksamheten bemannas på heltid). Lazy så att Prestanda 96 står
            kvar — widgeten behövs inte för första målningen. */}
            <Script
              src="https://chatbot-widget.joel-d77.workers.dev/widget.js"
              data-client="batteriproffs"
              data-company="Batteriproffs"
              data-primary="#0B1D3A"
              data-accent="#FDB813"
              strategy="lazyOnload"
            />
          </>
        )}
      </body>
    </html>
  )
}
