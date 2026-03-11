import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"
import { product } from "./sanity/schemas/product"
import { category } from "./sanity/schemas/category"

export default defineConfig({
  name: "batteriproffs",
  title: "Batteriproffs",
  projectId: "crys9gvh",
  dataset: "production",
  basePath: "/studio",
  plugins: [structureTool()],
  schema: {
    types: [product, category],
  },
})
