import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRight, ArrowRight, Phone, Ruler } from "lucide-react"
import { replacements, replacementBySlug } from "@/lib/replacements"
import { getProductImage } from "@/lib/products"
import { SITE_URL, PHONE, PHONE_LINK } from "@/lib/constants"
import TopBar from "@/components/TopBar"
import Header from "@/components/Header"
import ProductCard from "@/components/ProductCard"
import CtaBanner from "@/components/CtaBanner"
import Footer from "@/components/Footer"

export async function generateStaticParams() {
  return replacements.map((r) => ({ slug: r.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const r = replacementBySlug(slug)
  if (!r) return { title: "Sidan hittades inte — Batteriproffs" }

  const title = `Ersättning för ${r.original} — ${r.product.shortName} | Batteriproffs`
  const description = `Söker du ${r.original}? ${r.product.name} ersätter den direkt. ${r.product.voltage} ${r.product.capacity}, ${r.product.price} kr inkl. moms. Snabb leverans i hela Sverige.`

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/ersatter/${slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/ersatter/${slug}`,
      siteName: "Batteriproffs",
      locale: "sv_SE",
      type: "website",
      images: [{ url: `${SITE_URL}${getProductImage(r.product)}` }],
    },
  }
}

export default async function ReplacementRoute({ params }) {
  const { slug } = await params
  const r = replacementBySlug(slug)
  if (!r) notFound()

  const p = r.product
  const specs = Object.entries(p.specs || {}).filter(([k]) => k !== "Ersätter")

  return (
    <>
      <TopBar />
      <Header />
      <main id="innehall">
        <div className="bg-white">
          <div className="border-b border-border bg-surface">
            <div className="mx-auto max-w-[1200px] px-4 pb-10 pt-8 sm:px-6">
              <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-xs text-text-mid">
                <Link href="/" className="hover:text-text-dark">Hem</Link>
                <ChevronRight size={13} className="text-text-light" />
                <span className="text-text-dark">Ersättning för {r.original}</span>
              </nav>

              <div className="mb-2 text-xs font-bold uppercase tracking-widest text-amber-text">
                Direkt ersättare
              </div>
              <h1 className="mb-4 max-w-3xl font-heading text-[clamp(26px,4vw,38px)] font-extrabold leading-tight tracking-tight text-text-dark">
                Ersättning för {r.original}
              </h1>

              {/* Själva svaret, högst upp — det är det enda besökaren kom hit för */}
              <div className="flex max-w-2xl flex-wrap items-center gap-3 rounded-xl border border-border bg-white p-5">
                <span className="font-heading text-base font-bold text-text-mid">{r.original}</span>
                <ArrowRight size={18} className="text-amber" />
                <Link
                  href={`/produkt/${p.slug}`}
                  className="font-heading text-base font-extrabold text-navy hover:underline"
                >
                  {p.name}
                </Link>
              </div>

              <p className="mt-5 max-w-2xl text-base leading-relaxed text-text-mid">
                {p.name} ersätter {r.original} direkt. Kontrollera batterifackets mått och
                polernas placering mot specifikationen nedan innan du beställer — är du osäker
                ringer du oss så bekräftar vi passformen.
              </p>
            </div>
          </div>

          <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6">
            <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <Ruler size={18} className="text-navy" />
                  <h2 className="font-heading text-xl font-bold text-text-dark">
                    Specifikation för {p.shortName}
                  </h2>
                </div>

                <div className="overflow-hidden rounded-xl border border-border">
                  <table className="w-full text-sm">
                    <tbody>
                      {specs.map(([k, v], i) => (
                        <tr key={k} className={i % 2 ? "bg-surface" : "bg-white"}>
                          <td className="w-1/2 px-5 py-3 text-text-mid">{k}</td>
                          <td className="px-5 py-3 font-medium text-text-dark">{v}</td>
                        </tr>
                      ))}
                      <tr className={specs.length % 2 ? "bg-surface" : "bg-white"}>
                        <td className="px-5 py-3 text-text-mid">Ersätter</td>
                        <td className="px-5 py-3 font-medium text-text-dark">{r.original}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {p.fitsTo && (
                  <div className="mt-6 rounded-xl border border-border bg-surface p-5">
                    <h3 className="mb-2 font-heading text-sm font-bold uppercase tracking-wider text-text-dark">
                      Passar till
                    </h3>
                    <p className="text-sm leading-relaxed text-text-mid">{p.fitsTo}</p>
                  </div>
                )}

                <div className="mt-6 rounded-xl border border-border bg-surface p-5">
                  <h3 className="mb-2 font-heading text-sm font-bold uppercase tracking-wider text-text-dark">
                    Byt hela uppsättningen
                  </h3>
                  <p className="text-sm leading-relaxed text-text-mid">
                    Sitter batteriet i ett seriekopplat paket ska alla batterier bytas samtidigt.
                    Ett nytt batteri tillsammans med gamla åldras i takt med de gamla, och då
                    försvinner halva besparingen. Räkna antalet batterier i maskinen och beställ
                    hela uppsättningen.
                  </p>
                </div>

                <a
                  href={`tel:${PHONE_LINK}`}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-navy px-5 py-3 font-heading text-sm font-bold text-white transition-colors hover:bg-navy-light"
                >
                  <Phone size={15} />
                  Osäker på passformen? Ring {PHONE}
                </a>
              </div>

              <div>
                <ProductCard product={p} />
              </div>
            </div>
          </div>
        </div>

        <CtaBanner />
      </main>
      <Footer />
    </>
  )
}
