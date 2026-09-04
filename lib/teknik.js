/**
 * Teknisk data som INTE står på produktsidan idag.
 *
 * Bakgrunden: 2026-08-06 hade en kund precis installerat två EV31A-A och
 * frågade vilket läge han skulle köra sin laddare i. Svaret krävde att Joel
 * letade upp laddtabellen i Discovers manual åt honom. Den sortens fråga ska
 * kunden kunna svara på själv, från produktsidan, innan hon köper.
 *
 * Datan renderas som text på sidan i stället för att länkas som PDF. En PDF
 * rankar dåligt, är osynlig för AI-assistenter och kräver nedladdning i
 * mobilen, vilket är där den första ordern lades.
 *
 * KÄLLA, och den får inte glida:
 * Discover, "DRY CELL Traction Industrial Operating Manual", Table 1 (sid 8),
 * Table 4 (sid 10) och avsnitt 4.3 och 4.4.
 * https://assets.discoverbattery.com/documents/dry_cell_industrial/opm-dry-cell-industrial-operating-manual.pdf
 *
 * SONNENSCHEIN, tillagt 2026-08-06 (GF-V, sex av åtta artiklar):
 * "Gel Sonnenschein Light Traction, Technical data sheet, GF-V types" samt
 * "Gebrauchsanweisung GF-Y, GF-V, FF, FT, AS, AF-X", båda från exidegroup.com.
 * Exide blockerar automatisk hämtning, dokumenten togs via webbläsaren.
 *
 * 2026-09-05: Nordmax och GF-Y har publika datablad, nu länkade i
 * product-evidence.js. De är inte samma laddningsunderlag som GF-V.
 * Discover-vikter från andra pol-/modellvarianter har tagits bort.
 *
 * Skriv ALDRIG in gissade siffror här för att fylla ut. Saknas data för ett
 * varumärke returneras null och sektionen renderas inte alls.
 *
 * OBSERVERA skillnaden mellan tillverkarna: Discover FÖRBJUDER utjämningsladdning
 * rakt av, Exide tillåter den men bara med laddare de själva godkänt. Slå inte
 * ihop dem till en gemensam formulering.
 */

const DISCOVER_MANUAL =
  "https://assets.discoverbattery.com/documents/dry_cell_industrial/opm-dry-cell-industrial-operating-manual.pdf"

/**
 * Table 1: spänningsreglerad laddning (IUU) vid 25 °C, per batteri.
 * [bulk och absorption, float]
 */
const DISCOVER_LADD = {
  "6V": [7.4, 6.8],
  "8V": [9.8, 9.1],
  "12V": [14.7, 13.6],
}

/** Table 4: lägsta spänning vid 80 % urladdningsdjup, det Discover rekommenderar. */
const DISCOVER_LVD_80 = {
  "6V": 5.7,
  "8V": 7.6,
  "12V": 11.4,
}

/** C20-kapaciteten som ett tal. "120 Ah (C20)" och "76 Ah (C5) / 83 Ah (C20)". */
function c20(capacity) {
  const s = String(capacity || "")
  const m = s.match(/(\d+)\s*Ah\s*\(C20\)/i) || s.match(/(\d+)\s*Ah/i)
  return m ? Number(m[1]) : null
}

/** Snyggt svenskt decimaltal: 14.7 blir "14,7". */
function tal(n) {
  return String(n).replace(".", ",")
}

/**
 * Tekniska rader för en produkt, eller null när vi saknar belagd data.
 *
 * Allt utom vikten härleds ur tillverkarens tabeller, så en ändrad kapacitet i
 * produktdatan slår igenom här av sig själv i stället för att bli en siffra som
 * halkar efter.
 */
