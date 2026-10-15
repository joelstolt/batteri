"use client"

import { useRouter } from "next/navigation"
import { oppnaChatt } from "@/components/ChattKnapp"

/**
 * Hjälpväg under sökträffar och vid noll träffar. Den som söker på en maskin
 * vi inte har en sida för har redan bestämt sig, så vi erbjuder en människa
 * i stället för att låta sökningen sluta blint.
 *
 * /kontakt och inte /offert: offertsidan kräver artiklar i varukorgen och går
 * inte att skicka tom.
 */
export default function SokHjalp({ onKlar, className = "" }) {
  const router = useRouter()
  return (
    <div
      className={`bg-surface px-4 py-3 text-sm leading-relaxed text-text-mid ${className}`}
    >
      <strong className="text-text-dark">Hittar du inte din maskin?</strong>{" "}
      Skicka modellen så letar vi rätt batteri.{" "}
      <button
        type="button"
        onClick={() => {
          onKlar?.()
          if (!oppnaChatt()) router.push("/kontakt")
        }}
        className="font-semibold text-navy hover:underline"
      >
        Chatta med oss
      </button>{" "}
      eller{" "}
      <button
        type="button"
        onClick={() => {
          onKlar?.()
          router.push("/kontakt")
        }}
        className="font-semibold text-navy hover:underline"
      >
        skicka modellnumret
      </button>
      .
    </div>
  )
}
