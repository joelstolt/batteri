import Link from "next/link"
import { prisFor, artikelBySlug } from "@/lib/kunskap"
import { PHONE, PHONE_LINK } from "@/lib/constants"

/**
 * Renderar en kunskapsartikel.
 *
 * Serverkomponent med flit: texten är statisk och behöver ingen interaktivitet,
 * och då ska den inte kosta en enda kilobyte JavaScript hos besökaren.
 *
 * Priser slås upp vid rendering via prisFor(). Utgår en produkt ur sortimentet
 * försvinner raden i stället för att visa ett pris som inte finns.
 */
export default function KunskapArtikel({ artikel }) {
  return (
    <article className="mx-auto max-w-2xl px-5 py-12 sm:py-16">
      <nav aria-label="Brödsmulor" className="text-sm text-text-light">
        <Link href="/" className="hover:text-navy">
          Hem
        </Link>
        <span className="mx-1.5">/</span>
        <Link href="/kunskap" className="hover:text-navy">
          Kunskapsbank
        </Link>
      </nav>

      <h1 className="mt-4 font-heading text-3xl font-bold leading-tight text-navy sm:text-4xl">
        {artikel.title}
      </h1>

      <p className="mt-4 text-lg leading-relaxed text-text-mid">{artikel.ingress}</p>

      <p className="mt-4 text-sm text-text-light">
        {artikel.lastid} min läsning · Uppdaterad{" "}
        <time dateTime={artikel.uppdaterad}>
          {new Date(artikel.uppdaterad).toLocaleDateString("sv-SE", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      </p>

      <div className="mt-10 space-y-10">
        {artikel.sektioner.map((s, i) => (
          <section key={i}>
            <h2 className="font-heading text-xl font-bold text-navy">{s.rubrik}</h2>

            {s.stycken?.map((p, n) => (
              <p key={n} className="mt-3 leading-relaxed text-text-dark">
                {p}
              </p>
            ))}

            {s.punkter && (
              <ul className="mt-4 space-y-2.5">
                {s.punkter.map((p, n) => (
                  <li key={n} className="flex gap-3 leading-relaxed text-text-dark">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-bg" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            )}

            {s.prislista && <Prislista rader={s.prislista} />}

            {s.lank && (
              <p className="mt-4">
                <Link
                  href={s.lank.href}
                  className="font-heading font-bold text-accent hover:underline"
                >
                  {s.lank.text} →
                </Link>
              </p>
            )}
          </section>
        ))}
      </div>

      <aside className="mt-12 rounded-2xl border border-border bg-surface/60 p-6">
        <h2 className="font-heading text-lg font-bold text-navy">Osäker på vilket du behöver?</h2>
        <p className="mt-2 leading-relaxed text-text-mid">
          Ring med maskinens fabrikat och modell, plus spänning och kapacitet på batteriet
          som sitter i nu, så tar vi fram rätt batteri. Vi svarar själva i telefonen.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={`tel:${PHONE_LINK}`}
            className="rounded-lg bg-navy px-5 py-2.5 font-heading text-sm font-bold text-white"
          >
            Ring {PHONE}
          </a>
          <Link
            href="/batteri-till"
            className="rounded-lg border border-border bg-white px-5 py-2.5 font-heading text-sm font-bold text-navy"
          >
            Hitta batteri till din maskin
          </Link>
        </div>
      </aside>

      {artikel.relaterade?.length > 0 && (
        <section className="mt-12 border-t border-border pt-8">
          <h2 className="font-heading text-lg font-bold text-navy">Läs vidare</h2>
          <ul className="mt-4 space-y-3">
            {artikel.relaterade.map((slug) => {
              const a = artikelBySlug(slug)
              if (!a) return null
              return (
                <li key={slug}>
                  <Link href={`/kunskap/${a.slug}`} className="group block">
                    <span className="font-heading font-bold text-navy group-hover:text-accent">
                      {a.title}
                    </span>
                    <span className="mt-0.5 block text-sm leading-relaxed text-text-light">
                      {a.ingress.slice(0, 110)}…
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      )}
    </article>
  )
}

function Prislista({ rader }) {
  const synliga = rader
    .map((r) => ({ ...r, pris: prisFor(r.slug) }))
    .filter((r) => r.pris)

  if (!synliga.length) return null

  return (
    <div className="mt-5 overflow-hidden rounded-xl border border-border">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">Priser inklusive moms</caption>
        <tbody>
          {synliga.map((r) => (
            <tr key={r.slug} className="border-b border-border last:border-0">
              <td className="px-4 py-3">
                <Link href={`/produkt/${r.slug}`} className="font-semibold text-navy hover:text-accent">
                  {r.vad}
                </Link>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-right font-heading font-bold text-navy">
                {r.pris}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="border-t border-border bg-surface/60 px-4 py-2.5 text-xs text-text-light">
        Priser inkl. moms. Frakt 695 kr tillkommer.
      </p>
    </div>
  )
}
