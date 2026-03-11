export const category = {
  name: "category",
  title: "Kategori",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Titel",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "slug",
      title: "URL-slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "description",
      title: "Beskrivning",
      type: "string",
    },
    {
      name: "icon",
      title: "Ikon (emoji)",
      type: "string",
      description: "T.ex. 🏗️ 🧹 🔋 ☀️",
    },
    {
      name: "image",
      title: "Kategoribild",
      type: "image",
      options: { hotspot: true },
    },
    {
      name: "accent",
      title: "Accentfärg (hex)",
      type: "string",
      description: "T.ex. #2E86DE",
    },
    {
      name: "sortOrder",
      title: "Sorteringsordning",
      type: "number",
      initialValue: 0,
    },
  ],
  orderings: [
    { title: "Ordning", name: "sortOrder", by: [{ field: "sortOrder", direction: "asc" }] },
  ],
  preview: {
    select: { title: "title", subtitle: "description", media: "image" },
  },
}
