import Link from "next/link"
import BatteryFinder from "@/components/BatteryFinder"

export default function FinderSection() {
  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_380px] lg:gap-16 lg:py-20">
        <div>
          <div className="mb-3 text-xs font-bold uppercase tracking-widest text-amber">
            Osäker på vilket batteri?
          </div>
          <h2 className="mb-4 font-heading text-[clamp(24px,3.5vw,34px)] font-extrabold leading-tight tracking-tight text-text-dark">
            Två frågor, så vet du vilket batteri som passar
          </h2>
          <p className="max-w-md text-base leading-relaxed text-text-mid">
            Välj vad batteriet ska driva och vilken spänning maskinen kräver, så
            visar vi vad vi har som passar. Vet du inte spänningen ringer du oss,
            då reder vi ut det på en minut.
          </p>
          <Link
            href="/batteri-till"
            className="mt-5 inline-flex items-center gap-1.5 font-heading text-sm font-bold text-navy hover:underline"
          >
            Eller sök direkt på din maskin →
          </Link>
        </div>

        <div className="flex justify-center lg:justify-end">
          <BatteryFinder />
        </div>
      </div>
    </section>
  )
}
