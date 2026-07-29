import { SITE_URL } from "@/lib/constants"

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/studio", "/admin", "/konto", "/kassa", "/tack"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
