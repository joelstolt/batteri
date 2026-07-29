/**
 * FAQ-innehållet i en fil, så att både sidan och FAQPage-schemat läser
 * samma källa. Duplicerat innehåll i schemat är en klassisk källa till
 * att rich results tappas när texten ändras på ett ställe men inte det andra.
 */
import { CreditCard, Package, RotateCcw, Truck, Zap } from "lucide-react"

export const FAQ_SECTIONS = [
  {
    title: "Beställning & produkter",
    icon: Package,
    items: [
      {
        q: "Vilka batterier säljer ni?",
        a: "Vi säljer professionella blockbatterier i två tekniker: öppna blybatterier från Nordmax och EV, och underhållsfria gelbatterier från Sonnenschein dryfit. Sortimentet täcker fyra områden: traktionsbatterier (truckar, liftar, golfbilar, entreprenadmaskiner), batterier till städmaskiner, stationära batterier (larm, hissar, UPS, sprinklersystem) och fritid och solenergi (husbil, båt, solceller, off-grid). Vi säljer inte cellbatterier till större motviktstruckar.",
      },
      {
        q: "Hur vet jag vilket batteri jag behöver?",
        a: "Det enklaste sättet är att kontakta oss med information om din maskin eller ditt användningsområde. Du kan också använda vår Battery Finder på startsidan för att filtrera efter område och spänning. Har du ett befintligt batteri? Notera modellnumret (t.ex. GF 12 105V) så hjälper vi dig hitta rätt ersättning.",
      },
      {
        q: "Säljer ni till privatpersoner?",
        a: "Kassan på sajten är byggd för företag och kräver organisationsnummer, så en beställning går inte att slutföra som privatperson. Är du privatperson och vill köpa ett batteri, ring 073-554 69 68 eller mejla info@batteriproffs.se så löser vi det manuellt.",
      },
      {
        q: "Visas priserna med eller utan moms?",
        a: "Priserna visas inklusive moms som standard. Vill du se dem exklusive moms växlar du med knappen längst upp på sidan, och valet ligger kvar när du surfar vidare. I kassan specificeras alltid både netto och moms.",
      },
      {
        q: "Kan jag få en offert för en större beställning?",
        a: "Absolut. Kontakta oss via telefon eller mejl med information om vilka batterier och antal du behöver, så skickar vi en offert. Vid större volymer kan vi erbjuda bättre priser.",
      },
    ],
  },
  {
    title: "Frakt & leverans",
    icon: Truck,
    items: [
      {
        q: "Vad kostar frakten?",
        a: "Vi har en fast fraktkostnad på 695 kr (inkl. moms) per beställning, oavsett vikt och destination i Sverige. Vid större volymer eller pallgods — kontakta oss för offert.",
      },
      {
        q: "Hur lång är leveranstiden?",
        a: "De flesta beställningar levereras inom 1–3 arbetsdagar. Beställningar lagda före kl. 14 på vardagar skickas normalt samma dag. Vid leverans av pallar eller tyngre gods kan det ta 2–5 arbetsdagar.",
      },
      {
        q: "Vilka fraktbolag använder ni?",
        a: "Vi skickar via PostNord, DHL och Schenker beroende på paketets storlek och vikt. Mindre paket skickas oftast med PostNord, medan pallar och tyngre gods går via DHL eller Schenker.",
      },
      {
        q: "Levererar ni till hela Sverige?",
        a: "Ja, vi levererar till hela Sverige inklusive Gotland. Kontakta oss för leverans till andra nordiska länder.",
      },
    ],
  },
  {
    title: "Betalning",
    icon: CreditCard,
    items: [
      {
        q: "Vilka betalningsalternativ finns?",
        a: "Du betalar säkert med kort — Visa eller Mastercard. Alla betalningar hanteras krypterat via Stripe.",
      },
      {
        q: "Kan jag betala med faktura?",
        a: "Är du företagskund och vill beställa mot faktura eller större volym? Kontakta oss på info@batteriproffs.se eller 073-554 69 68 så tar vi fram en offert och löser betalningen.",
      },
      {
        q: "Är det säkert att handla hos er?",
        a: "Ja. Vi använder Stripe som betalningsleverantör, vilket innebär att alla transaktioner är krypterade och uppfyller PCI DSS-standarden. Vi lagrar aldrig dina kortuppgifter.",
      },
    ],
  },
  {
    title: "Retur & reklamation",
    icon: RotateCcw,
    items: [
      {
        q: "Vad är er returpolicy?",
        a: "Vi erbjuder 30 dagars öppet köp i enlighet med distanshandelslagen. Produkten ska vara oanvänd och i originalförpackning. Kontakta oss innan du skickar tillbaka en vara så skickar vi en retursedel.",
      },
      {
        q: "Kan jag ändra eller avbryta min order?",
        a: "Hör av dig så fort som möjligt på 073-554 69 68. Vi skickar i de flesta fall direkt från leverantör, och när ordern väl gått vidare dit kan vi inte längre stoppa den. Har batteriet redan skickats får du i stället utnyttja det öppna köpet på 30 dagar.",
      },
      {
        q: "Vad händer om jag inte hämtar ut paketet?",
        a: "Paketet skickas tillbaka till oss och du debiteras 249 kr för returfrakt och hantering, eller 500 kr för artiklar som skickas direkt från leverantör. Eftersom de flesta av våra batterier skickas direkt från leverantör är 500 kr det som gäller i normalfallet. Batterierna väger mellan 19 och 63 kilo, så en outhämtad försändelse innebär frakt i båda riktningarna. Kan du inte ta emot leveransen, hör av dig i förväg så bokar vi om utan kostnad.",
      },
      {
        q: "Vad gör jag med mitt gamla batteri?",
        a: "Vi tar hand om det utan kostnad. Blybatterier är miljöfarligt avfall och får inte slängas som vanligt avfall, men de är också nästan helt återvinningsbara. Hör av dig på 073-554 69 68 eller info@batteriproffs.se när du beställer, så bestämmer vi hur ditt gamla batteri hämtas eller lämnas.",
      },
      {
        q: "Vad gör jag om batteriet är skadat vid leverans?",
        a: "Kontakta oss inom 24 timmar med bilder på skadan och fraktsedeln. Vi ordnar ersättning eller full återbetalning. Dokumentera alltid eventuella transportskador direkt vid leverans.",
      },
      {
        q: "Finns det garanti på batterierna?",
        a: "Ja, alla Sonnenschein-batterier levereras med tillverkargaranti. Garantitiden varierar beroende på modell och användningsområde — se produktsidan för specifik information eller kontakta oss.",
      },
    ],
  },
  {
    title: "Teknik & underhåll",
    icon: Zap,
    items: [
      {
        q: "Vad är skillnaden på gel- och AGM-batterier?",
        a: "Gel-batterier (som Sonnenschein) har elektrolyten bunden i en gel, vilket gör dem helt underhållsfria, läckagefria och tåliga mot djupurladdning. AGM-batterier har elektrolyten absorberad i glasfibermatta. Gel-batterier har generellt längre livslängd och bättre prestanda vid cyklisk användning.",
      },
      {
        q: "Hur lång livslängd har ett gel-batteri?",
        a: "Sonnenschein dryfit-batterier har en designlivslängd på 6–12 år beroende på modell och användningsmönster. Livslängden påverkas av urladdningsdjup, temperatur och laddningsrutiner. Korrekt laddning och underhåll förlänger livslängden betydligt.",
      },
      {
        q: "Behöver jag en speciell laddare?",
        a: "Gel-batterier kräver en laddare med korrekt laddningsprofil (IU-kurva). Laddaren ska ha en laddningsspänning på max 14.4V för 12V-batterier och temperaturkompensering. Vi rekommenderar att du kontaktar oss för vägledning om rätt laddare.",
      },
    ],
  },
]

/** Plattar ut till frågor och svar för FAQPage-schemat. */
export const faqPairs = FAQ_SECTIONS.flatMap((s) => s.items ?? s.questions ?? [])
