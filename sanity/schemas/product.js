export const product = {
  name: "product",
  title: "Produkt",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Produktnamn",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "shortName",
      title: "Kort namn (visas i kort)",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "slug",
      title: "URL-slug",
      type: "slug",
      options: { source: "shortName", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "category",
      title: "Kategori",
      type: "reference",
      to: [{ type: "category" }],
      validation: (Rule) => Rule.required(),
    },
    {
      name: "voltage",
      title: "Spänning",
      type: "string",
      options: {
        list: ["6V", "12V", "24V"],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "capacity",
      title: "Kapacitet",
      type: "string",
      description: "T.ex. 105Ah (C₅) / 120Ah (C₂₀)",
    },
    {
      name: "price",
      title: "Pris (exkl. moms, SEK)",
      type: "number",
      validation: (Rule) => Rule.required().positive(),
    },
    {
      name: "images",
      title: "Produktbilder",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (Rule) => Rule.required().min(1),
    },
    {
      name: "badge",
      title: "Badge (valfri)",
      type: "string",
      description: "T.ex. Bästsäljare, Populär, Ny",
    },
    {
      name: "description",
      title: "Beskrivning",
      type: "text",
      rows: 4,
    },
    {
      name: "specs",
      title: "Specifikationer",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "key", title: "Egenskap", type: "string" },
            { name: "value", title: "Värde", type: "string" },
          ],
          preview: {
            select: { title: "key", subtitle: "value" },
          },
        },
      ],
    },
    {
      name: "inStock",
      title: "I lager",
      type: "boolean",
      initialValue: true,
    },
    {
      name: "sortOrder",
      title: "Sorteringsordning",
      type: "number",
      description: "Lägre nummer = visas först",
      initialValue: 0,
    },
  ],
  orderings: [
    { title: "Pris (stigande)", name: "priceAsc", by: [{ field: "price", direction: "asc" }] },
    { title: "Pris (fallande)", name: "priceDesc", by: [{ field: "price", direction: "desc" }] },
    { title: "Namn", name: "nameAsc", by: [{ field: "name", direction: "asc" }] },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "voltage",
      media: "images.0",
    },
  },
}
