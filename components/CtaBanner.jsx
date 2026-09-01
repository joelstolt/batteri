"use client"

import { EMAIL } from "@/lib/constants"
import { MessageCircle } from "lucide-react"
import ChattKnapp from "@/components/ChattKnapp"

export default function CtaBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-navy to-navy-mid py-14">
      {/* Diagonal stripe texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,1) 20px, rgba(255,255,255,1) 21px)",
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-6 px-4 sm:px-6">
        <div>
          <h3 className="mb-1.5 font-heading text-[26px] font-extrabold text-white">
            Vet du inte vilket batteri som passar?
          </h3>
          <p className="max-w-lg text-base text-white/75">
            Berätta vilken maskin du har så hjälper vi dig hitta rätt — snabbt,
            enkelt och utan kostnad. Vi finns här mån–fre 08:00–17:00.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ChattKnapp
            className="flex items-center gap-2 rounded-[10px] bg-amber-bg px-7 py-3.5 font-heading text-[15px] font-bold text-navy transition-transform hover:-translate-y-px"
          >
            <MessageCircle size={16} />
            Chatta med oss
          </ChattKnapp>
          <a
            href={`mailto:${EMAIL}`}
            className="rounded-[10px] border border-white/20 px-7 py-3.5 text-[15px] font-semibold text-white transition-colors hover:border-white/40 hover:bg-white/4"
          >
            Skicka mejl
          </a>
        </div>
      </div>
    </section>
  )
}
