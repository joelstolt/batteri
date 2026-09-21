import { publicProducts, getProductImage } from "@/lib/products"

import { SITE_URL } from "@/lib/constants"
import { productIdentifiers } from "@/lib/product-discovery"
import { productShippingInclVat } from "@/lib/store-policy"

export const dynamic = "force-static"

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function plainDescription(product) {
  const text = (product.description || product.metaDescription || "").replace(/\n+/g, " ").trim()
  return text.slice(0, 4900)
}

function feedItem(product) {
  // Varumärke + tillverkarens MPN är identifierare även när GTIN saknas.
  const { brand, mpn } = productIdentifiers(product)
  return `  <item>
    <g:id>${esc(product.slug)}</g:id>
    <g:title>${esc(product.name.slice(0, 150))}</g:title>
    <g:description>${esc(plainDescription(product))}</g:description>
    <g:link>${SITE_URL}/produkt/${esc(product.slug)}</g:link>
    <g:image_link>${SITE_URL}${esc(getProductImage(product))}</g:image_link>
    <g:availability>${product.inStock ? "in_stock" : "out_of_stock"}</g:availability>
    <g:price>${product.price.toFixed(2)} SEK</g:price>
    ${brand ? `<g:brand>${esc(brand)}</g:brand>` : ""}
    ${mpn ? `<g:mpn>${esc(mpn)}</g:mpn>` : ""}
    ${brand && mpn ? "<g:identifier_exists>yes</g:identifier_exists>" : ""}
    <g:condition>new</g:condition>
    <g:google_product_category>Electronics &gt; Power &gt; Batteries</g:google_product_category>
    <g:product_type>${esc(product.category)}</g:product_type>
    <g:shipping>
      <g:country>SE</g:country>
      <g:price>${productShippingInclVat(product).toFixed(2)} SEK</g:price>
    </g:shipping>
  </item>`
}

export async function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
<channel>
  <title>Batteriproffs</title>
  <link>${SITE_URL}</link>
  <description>Traktions-, gel- och fritidsbatterier från Batteriproffs</description>
${publicProducts.map(feedItem).join("\n")}
</channel>
</rss>`

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  })
}
