import Link from "next/link"
import TopBar from "@/components/TopBar"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { CATEGORIES } from "@/lib/constants"
import ChattKnapp from "@/components/ChattKnapp"

export const metadata = {
  title: "Sidan hittades inte — Batteriproffs",
  robots: { index: false, follow: false },
}

export default function NotFound() {
  const categories = CATEGORIES.filter((c) => c.slug !== "alla")

  return (
    <>
      <TopBar />
      <Header />
      <main id="innehall">        <div className="bg-white">
          <div className="mx-auto max-w-[720px] px-4 py-20 text-center sm:px-6 sm:py-28">
            <div className="mb-3 font-heading text-sm font-bold uppercase tracking-widest text-amber-text">
              404
            </div>
            <h1 className="mb-4 font-heading text-[clamp(28px,4vw,40px)] font-extrabold tracking-tight text-text-dark">
              Sidan hittades inte
            </h1>
            <p className="mb-10 text-base leading-relaxed text-text-mid">
              Länken kan vara gammal, eller så har produkten utgått. Hittar du inte
              batteriet du letar efter hjälper vi dig gärna på telefon.
            </p>

            <div className="mb-10 grid gap-3 sm:grid-cols-2">
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/kategori/${c.slug}`}
                  className="rounded-xl border border-border bg-surface px-5 py-4 text-left transition-colors hover:border-navy/40"
                >
                  <div className="font-heading text-sm font-bold text-text-dark">{c.title}</div>
                  <div className="mt-0.5 text-xs text-text-mid">{c.desc}</div>
                </Link>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/"
                className="rounded-xl bg-navy px-6 py-3 font-heading text-sm font-bold text-white transition-colors hover:bg-navy-light"
              >
                Till startsidan
              </Link>
              <ChattKnapp
                className="rounded-xl border border-border px-6 py-3 font-heading text-sm font-bold text-text-dark transition-colors hover:bg-surface"
              >
                Chatta med oss
              </ChattKnapp>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
