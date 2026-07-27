import { SITE_URL } from "./constants"

/**
 * Bygger metadata med canonical per sida.
 *
 * VIKTIGT: canonical får ALDRIG sättas i app/layout.js. Next ärver den då till
 * varenda undersida, som alla pekar tillbaka på startsidan — hela sajten faller
 * ur indexet. Den ska sättas här, en gång per sida.
 */
export function pageMeta({ path = "/", title, description, ogTitle, ogDescription, images, keywords }) {
  const url = path === "/" ? SITE_URL : `${SITE_URL}${path}`

  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: { canonical: url },
    openGraph: {
      title: ogTitle || title,
      description: ogDescription || description,
      url,
      siteName: "Batteriproffs",
      locale: "sv_SE",
      type: "website",
      ...(images ? { images } : {}),
    },
  }
}
