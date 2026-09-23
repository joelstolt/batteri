import { SITE_NAME, SITE_URL, EMAIL, PHONE } from "@/lib/constants"
import { publicProducts } from "@/lib/products"
import { DELIVERY_ESTIMATE, STANDARD_SHIPPING_INCL_VAT, RETURN_WINDOW_DAYS, RETURN_RESTOCKING_FEE_PERCENT } from "@/lib/store-policy"

export const dynamic = "force-static"

export function GET() {
  const text = `# ${SITE_NAME}

> Batterier för företag i hela Sverige. Traktionsbatterier, gelbatterier och
> AGM / Dry Cell-batterier till städmaskiner, liftar, truckar och golfbilar.
> Företagskassan kräver organisationsnummer. Priser visas inklusive moms som standard.

Kontakt: ${EMAIL} eller ${PHONE}, vardagar 08:00-17:00.
Leverans: normalt ${DELIVERY_ESTIMATE}, inte garanterat. Se köpvillkoren för undantag.
Fast frakt: ${STANDARD_SHIPPING_INCL_VAT} kr inklusive moms per beställning i hela Sverige, oavsett antal batterier, vikt eller om leveransen sker på pall. Inga frakttillägg tillkommer för tungt eller skrymmande gods. Totalpriset inklusive frakt visas i kassan innan köpet slutförs.
Betalning: kortbetalning i kassan.
Retur: kontakta oss inom ${RETURN_WINDOW_DAYS} dagar från leveransen och invänta skriftligt godkännande. Batteriet ska vara obrukat och förpackningen obruten. Vid godkänd retur av felfri vara görs ${RETURN_RESTOCKING_FEE_PERCENT} procent returavdrag. Frakten återbetalas inte och kunden står för returfrakten. Specialbeställda artiklar undantas. Fullständiga villkor: ${SITE_URL}/villkor#5-retur
Passformsgaranti: byte utan returavdrag enligt villkoren. Förpackningen ska vara obruten och batteriet får inte ha kopplats in. Kontakta oss inom ${RETURN_WINDOW_DAYS} dagar från leveransen. Fraktansvaret beror på om vi rekommenderade batteriet: ${SITE_URL}/villkor#6-passformsgaranti

## Sortiment
- [Alla batterier](${SITE_URL}/kategori/alla)
- [Traktion och industri](${SITE_URL}/kategori/traktion-industri)
- [Städmaskiner](${SITE_URL}/kategori/stadmaskiner)
- [Stationära](${SITE_URL}/kategori/stationara)
- [Fritid och solenergi](${SITE_URL}/kategori/fritid-solenergi)

## Produkter
Aktuella priser, lagerstatus, specifikationer och dokument finns på respektive produktsida. Artikelnumrets suffix kan ange polutförande. Kontrollera alltid spänning, mått och anslutningar för den aktuella maskinen.
${publicProducts.map((p) => `- [${p.name.replace(/[–—]/g, "-")}](${SITE_URL}/produkt/${p.slug})`).join("\n")}

## Maskiner och ersättningar
- [Batterier till maskiner](${SITE_URL}/batteri-till)
- [Trojan T-125](${SITE_URL}/ersatter/trojan-t-125)
- [Trojan T-105](${SITE_URL}/ersatter/trojan-t-105)
- [Trojan T-875](${SITE_URL}/ersatter/trojan-t-875)

## Kunskap och villkor
- [Skötsel av batterier](${SITE_URL}/skotsel)
- [Vanliga frågor](${SITE_URL}/faq)
- [Köpvillkor](${SITE_URL}/villkor)
- [Produktfeed, XML](${SITE_URL}/google-feed.xml)
`
  return new Response(text, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
