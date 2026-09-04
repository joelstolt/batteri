import { defineConfig, globalIgnores } from "eslint/config"
import next from "eslint-config-next/core-web-vitals"
export default defineConfig([
  ...next,
  { files: ["tests/**"], rules: { "@next/next/no-img-element": "off" } },
  globalIgnores([
    ".next/**",
    ".vercel/**",
    ".claude/**",
    "node_modules/**",
    "work/**",
  ]),
  // Existing effects deliberately synchronize storage and vendor UI.
  {
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/refs": "off",
      "react-hooks/purity": "off",
      "react/no-unescaped-entities": "off",
    },
  },
])
