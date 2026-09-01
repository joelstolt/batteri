import Link from "next/link"
import { breadcrumbJsonLd, faqJsonLd, jsonLdProps } from "@/lib/schema"
import { pageMeta } from "@/lib/seo"
import { EMAIL } from "@/lib/constants"
import TopBar from "@/components/TopBar"
import Header from "@/components/Header"
import CtaBanner from "@/components/CtaBanner"
import Footer from "@/components/Footer"
import ChattKnapp from "@/components/ChattKnapp"

/**
 * Företagskund.
 *
 * Kassan kräver organisationsnummer, vilket inte förklarades någonstans. En
 * privatperson fyllde varukorgen och gick in i en vägg, och en företagskund
 * fick ingen anledning att välja er framför någon som visar sina villkor.
 *
 * INGA LÖFTEN OM FAKTURA HÄR. Faktura är uppskjutet, inte bortvalt, och det
 * ska stå som det är tills Joel bestämt annat.
 */
export const metadata = pageMeta({
  path: "/foretagskund",
  title: "Företagskund — batterier till företag, kommun och myndighet | Batteriproffs",
  description:
    "Handla batterier som företag. Priser öppet på sajten, offert på volym, gratis återvinning av gamla batterier och personlig rådgivning.",
})

const FRAGOR = [
  {
    q: "Kan privatpersoner handla hos er?",
    a: "Kassan är byggd för företag och kräver organisationsnummer, så en beställning går inte att slutföra som privatperson på sajten. Chatta med oss eller mejla info@batteriproffs.se så löser vi köpet manuellt.",
  },
  {
    q: "Kan vi beställa mot faktura?",
    a: "Inte via sajten i dag. Kassan tar kort, och faktura är något vi tittar på men ännu inte erbjuder. Behöver ni faktura för en större order, hör av er så ser vi vad vi kan göra.",
  },
  {
    q: "Får vi rabatt vid större volym?",
    a: "Hör av er med antal och artiklar så räknar vi på det. Priserna på sajten gäller styckvis och vi har inga automatiska mängdrabatter i kassan ännu.",
  },
  {
    q: "Kan ni fakturera via Peppol eller e-faktura?",
    a: "Inte i dag. Är ni en offentlig verksamhet som kräver e-faktura, kontakta oss innan ni beställer så tar vi det manuellt.",
  },
  {
    q: "Vad händer med våra gamla batterier?",
    a: "Vi tar hand om dem utan kostnad. Blybatterier är miljöfarligt avfall med dokumentationsansvar för er som företag, och den biten löser vi.",
  },
]

const PUNKTER = [
  {
    titel: "Priserna står öppet",
    text: "Ni ser vad batteriet kostar utan att fylla i ett formulär och vänta på återkoppling. Fyra av sex konkurrenter gör det inte.",
  },
  {
    titel: "Ni pratar med oss som kan produkten",
    text: "Skriv maskinens fabrikat och modell i chatten så får ni svar direkt, dygnet runt. Behövs en människa svarar vi per mejl inom några timmar.",
  },
  {
    titel: "Offert på volym",
    text: "Ska ni byta hela flottan eller ha en stående leverans, hör av er så räknar vi.",
  },
  {
    titel: "Gratis återvinning",
    text: "Vi tar hand om de uttjänta batterierna utan kostnad.",
  },
]

export default function ForetagskundPage() {
  return (
    <>
      <script {...jsonLdProps(faqJsonLd(FRAGOR))} />
      <script
        {...jsonLdProps(
          breadcrumbJsonLd([
            { name: "Hem", path: "/" },
            { name: "Företagskund", path: "/foretagskund" },
          ])
        )}
      />
      <TopBar />
      <Header />
      <main id="innehall">
        <section className="mx-auto max-w-2xl px-5 py-12 sm:py-16">
          <h1 className="font-heading text-3xl font-bold leading-tight text-navy sm:text-4xl">
            Företagskund
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-text-mid">
            Batteriproffs säljer till företag, kommuner och myndigheter. Kassan är
            byggd för det och kräver organisationsnummer.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {PUNKTER.map((p) => (
              <div key={p.titel} className="rounded-xl border border-border bg-white p-5">
                <h2 className="font-heading font-bold text-navy">{p.titel}</h2>
                <p className="mt-1.5 leading-relaxed text-text-mid">{p.text}</p>
              </div>
            ))}
          </div>

          <section className="mt-12">
            <h2 className="font-heading text-2xl font-bold text-navy">Så beställer ni</h2>
            <ol className="mt-4 space-y-3">
              {[
                "Lägg batterierna i varukorgen. Priserna visas inklusive moms som standard, växla högst upp om ni hellre ser dem exklusive.",
                "I kassan fyller ni i organisationsnummer, referens och eventuellt ert eget ordernummer, så hamnar det på orderbekräftelsen.",
                "Betala med kort. Orderbekräftelsen mejlas direkt, och när batteriet skickas kommer ett spårningsmejl.",
                "Ordern finns kvar på ert konto, där ni kan följa status och beställa om samma batteri nästa gång.",
              ].map((t, i) => (
                <li key={i} className="flex gap-3 leading-relaxed text-text-dark">
                  <span
                    aria-hidden="true"
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-surface-alt font-heading text-xs font-bold text-navy"
                  >
                    {i + 1}
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ol>
          </section>

          <aside className="mt-10 rounded-2xl border border-border bg-surface/60 p-6">
            <h2 className="font-heading text-lg font-bold text-navy">
              Behöver ni något vi inte har på sajten?
            </h2>
            <p className="mt-2 leading-relaxed text-text-mid">
              Volympriser, en artikel som inte finns i sortimentet, eller andra
              betalvillkor. Hör av er så tar vi det direkt.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <ChattKnapp
                className="rounded-lg bg-navy px-5 py-2.5 font-heading text-sm font-bold text-white"
              >
                Chatta med oss
              </ChattKnapp>
              <a
                href={`mailto:${EMAIL}`}
                className="rounded-lg border border-border bg-white px-5 py-2.5 font-heading text-sm font-bold text-navy"
              >
                Begär offert
              </a>
            </div>
          </aside>

          <h2 className="mt-12 font-heading text-2xl font-bold text-navy">Vanliga frågor</h2>
          <dl className="mt-5 space-y-5">
            {FRAGOR.map((f) => (
              <div key={f.q}>
                <dt className="font-heading font-bold text-navy">{f.q}</dt>
                <dd className="mt-1.5 leading-relaxed text-text-dark">{f.a}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-8 text-sm text-text-light">
            Se även{" "}
            <Link href="/villkor" className="font-semibold text-accent hover:underline">
              köpvillkoren
            </Link>{" "}
            och{" "}
            <Link href="/atervinning" className="font-semibold text-accent hover:underline">
              hur återvinningen fungerar
            </Link>
            .
          </p>
        </section>
        <CtaBanner />
      </main>
      <Footer />
    </>
  )
}
