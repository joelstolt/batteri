import { Quote } from "lucide-react"
import { godkandaReferenser } from "@/lib/references"

/**
 * Kundreferenser. Renderas bara när minst en person godkänt sin text —
 * en tom sektion är sämre än ingen sektion.
 */
export default function References() {
  if (godkandaReferenser.length === 0) return null

  return (
    <section className="border-b border-border bg-surface">
      <div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 sm:py-16">
        <div className="mb-8">
          <div className="mb-2 text-xs font-bold uppercase tracking-widest text-amber-text">
            Referenser
          </div>
          <h2 className="font-heading text-[clamp(22px,3vw,30px)] font-extrabold tracking-tight text-text-dark">
            Vad kunderna säger
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {godkandaReferenser.map((r) => (
            <figure
              key={r.namn}
              className="flex flex-col rounded-2xl border border-border bg-white p-6"
            >
              <Quote size={20} className="mb-3 text-amber-text" aria-hidden="true" />
              <blockquote className="flex-1 text-[15px] leading-relaxed text-text-dark">
                {r.citat}
              </blockquote>
              <figcaption className="mt-4 border-t border-border pt-4 text-sm">
                <span className="font-heading font-bold text-text-dark">{r.namn}</span>
                {r.titel && <span className="ml-2 text-text-mid">{r.titel}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
