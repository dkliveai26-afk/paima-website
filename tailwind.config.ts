import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paima: {
          bg: "#E1D4C2",        // Warm Cream Canvas
          surface: "#BEB5A9",   // Soft Taupe Surface
          border: "#A78D78",    // Earth Border
          dark: "#000000",      // Pure Dark Black Anchor
          accent: "#000000",    // Dark Black Accent
          heading: "#000000",   // Pure Dark Black Headings
          subtext: "#0A0A0A",   // Crisp Dark Black Subtext
          cream: "#E1D4C2",
          taupe: "#BEB5A9",
          earth: "#A78D78",
          black: "#000000",
        },
        atelier: {
          bg: "#E1D4C2",
          surface: "#BEB5A9",
          "surface-muted": "#BEB5A9",
          card: "#BEB5A9",
          border: "#A78D78",
          "border-dark": "#000000",
          dark: "#000000",
          darker: "#000000",
          charcoal: "#000000",
          muted: "#0A0A0A",
          gold: "#000000",
          "gold-light": "#000000",
          "gold-dark": "#000000",
          sage: "#000000",
          "sage-light": "#BEB5A9",
          stone: "#A78D78",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        widest: "0.2em",
        extrawide: "0.3em",
      },
      transitionTimingFunction: {
        luxury: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionDuration: {
        400: "400ms",
        600: "600ms",
        800: "800ms",
      },
    },
  },
  plugins: [],
};

export default config;
