"use client"

import { useEffect } from "react"
import { track } from "@/lib/track"

/**
 * Tre mätpunkter via en enda delegerad lyssnare.
 *
 * Alternativet var att lägga onClick i ProductCard, MachinePageContent,
 * ProductPageContent, Header, TopBar, BatteryFinder och ContactContent. Sju
 * filer, sju ställen att glömma nästa gång någon lägger till en telefonlänk.
 * Här fångas allt på ett ställe och nya länkar mäts automatiskt.
 *
 * Lyssnaren ligger i CAPTURE-fasen med flit. Ligger den i bubbelfasen tappas
 * klicket så fort någon komponent på vägen upp anropar stopPropagation, och då
 * uteblir eventet tyst.
 *
 * Vad som mäts och varför:
 *
 * - telefonklick        B2B-köpare ringer hellre än skriver. Utan det här syns
 *                       inte ett enda av de samtalen i statistiken, och sidan
 *                       som fick dem att lyfta luren ser ut att inte konvertera.
 * - maskinsida-produkt  Konverterar maskinklustret eller läser folk bara? Det
 *                       är frågan som avgör om fler maskinsidor ska byggas.
 * - laddarklick         Kunden som just köpt batteri och funderar på laddare.
 *                       SRVAB gjorde exakt det 2026-08-06 och det syntes bara
 *                       för att sessionen lästes för hand.
 */
export default function KlickSparning() {
  useEffect(() => {
    const vidKlick = (e) => {
      const a = e.target?.closest?.("a[href]")
      if (!a) return

      const href = a.getAttribute("href") || ""
      const sida = window.location.pathname

      if (href.startsWith("tel:")) {
        track("telefonklick", { sida })
        return
      }

      // Bara interna länkar är intressanta härifrån och ned
      if (!href.startsWith("/")) return

      if (sida.startsWith("/batteri-till/") && href.startsWith("/produkt/")) {
        track("maskinsida-produktklick", {
          maskin: sida.replace("/batteri-till/", ""),
          produkt: href.replace("/produkt/", ""),
        })
        return
      }

      if (href.startsWith("/laddare") && sida.startsWith("/produkt/")) {
        track("laddarklick", { fran: sida.replace("/produkt/", "") })
      }
    }

    document.addEventListener("click", vidKlick, true)
    return () => document.removeEventListener("click", vidKlick, true)
  }, [])

  return null
}
