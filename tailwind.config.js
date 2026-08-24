/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        night: {
          950: "#0B0A1F",
          900: "#11102A",
          800: "#1A1836",
          700: "#252142",
          600: "#332C58",
        },
        moon: {
          300: "#C9BFFF",
          400: "#A996FF",
          500: "#8B7CF6",
          600: "#6D5BD0",
          700: "#5445A8",
        },
        dawn: {
          300: "#FFD9B3",
          400: "#FFB77D",
          500: "#FF9A5C",
        },
        leaf: {
          400: "#7FD9B0",
          500: "#4FBE93",
        },
        alert: {
          400: "#FF8A8A",
          500: "#F0625F",
        },
      },
      fontFamily: {
        sans: [
          "'Nunito'",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        display: [
          "'Quicksand'",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
      },
      boxShadow: {
        glow: "0 8px 30px -8px rgba(139, 124, 246, 0.45)",
        card: "0 4px 20px -6px rgba(0,0,0,0.35)",
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      keyframes: {
        breathe: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.9" },
          "50%": { transform: "scale(1.04)", opacity: "1" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        breathe: "breathe 3.5s ease-in-out infinite",
        fadeUp: "fadeUp 0.35s ease forwards",
      },
    },
  },
  plugins: [],
};
