/**
 * En väg in till mätningen.
 *
 * Varje anropsställe skrev tidigare sin egen
 * `if (typeof window !== "undefined" && window.umami)`. Det är lätt att glömma
 * halva villkoret, och ett event som tyst uteblir är värre än inget event alls
 * eftersom man tror att siffran noll betyder något.
 *
 * Allt går via Umami, som är cookielöst och därför inte kräver samtycke. Det är
 * hela poängen med att mäta här och inte i GA4: mätningen täcker 100 % av
 * besökarna i stället för bara dem som klickar ja i bannern. Skicka därför
 * ALDRIG något som identifierar en enskild besökare härigenom.
 *
 * Umami laddas med strategy="afterInteractive", alltså först efter att sidan
 * hydrerats. Ett event som skickas när en sida monteras hann därför före
 * skriptet och försvann tyst: omdome-oppnad gav noll träffar från 2026-09-03
 * till 2026-10-01 trots kundbesök på /omdome. Eventet väntar nu in skriptet.
 */
const VANTA_MS = 250
// 10 sekunder. Laddas skriptet aldrig (adblock, nätfel) släpps eventet.
const MAX_FORSOK = 40

export function track(namn, data) {
  if (typeof window === "undefined") return
  skicka(namn, data, 0)
}

function skicka(namn, data, forsok) {
  const u = window.umami
  if (!u || typeof u.track !== "function") {
    if (forsok < MAX_FORSOK) {
      setTimeout(() => skicka(namn, data, forsok + 1), VANTA_MS)
    }
    return
  }
  try {
    if (data === undefined) u.track(namn)
    else u.track(namn, data)
  } catch {
    // Mätning får aldrig fälla ett köpflöde.
  }
}
