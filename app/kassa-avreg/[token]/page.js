import Link from "next/link"
import { notFound } from "next/navigation"
import { lasAvregToken } from "@/lib/konto-auth"
import { avregistrera } from "@/lib/kassa-paminnelse"

/**
 * Avregistrering från kassepåminnelser, ett klick från mejlet.
 *
 * Avregistreringen skrivs direkt när sidan öppnas, utan bekräftelseknapp.
 * Kravet är att det ska vara enkelt att slippa posten, inte att vi ska få en
 * chans att övertala. Länkförhandsvisning i vissa mejlklienter kan därför
 * utlösa den i förtid, och det är ett medvetet val: en avregistrering för
 * mycket är ett mindre problem än ett mejl för mycket.
 */

export const metadata = {
  title: "Avregistrerad",
  robots: { index: false, follow: false },
}

export const dynamic = "force-dynamic"

export default async function KassaAvregPage({ params }) {
  const { token } = await params
  const epost = lasAvregToken(token)
  if (!epost) notFound()

  let ok = true
  try {
    await avregistrera(epost)
  } catch (err) {
    console.error("Avregistrering misslyckades:", err)
    ok = false
  }

  return (
    <section className="mx-auto max-w-lg px-5 py-20 text-center">
      <h1 className="font-heading text-2xl font-bold text-navy">
        {ok ? "Då hör du inget mer" : "Något gick fel"}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-text-mid">
        {ok ? (
          <>
            Vi skickar inga fler påminnelser om varukorgar till{" "}
            <strong className="text-text-dark">{epost}</strong>. Orderbekräftelser
            och leveransbesked på köp du gör påverkas inte.
          </>
        ) : (
          <>
            Avregistreringen kunde inte sparas. Mejla{" "}
            <a href="mailto:info@batteriproffs.se" className="underline">
              info@batteriproffs.se
            </a>{" "}
            så fixar vi det för hand.
          </>
        )}
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-lg bg-navy px-5 py-3 text-sm font-bold text-white"
      >
        Till startsidan
      </Link>
    </section>
  )
}
