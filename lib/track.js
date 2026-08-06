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
 */
export function track(namn, data) {
  if (typeof window === "undefined") return
  const u = window.umami
  if (!u || typeof u.track !== "function") return
  try {
    if (data === undefined) u.track(namn)
    else u.track(namn, data)
  } catch {
    // Mätning får aldrig fälla ett köpflöde.
  }
}
