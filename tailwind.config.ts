import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "hsl(var(--border))",
        red: "#fe0353",
        hero: "rgb(249, 73, 245)",
        gray: "rgb(138, 143, 152)",
        dark: "#928c97",
        base: "#0d0e12",
        features: "#8a8f98",

        "gray-50": "rgba(227, 229, 232, 0.52)",
        "gray-100": "hsl(240, 5%, 20%)",
        "gray-200": "rgb(34, 34, 38)",
        "gray-300": "rgb(19, 21, 26)",
        "gray-400": "rgb(13, 14, 18)",
      },
    },
  },
  plugins: [],
};
export default config;
