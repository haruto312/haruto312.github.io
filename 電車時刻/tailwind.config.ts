import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "media",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        rail: {
          50: "#f2fbf9",
          500: "#139c8b",
          700: "#0b6f66",
          950: "#06231f",
        },
        signal: {
          amber: "#f6b642",
          red: "#e85d5d",
          blue: "#3478f6",
        },
      },
      boxShadow: {
        soft: "0 12px 32px rgba(5, 20, 28, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
