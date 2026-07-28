/**
 * Kundreferenser.
 *
 * MEDVETET ORDVAL: det här är "referenser", inte "omdömen" eller "recensioner".
 * Marknadsföringslagen skärptes 2022 kring recensioner — stjärnbetyg och ordet
 * kundomdöme antyder ett insamlat omdöme som vi inte har något system för.
 * Namngivna referenser som personen godkänt är både ärligare och juridiskt rent.
 * Sätt ALDRIG stjärnbetyg på de här.
 *
 * REGEL: en referens får bara ligga här om personen godkänt exakt den texten.
 * Sätt `godkand: true` först när OK:et finns i skrift. Bara godkända visas.
 */

export const references = [
  {
    namn: "Adam Olsson",
    titel: null, // TODO: företag eller roll — en referens utan sammanhang väger lätt
    citat:
      "Jag ringde med ett modellnummer och fick svar direkt på vilket batteri som passade. Beställningen gick iväg samma dag och jag slapp gissa mig fram. Sällsynt att få prata med någon som faktiskt kan produkten.",
    godkand: false,
  },
  {
    namn: "Lasse Karlsson",
    titel: null, // TODO: företag eller roll
    citat:
      "Vi jämförde priser på flera håll och Batteriproffs låg lägst utan att det kändes som en risk. Batterierna kom när de sa och har gått som de ska sedan dess.",
    godkand: false,
  },
]

/** Bara de som godkänt sin text visas på sajten. */
export const godkandaReferenser = references.filter((r) => r.godkand)
