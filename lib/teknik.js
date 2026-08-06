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
 * Sonnenschein och Nordmax saknas än. Exide blockerar automatisk hämtning och
 * Nordmax är leverantörens eget varumärke utan publika datablad. Tills de finns
 * returnerar den här filen null för dem, och då renderas ingen sektion alls.
 * Skriv ALDRIG in gissade siffror här för att fylla ut.
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

/**
 * Vikter hämtade från Discovers egna produktsidor.
 *
 * OBS: siffrorna gäller AM-polen. Våra artiklar är i flera fall M8, som väger
 * något mer på grund av polstycket. Skillnaden är under ett kilo och saknar
 * betydelse för fraktklass, men därför står det "ca". Kommer leverantörens
 * lista med exakta vikter ska de ersätta de här.
 */
const DISCOVER_VIKT = {
  "ev31a-a-m8": 32.0,
  "evgc8a-a-m8": 29.5,
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
  if ((product.specs?.["Varumärke"] || "") !== "Discover") return null

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

  const vikt = DISCOVER_VIKT[product.slug]
  if (vikt) rader.push({ label: "Vikt", value: `ca ${tal(vikt)} kg` })

  return { rader, kalla: DISCOVER_MANUAL, kallaNamn: "Discovers driftmanual för Dry Cell Traction" }
}