export function teknikFor(product) {
  if (!product) return null
  const mark = product.specs?.["Varumärke"] || ""
  if (mark === "Sonnenschein") return sonnenscheinTeknik(product)
  if (mark !== "Discover") return null

  const v = product.voltage
  const ladd = DISCOVER_LADD[v]
  const lvd = DISCOVER_LVD_80[v]
  const ah = c20(product.capacity)
  if (!ladd || !ah) return null

  const rader = [
    {
      label: "Laddspänning",
      value: `${tal(ladd[0])} V absorption, ${tal(ladd[1])} V underhåll. Per batteri vid 25 °C.`,
    },
    {
      label: "Laddström",
      value: `${Math.round(ah * 0.1)} till ${Math.round(ah * 0.25)} A. Tillverkaren anger 10 till 25 % av C20.`,
    },
    {
      label: "Max laddström",
      value: `${Math.round(ah * 0.3)} A, alltså 30 A per 100 Ah.`,
    },
    {
      label: "Utjämningsladdning",
      value: "Får inte användas. Batteriet är förseglat och går inte att fylla på med vatten.",
    },
  ]

  if (lvd) {
    rader.push({
      label: "Lägsta urladdning",
      value: `${tal(lvd)} V per batteri. Djupare än 80 % förkortar livslängden.`,
    })
  }

  rader.push({
    label: "Arbetstemperatur",
    value: "Bäst mellan 15 och 25 °C. Omgivningen får aldrig överstiga 45 °C.",
  })

  return { rader, kalla: DISCOVER_MANUAL, kallaNamn: "Discovers driftmanual för Dry Cell Traction" }
}

const EXIDE_DATABLAD =
  "https://www.exidegroup.com/eu/sites/default/files/2026-08/260806_e_sonnenschein_gf-v_datasheet_en_rz.pdf"

/**
 * GF-V-databladets tabell, per artikel: [vikt kg, poltyp, åtdragningsmoment Nm].
 * Vikten har enligt databladet en tolerans på +/- 5 %.
 * GF1252Y och GF1263Y saknas med flit, de tillhör GF-Y-serien.
 */
const GFV = {
  "gf-06-180v": [30.0, "A-pol", 8],
  "gf-06-240v": [47.0, "A-pol", 8],
  "gf-12-050v": [18.0, "A-pol", 8],
  "gf-12-076v": [28.8, "A-pol", 8],
  "gf-12-105v": [38.7, "A-pol", 8],
  "gf-12-160v": [62.5, "A-pol", 8],
}

/** Antal celler i ett blockbatteri. Behövs för att räkna om V per cell. */
function celler(voltage) {
  const v = Number(String(voltage).replace(/[^0-9]/g, ""))
  return v ? v / 2 : null
}

function sonnenscheinTeknik(product) {
  const rad = GFV[product.slug]
  if (!rad) return null
  const [vikt, pol, moment] = rad
  const n = celler(product.voltage)

  const rader = [
    {
      label: "Laddning",
      /*
       * Absorptionsspänningen står INTE i något av Exides dokument, till
       * skillnad från Discovers Table 1. Därför anges laddmetoden i stället
       * för en siffra. Hitta inte på en, gelbatterier tål inte att laddas
       * med fel program och det är precis den frågan kunderna ringer om.
       */
      value:
        "Ladda enligt DIN 41773 med ett laddprogram avsett för gel. Tillverkaren " +
        "kräver en laddare de själva godkänt, modifierade laddkurvor är inte tillåtna.",
    },
    {
      label: "Underhållsladdning",
      value: n
        ? `2,23 V per cell, alltså ${tal(Number((2.23 * n).toFixed(2)))} V på det här batteriet.`
        : "2,23 V per cell.",
    },
    {
      label: "Utjämningsladdning",
      value: "Endast med laddare som tillverkaren godkänt för serien.",
    },
    {
      label: "Lägsta urladdning",
      value: "Ladda ur högst 80 % av märkkapaciteten. Djupare urladdning förkortar livslängden.",
    },
    {
      label: "Livslängd",
      value: "700 cykler enligt IEC 60254-1.",
    },
    {
      label: "Vattenpåfyllning",
      value: "Aldrig. Elektrolyten är fast och går varken att mäta eller fylla på.",
    },
    {
      label: "Arbetstemperatur",
      value:
        "30 °C är nominell temperatur. 45 °C är gränsvärdet och inte tillåtet i drift. " +
        "Batteriet ska hålla minst 15 °C när laddningen börjar och högst 35 °C.",
    },
    { label: "Vikt", value: `${tal(vikt)} kg (tolerans ±5 %)` },
    { label: "Pol", value: `${pol}, dras med ${moment} Nm` },
  ]

  return {
    rader,
    kalla: EXIDE_DATABLAD,
    kallaNamn: "Exides tekniska datablad för Sonnenschein GF-V",
  }
}
