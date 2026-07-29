import Link from "next/link"
import { artiklar } from "@/lib/kunskap"
import { breadcrumbJsonLd, jsonLdProps } from "@/lib/schema"
import { pageMeta } from "@/lib/seo"
import TopBar from "@/components/TopBar"
import Header from "@/components/Header"
import CtaBanner from "@/components/CtaBanner"
import Footer from "@/components/Footer"

export const metadata = pageMeta({
  path: "/kunskap",
  title: "Kunskapsbank — guider om traktions- och truckbatterier | Batteriproffs",
  description:
    "Vad kostar ett truckbatteri, skillnaden mot startbatteri, och gel eller öppet blybatteri. Raka svar från oss som säljer dem, med priser utskrivna.",
})

export default function KunskapPage() {
  return (
    <>
      <script
        {...jsonLdProps(
          breadcrumbJsonLd([
            { name: "Hem", path: "/" },
            { name: "Kunskapsbank", path: "/kunskap" },
          ])
        )}
      />
      <TopBar />
      <Header />
      <main id="innehall">
        <section className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
          <h1 className="font-heading text-3xl font-bold text-navy sm:text-4xl">Kunskapsbank</h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-text-mid">
            Raka svar på de frågor vi får i telefon, med priserna utskrivna. Hittar du
            inte svaret här ringer du oss, så tar vi det direkt.
          </p>

          <ul className="mt-10 space-y-4">
            {artiklar.map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/kunskap/${a.slug}`}
                  className="group block rounded-xl border border-border bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-border-dark hover:shadow-lg"
                >
                  <h2 className="font-heading text-lg font-bold text-navy group-hover:text-accent">
                    {a.title}
                  </h2>
                  <p className="mt-2 leading-relaxed text-text-mid">{a.ingress}</p>
                  <p className="mt-3 text-sm text-text-light">{a.lastid} min läsning</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <CtaBanner />
      </main>
      <Footer />
    </>
  )
}
