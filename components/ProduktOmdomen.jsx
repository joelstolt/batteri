import { sammanfatta } from "@/lib/omdomen"

/**
 * Omdömen på produktsidan.
 *
 * Serverkomponent. Texten måste ligga i råmarkeringen — renderas den i
 * webbläsaren ser varken Google eller AI-botarna den, och då är hela poängen
 * borta. Samma regel som gäller JSON-LD på den här sajten.
 *
 * Ingen "skriv omdöme"-knapp här. Omdömen lämnas inifrån kundkontot, på en
 * artikel man faktiskt köpt, och det är just den kopplingen som gör dem värda
 * något.
 */
export default function ProduktOmdomen({ omdomen }) {
  const sum = sammanfatta(omdomen)
  if (!sum) return null

  return (
    <section className="mx-auto max-w-3xl px-5 py-10" aria-labelledby="omdomen-rubrik">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 id="omdomen-rubrik" className="font-heading text-xl font-bold text-navy">
          Omdömen
        </h2>
        <p className="text-sm text-text-mid">
          <Stjarnor betyg={sum.snitt} />{" "}
          <span className="font-semibold text-text-dark">{sum.snitt.toFixed(1)}</span> av 5 ·{" "}
          {sum.antal} {sum.antal === 1 ? "omdöme" : "omdömen"}
        </p>
      </div>

      <p className="mt-1.5 text-sm text-text-light">
        Bara kunder som köpt artikeln hos oss kan lämna omdöme.
      </p>

      <ul className="mt-6 space-y-4">
        {omdomen.map((o, i) => (
          <li key={`${o.piId}-${o.slug}-${i}`} className="rounded-xl border border-border bg-white p-5">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <Stjarnor betyg={o.betyg} />
              <span className="font-heading text-sm font-bold text-navy">
                {o.namn || "Anonym kund"}
              </span>
              <span className="rounded-md bg-green/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-green">
                Verifierat köp
              </span>
              <time
                dateTime={new Date(o.datum * 1000).toISOString().slice(0, 10)}
                className="text-sm text-text-light"
              >
                {new Date(o.datum * 1000).toLocaleDateString("sv-SE", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
            {o.text && <p className="mt-2.5 leading-relaxed text-text-dark">{o.text}</p>}
          </li>
        ))}
      </ul>
    </section>
  )
}

/**
 * Stjärnor.
 *
 * Halva stjärnor ritas inte. Ett snitt på 4,3 visas som fyra fyllda stjärnor
 * plus siffran bredvid, aldrig avrundat uppåt till fem. Grannen i branschen
 * märker upp femma på sidor som innehåller ettor, och det är där de blir
 * påkomna.
 */
function Stjarnor({ betyg }) {
  const fyllda = Math.floor(betyg)
  return (
    <span className="inline-flex align-middle" role="img" aria-label={`${betyg} av 5 i betyg`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          width="15"
          height="15"
          viewBox="0 0 20 20"
          aria-hidden="true"
          className={n <= fyllda ? "text-amber-bg" : "text-border-dark"}
          fill="currentColor"
        >
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z" />
        </svg>
      ))}
    </span>
  )
}
