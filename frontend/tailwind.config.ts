import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "mon-red": "#d7263d",
        "mon-red-dark": "#b81d34",
        "mon-gold": "#f7b533",
        "mon-gold-dark": "#d69b2d",
        "mon-surface": "#f6f7f8",
        "mon-text": "#1f2937"
      },
      boxShadow: {
        "mon-card": "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)"
      }
    }
  },
  plugins: []
};

export default config;
