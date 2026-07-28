import { SITE_URL, SITE_NAME, PHONE_LINK, EMAIL, ADDRESS } from "./constants"

/**
 * Delade JSON-LD-byggare.
 *
 * VIKTIGT: schemat måste renderas inline i server-HTML:en, aldrig via
 * next/script. Läggs det via Script hamnar det inte i råmarkeringen och är
 * osynligt för både Google och AI-botar.
 */

/** Knyter ihop företaget till en entitet. Renderas en gång, på startsidan. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    description:
      "Professionella batterilösningar för företag i hela Sverige — traktionsbatterier, gelbatterier och batterier till städmaskiner, liftar och truckar.",
    email: EMAIL,
    telephone: PHONE_LINK,
    areaServed: { "@type": "Country", name: "Sverige" },
    // Organization, INTE LocalBusiness. Verksamheten är helt digital utan
    // kundbesök — LocalBusiness skulle antyda en plats man kan besöka.
    address: {
      "@type": "PostalAddress",
      streetAddress: ADDRESS.gata,
      postalCode: ADDRESS.postnummer,
      addressLocality: ADDRESS.ort,
      addressCountry: ADDRESS.land,
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: PHONE_LINK,
      email: EMAIL,
      contactType: "customer service",
      availableLanguage: ["Swedish"],
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "17:00",
      },
    },
  }
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: "sv-SE",
    publisher: { "@id": `${SITE_URL}/#organization` },
  }
}

/**
 * Brödsmulor. Sajten har dem visuellt men utan uppmärkning visar Google dem
 * inte i sökresultatet — där ersätter de den råa URL:en och höjer klickfrekvensen.
 *
 * @param {{name: string, path?: string}[]} items
 */
export function breadcrumbJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      ...(it.path ? { item: `${SITE_URL}${it.path}` } : {}),
    })),
  }
}

/** FAQPage är en av få schematyper Google fortfarande visar som rich result. */
export function faqJsonLd(qa) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qa.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  }
}

/** Liten hjälpare så inline-taggen ser likadan ut överallt. */
export function jsonLdProps(data) {
  return {
    type: "application/ld+json",
    dangerouslySetInnerHTML: { __html: JSON.stringify(data) },
  }
}
