import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Ground: cool stone, deliberately not the warm-cream default.
        stone: "#E4E3DA",
        surface: "#F8F7F2",
        // Ink: warm charcoal, not pure black.
        ink: {
          DEFAULT: "#1F241F",
          soft: "#5C6158",
        },
        // Brand: deep bottle green — discretion over flash.
        bottle: {
          DEFAULT: "#28402F",
          light: "#3B5641",
        },
        // Signature accent: brass, reserved for the progress seal.
        brass: {
          DEFAULT: "#A97C3E",
          light: "#C79A5C",
        },
        // Status semantics, tuned to the brand rather than stock red/green/amber.
        rust: "#9C4A2C",
        slate: "#556277",
        taupe: "#948C7E",
        hairline: "#D6D0C1",
        "hairline-strong": "#C1B9A6",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "ui-serif", "serif"],
        body: ["var(--font-inter)", "ui-sans-serif", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(31, 36, 31, 0.06), 0 8px 24px -12px rgba(31, 36, 31, 0.18)",
        modal: "0 24px 64px -16px rgba(31, 36, 31, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
