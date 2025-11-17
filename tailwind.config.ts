import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          pink: "#F472B6",
          purple: "#7C3AED",
          midnight: "#0F172A",
          lilac: "#C4B5FD",
        },
        surface: {
          light: "#FDF7FB",
          card: "#FFFFFF",
        },
      },
      boxShadow: {
        brand: "0 20px 45px -20px rgba(124, 58, 237, 0.35)",
      },
      backgroundImage: {
        "hero-gradient":
          "radial-gradient(circle at 20% 20%, rgba(244, 114, 182, 0.25), transparent 45%), radial-gradient(circle at 80% 0%, rgba(124, 58, 237, 0.25), transparent 40%)",
      },
    },
  },
  plugins: [],
};
export default config;
