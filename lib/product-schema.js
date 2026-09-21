import { SITE_URL } from "./constants"
import { getProductImage } from "./products"
import { productIdentifiers, productTechnicalJsonLd } from "./product-discovery"
import { productShippingInclVat, RETURN_WINDOW_DAYS, RETURN_RESTOCKING_FEE_PERCENT } from "./store-policy"

export function buildProductJsonLd(product, sum = null) {
  if (product.hidden) return null
  const identifiers = productIdentifiers(product)

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${SITE_URL}/produkt/${product.slug}#product`,
    url: `${SITE_URL}/produkt/${product.slug}`,
    name: product.name,
    // Betygssammanfattningen kommer enbart från godkända produktomdömen.
    ...(sum
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: sum.snitt,
            reviewCount: sum.antal,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    image: `${SITE_URL}${getProductImage(product)}`,
    description: (product.description || product.metaDescription || "").replace(/\n+/g, " "),
    sku: product.slug,
    ...(identifiers.mpn ? { mpn: identifiers.mpn } : {}),
    ...(identifiers.brand ? { brand: { "@type": "Brand", name: identifiers.brand } } : {}),
    ...productTechnicalJsonLd(product),
    offers: {
      "@type": "Offer",
      seller: { "@id": `${SITE_URL}/#organization` },
      url: `${SITE_URL}/produkt/${product.slug}`,
      priceCurrency: "SEK",
      price: product.price,
      itemCondition: "https://schema.org/NewCondition",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: productShippingInclVat(product),
          currency: "SEK",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "SE",
        },
        // Ingen obekräftad uppdelning i hanteringsdagar och transportdagar.
      },
      // Samma returperiod och avdrag som i den synliga policyn på /villkor.
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "SE",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: RETURN_WINDOW_DAYS,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/ReturnFeesCustomerResponsibility",
        restockingFee: RETURN_RESTOCKING_FEE_PERCENT,
        merchantReturnLink: `${SITE_URL}/villkor`,
      },
    },
  }
}

