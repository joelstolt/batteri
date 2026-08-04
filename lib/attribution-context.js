"use client"

import { createContext, useCallback, useContext, useEffect, useRef } from "react"
import { lasKallsignaler } from "./attribution"

const AttributionContext = createContext(null)

/**
 * Fångar var besökaren kom ifrån, en gång per sidladdning.
 *
 * Ligger i rot-layouten och monteras därför på den FÖRSTA sidan besökaren
 * landar på. Sedan överlever den all klientnavigering inom sajten, så när
 * kunden till slut står i kassan är det fortfarande landningssidan och den
 * externa referrern som ligger i minnet. Det är precis det man vill veta:
 * första kontakten, inte att hon klickade sig dit från varukorgen.
 *
 * Värdet ligger i en ref och inte i state, eftersom ingenting i gränssnittet
 * ska rendera om när det sätts. Det läses en enda gång, när kassan skickas in.
 *
 * Gränsen: laddar kunden om sidan mitt i besöket monteras providern på nytt
 * och referrern står då som vår egen domän. Det är ärligt märkt som
 * "Egen sajt (sidan laddades om)" i stället för att gissa.
 */
export function AttributionProvider({ children }) {
  const kallan = useRef(null)

  useEffect(() => {
    // Effekten körs två gånger i StrictMode. Första fångsten vinner.
    if (kallan.current) return
    kallan.current = lasKallsignaler(document.referrer, window.location)
  }, [])

  return <AttributionContext.Provider value={kallan}>{children}</AttributionContext.Provider>
}

/**
 * @returns {() => object|null} hämtare som läser källan vid anropstillfället.
 *   Anropa den när formuläret skickas, aldrig under render — refen är tom
 *   fram tills effekten ovan har kört.
 */
export function useAttribution() {
  const ref = useContext(AttributionContext)
  return useCallback(() => ref?.current || null, [ref])
}
