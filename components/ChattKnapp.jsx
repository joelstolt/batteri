"use client"
import { useRouter } from "next/navigation"

/**
 * Sajtens "Chatta med oss"-knapp. Ersätter de gamla ring-CTA:erna: telefonen
 * är nedtonad tills verksamheten kan bemannas på heltid, chatten (AI +
 * mejl-eskalering) är den kanal som alltid kan svara.
 *
 * Öppnar chatbot-widgetens panel. Widgeten laddas lazy efter sidladdningen,
 * så om någon klickar innan den finns (eller om skriptet blockerats) går
 * klicket till kontaktsidan i stället — knappen får aldrig vara död.
 */
export function oppnaChatt() {
  const knapp = document
    .querySelector("chatbot-widget")
    ?.shadowRoot?.querySelector(".launcher")
  if (!knapp) return false
  knapp.click()
  return true
}

export default function ChattKnapp({ className, children }) {
  const router = useRouter()
  return (
    <button
      type="button"
      onClick={() => {
        if (!oppnaChatt()) router.push("/kontakt")
      }}
      className={`text-left ${className ?? ""}`}
    >
      {children ?? "Chatta med oss"}
    </button>
  )
}
