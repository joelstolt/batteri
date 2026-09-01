import Link from "next/link"
import { publicProducts } from "@/lib/products"

/**
 * "Kunder om oss" på startsidan — riktiga, verifierade omdömen, nyast först.
 *
 * Ärlig presentation med flit: varje omdöme länkar till produkten det gäller,
 * och MFL 12 c §-raden om hur de samlas in står med. Sektionen renderas inte
 * alls utan data.
 *
 * Snittet med antal visas först från tre omdömen. Under det säger raden
 * "5.0 av 5 · 1 omdöme" mer om räknaren än om kunderna och läses lätt som
 * "de har sålt ett batteri". Rubriken säger i stället precis vad det är:
 * det senaste omdömet. Antalet finns alltid på produktsidan, där det hör
 * hemma intill omdömena.
 */
function Stjarnor({ betyg }) {
  return (
    <span className="flex gap-0.5" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} width="16" height="16" viewBox="0 0 20 20" fill="currentColor" className={n <= betyg ? "text-amber-bg" : "text-border-dark"}>
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z" />
        </svg>
      ))}
    </span>
  )
}

export default function SenasteOmdomen({ omdomen }) {
  if (!omdomen?.length) return null
  const visa = omdomen.slice(0, 3)
  const snitt = Math.round((omdomen.reduce((s, o) => s + o.betyg, 0) / omdomen.length) * 10) / 10
  const visaSnitt = omdomen.length >= 3
  const rubrik =
    omdomen.length === 1 ? "Senaste omdömet" : omdomen.length < 3 ? "Senaste omdömena" : "Kunder om oss"

  return (
    <section className="border-b border-border bg-white" aria-labelledby="kunder-rubrik">
      <div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 sm:py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-2 text-xs font-bold uppercase tracking-widest text-amber-text">
              Verifierade köp
            </div>
            <h2 id="kunder-rubrik" className="font-heading text-[clamp(22px,3vw,30px)] font-extrabold tracking-tight text-text-dark">
              {rubrik}
            </h2>
          </div>
          {visaSnitt && (
            <div className="flex items-center gap-2 text-sm text-text-mid">
              <Stjarnor betyg={Math.round(snitt)} />
              <span className="font-semibold text-text-dark">{snitt.toFixed(1)}</span>
              <span>av 5 · {omdomen.length} omdömen</span>
            </div>
          )}
        </div>

        <div className={visa.length === 1 ? "max-w-[520px]" : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"}>
          {visa.map((o, i) => {
            const produkt = publicProducts.find((p) => p.slug === o.slug)
            return (
              <article key={`${o.piId}-${o.slug}-${i}`} className="flex flex-col rounded-2xl border border-border bg-surface/60 p-6">
                <div className="flex items-center gap-2">
                  <Stjarnor betyg={o.betyg} />
                  <span className="rounded-md bg-green/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-green">
                    Verifierat köp
                  </span>
                </div>
                {o.text ? (
                  <p className="mt-3 flex-1 text-[15px] leading-relaxed text-text-dark">{o.text}</p>
                ) : (
                  <p className="mt-3 flex-1 text-sm text-text-mid">
                    {o.betyg} av 5 stjärnor, utan kommentar.
                  </p>
                )}
                <div className="mt-4 border-t border-border pt-4 text-sm">
                  <span className="font-heading font-bold text-text-dark">{o.namn || "Anonym kund"}</span>
                  <span className="text-text-light">
                    {" · "}
                    {new Date(o.datum * 1000).toLocaleDateString("sv-SE", { year: "numeric", month: "long" })}
                  </span>
                  {produkt && (
                    <div className="mt-1">
                      <Link href={`/produkt/${produkt.slug}`} className="text-navy underline underline-offset-2 hover:text-amber-text">
                        {produkt.shortName}
                      </Link>
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </div>

        <p className="mt-6 text-xs leading-relaxed text-text-light">
          Bara kunder som köpt hos oss kan lämna omdöme: inbjudan mejlas efter
          leverans till adressen som användes vid köpet, och varje omdöme granskas
          manuellt innan det publiceras. Vi ändrar aldrig i texterna.
        </p>
      </div>
    </section>
  )
}
