/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Hindrar webbläsaren från att gissa filtyp och köra t.ex. en
          // uppladdad bild som skript
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Sajten får inte bäddas in i en iframe — skyddar kassan mot
          // clickjacking, där en osynlig ram läggs över betalknappen
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // Läcker inte hela URL:en till externa sajter vi länkar till
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Stänger av webbläsar-API:er sajten inte använder
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
    ]
  },
}

export default nextConfig
