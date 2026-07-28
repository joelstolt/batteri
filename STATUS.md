# Batteriproffs — läge 2026-07-29

Skrivet som överlämning. En ny session ska kunna läsa den här filen och fortsätta
utan att gräva i historiken.

- **Källa:** `clients/batteriproffs`, repo `joelstolt/batteri`
- **Stack:** Next 16 App Router, React 19, Tailwind v4, Vercel
- **Deploy:** auto vid push till `main`. Ingen CLI, ingen manuell deploy.
- **Live:** https://www.batteriproffs.se
- **Allt i den här filen är pushat och live**, utom där annat står.

## Affären, som den faktiskt ser ut

Det här styr formuleringar och funktionsval, så läs det innan du skriver copy:

- Helt digital verksamhet. Ingen butik, inga kundbesök, ingen upphämtning.
- **Leverantören skickar direkt till kund i 9 av 10 fall (dropship).** Därför:
  - Batteriproffs kvalificerar **inte** för en Google Business Profile.
  - Inga leveranslöften får formuleras som garantier. Det står "normalt", medvetet.
  - Spårningsnummer beror på att leverantören lämnar det vidare. Ej bekräftat.
- Firmaadress (ej besöksadress): Väringavägen 10, 281 42 Hässleholm.
- Kassan är **företag bara** och **kort bara**. Båda medvetna beslut av Joel.
  Faktura är uppskjuten, inte bortvald.
- Frakt: **695 kr platt**. Ligger kvar tills Joel förhandlat med leverantören.
- Delägare: Joel, Isak, Lukas.
- **Prisläget är verifierat:** T-105-motsvarigheten 2 195 kr mot Batteriexpressens
  4 728 kr. Även med full frakt (2 890 kr) billigast i Sverige. "Marknadens
  vassaste priser" är belagt, inte skryt.

## Vad som finns

20 produkter i `lib/products.js` (hårdkodade). Sanity är inkopplat men innehåller
**noll produkter** — rör det inte, det är en fälla att börja läsa därifrån.

Sidor: startsida, 20 produktsidor, kategorier, 29 maskinsidor under
`/batteri-till/<slug>`, 3 ersättningssidor under `/ersatter/<slug>`, `/laddare`,
`/batterivatten`, `/skotsel`, `/faq`, `/om-oss`, `/kontakt`, `/villkor`,
`/integritet`, `/kassa`, `/tack`.

API: `create-payment-intent`, `order-details`, `order`, `order/ship`,
`stripe/webhook`, `contact`, `google-feed.xml`.

Env i Vercel: `NEXT_PUBLIC_STRIPE`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`,
`RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `ADMIN_TOKEN`.

**Mätvärden (Lighthouse, live):** Prestanda 96, Tillgänglighet 100,
Best practices 100, SEO 100, Agentic browsing 100. LCP ~1,0 s.

## Filer att känna till innan du ändrar något

| Fil | Varför den spelar roll |
|---|---|
| `lib/products.js` | 20 produkter. `publicProducts` = de utan `hidden`. **Alla listningsytor måste använda `publicProducts`**, annars läcker testprodukten ut. |
| `lib/machines.js` | 29 maskiner, härledda ur `fitsTo`. Lägg till maskin genom att lägga till i `fitsTo`. |
| `lib/replacements.js` | Härleds ur spec-fältet `Ersätter`. |
| `lib/search-index.js` | Herons sökregister. `sokbar()` måste användas av UI:t också, annars säger rutan "ingen träff" på frågor som aldrig söktes. |
| `lib/checkout.js` | B2B-validering (orgnr, Luhn). Delas av klient och server — validera aldrig bara i klienten. |
| `lib/references.js` | Adam Olsson + Lasse Karlsson, `godkand: false`. Visas inte. Flippa först vid skriftligt OK. |
| `lib/constants.js` | Telefon, adress, öppettider. Ändra på ett ställe. |
| `app/globals.css` | Färgtokens med uppmätt kontrast i kommentar. `--color-amber-heading` bara till stora rubriker. Rör inte utan att mäta om. |

## Fällor som redan kostat tid

- **Stripe Link** hänger kassan. `payment_method_types: ["card"]` tar bort Link som
  betalsätt men **inte** Link-signupen — den sitter på kontot. Avstängd via
  `payment_method_configurations` på båda konfigurationerna. `confirmPayment` kan
  dessutom kasta, så den har try/catch + 45-sekunders vakthund.
- **Rate limiting i minnet fungerar inte på Vercel** (instanser skalar ut). Löst
  med en WAF-regel, `fixed_window` 20/60 s per IP på `/api/*`. `token_bucket`
  kräver Enterprise.
- **`NextResponse` går inte att återanvända** mellan anrop — kroppen läses en gång.
  Skapa svaret i en funktion.
- **Bygget fångar inte allt.** Både Link-buggen och NextResponse-buggen syntes
  först vid skarpt test mot live.
- **axe rapporterar falska kontrastfel** på `position: sticky` utan egen bakgrund.
- **DataForSEO utelämnar `score`** på color-contrast — kör `full_data: true`.

## Kvar — Joels bord

- Bekräfta avskärningstiden "före 14" med leverantören. Den står i H1 och i villkoren.
- Får ni spårningsnumret av leverantören? Kassan lovar att det mejlas, och
  `/api/order/ship` kräver att numret matas in för hand.
- Adam och Lasse: få deras godkännande i skrift, plus företag eller roll.
- Kreditera testköpet på 5 kr.
- Koppla bankkonto till Stripe.
- Kontrollera att `CONTACT_TO_EMAIL` går till Isak och Lukas, inte bara Joel.
- Foton på er tre. (Animerade figurer avfärdade: illustrerade människor sänker
  trovärdigheten mot en industriell B2B-köpare.)

## Kvar — bygge

**Nästa: kundkonto + orderhantering.** Fem av sju konkurrenter har inloggning,
ni har ingen. Ordrarna finns i dag **bara i Stripe och i ett mejl** — ingen lista,
ingen status, inget "beställ igen". B2B-kunder köper samma batteri om och om igen,
så det är funktionen som gör återköp friktionsfria. Hänger ihop med att `inStock`
är hårdkodat i `lib/products.js` och inte speglar leverantörens saldo.

Övrigt i kö, i ungefärlig ordning:

1. Viktbaserad frakt — bara 8 av 20 produkter har vikt i datan i dag.
2. Kunskapsbank. "Vad kostar ett truckbatteri?" träffar PAA och tre relaterade
   sökningar. Tre av åtta relaterade sökningar innehåller "pris".
3. Stafflade priser (mängdrabatt) — normalt i B2B, saknas.
4. Datablad som PDF per produkt.
5. Prisjakt-feed.
