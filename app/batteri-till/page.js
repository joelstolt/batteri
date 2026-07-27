import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { machines, machinesByGroup, MACHINE_GROUPS } from "@/lib/machines"
import { publicProducts } from "@/lib/products"
import { SITE_URL, PHONE, PHONE_LINK } from "@/lib/constants"
import TopBar from "@/components/TopBar"
import Header from "@/components/Header"
import CtaBanner from "@/components/CtaBanner"
import Footer from "@/components/Footer"

const title = "Batteri till din maskin — hitta rätt batteri per modell | Batteriproffs"
const description =
  "Hitta batteriet som passar din städmaskin, lift, golfbil eller pallyftare. Nilfisk, Hako, Kärcher, JLG, Genie, Club Car och fler — med pris och lagerstatus."

export const metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_URL}/batteri-till` },
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/batteri-till`,
    siteName: "Batteriproffs",
    locale: "sv_SE",
    type: "website",
  },
}

function priceFrom(machine) {
  const prices = machine.products
    .map((s) => publicProducts.find((p) => p.slug === s)?.price)
    .filter(Boolean)
  return prices.length ? Math.min(...prices) : null
}

export default function MachineHubPage() {
  return (
    <>
      <TopBar />
      <Header />
      <main id="innehall">
        <div className="bg-white">
          <div className="border-b border-border bg-surface">
            <div className="mx-auto max-w-[1200px] px-4 pb-10 pt-8 sm:px-6">
              <nav className="mb-5 flex items-center gap-1.5 text-xs text-text-mid">
                <Link href="/" className="hover:text-text-dark">Hem</Link>
                <ChevronRight size={13} className="text-text-light" />
                <span className="text-text-dark">Batteri till maskin</span>
              </nav>

              <div className="mb-2 text-xs font-bold uppercase tracking-widest text-amber-text">
                Hitta rätt batteri
              </div>
              <h1 className="mb-4 max-w-3xl font-heading text-[clamp(26px,4vw,38px)] font-extrabold leading-tight tracking-tight text-text-dark">
                Batteri till din maskin
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-text-mid">
                Sök på maskinen i stället för på batteriet. Vi har listat de modeller vi får
                flest frågor om, med pris och lagerstatus på de batterier som passar. Står inte
                din maskin med, ring {PHONE} med modellbeteckningen så tar vi fram rätt paket.
              </p>
            </div>
          </div>

          <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6">
            {MACHINE_GROUPS.map((group) => {
              const list = machinesByGroup(group.id)
              if (list.length === 0) return null

              return (
                <section key={group.id} className="mb-12 last:mb-0">
                  <h2 className="mb-5 font-heading text-xl font-bold text-text-dark">
                    {group.label}
                    <span className="ml-2 text-sm font-medium text-text-light">
                      {list.length} modeller
                    </span>
                  </h2>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {list.map((m) => {
                      const from = priceFrom(m)
                      return (
                        <Link
                          key={m.slug}
                          href={`/batteri-till/${m.slug}`}
                          className="group flex items-start justify-between gap-3 rounded-xl border border-border bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-navy/40 hover:shadow-sm"
                        >
                          <div className="min-w-0">
                            <div className="font-heading text-sm font-bold text-text-dark">
                              {m.name}
                            </div>
                            <div className="mt-0.5 text-xs text-text-mid">{m.type}</div>
                            {from && (
                              <div className="mt-2 text-xs font-semibold text-text-dark">
                                Från {new Intl.NumberFormat("sv-SE").format(from)} kr
                                <span className="ml-1 font-normal text-text-light">inkl. moms</span>
                              </div>
                            )}
                          </div>
                          <ChevronRight
                            size={16}
                            className="mt-0.5 flex-shrink-0 text-text-light transition-transform group-hover:translate-x-0.5"
                          />
                        </Link>
                      )
                    })}
                  </div>
                </section>
              )
            })}

            <div className="mt-4 rounded-2xl border border-border bg-surface p-6 text-center">
              <div className="mb-2 font-heading text-lg font-bold text-text-dark">
                Din maskin saknas i listan?
              </div>
              <p className="mx-auto mb-5 max-w-xl text-sm leading-relaxed text-text-mid">
                Vi har fler batterier i lager än vad som listas här. Ring med maskinens
                modellbeteckning och märkspänning, eller fotografera etiketten på batteriet som
                sitter i nu, så hittar vi en direkt ersättare.
              </p>
              <a
                href={`tel:${PHONE_LINK}`}
                className="inline-flex items-center gap-2 rounded-xl bg-navy px-6 py-3 font-heading text-sm font-bold text-white transition-colors hover:bg-navy-light"
              >
                Ring {PHONE}
              </a>
            </div>
          </div>
        </div>

        <CtaBanner />
      </main>
      <Footer />
    </>
  )
}
