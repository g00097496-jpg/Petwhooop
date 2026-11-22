import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#FAF8F3",
        cream: "#F4EBDD",
        sage: "#A9BEA3",
        "sage-deep": "#4F6D4B", // readable green for small text on ivory (5:1)
        forest: "#243C32",
        peach: "#F4C6AD",
        "peach-deep": "#C9744A", // decorative accents only
        charcoal: "#252525",
      },
      fontFamily: {
        display: ['"Fraunces"', "Georgia", "serif"],
        sans: ['"DM Sans"', "system-ui", "Arial", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(36, 60, 50, 0.18)",
        lift: "0 22px 50px -16px rgba(36, 60, 50, 0.28)",
      },
      borderRadius: { "4xl": "2rem" },
    },
  },
  plugins: [],
};

export default config;
