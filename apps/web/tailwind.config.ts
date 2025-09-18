// Corrected tailwind.config.ts
import type { Config } from "tailwindcss"

const config = {
  // Change this line:
  // darkMode: ["class"],
  // To this line:
  darkMode: ["class", "dark"], // Or just "class"
  content: [
    // ...
  ],
  prefix: "",
  theme: {
    // ...
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config;