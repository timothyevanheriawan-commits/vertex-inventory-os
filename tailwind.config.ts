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
        background: "#F8FAFC", // Slate-50
        surface: "#FFFFFF",
        foreground: "#0F172A", // Slate-900
        muted: "#64748B", // Slate-500
        border: "#E2E8F0", // Slate-200
        primary: {
          DEFAULT: "#4F46E5", // Indigo-600
          hover: "#4338CA",
          foreground: "#FFFFFF",
        },
        status: {
          healthy: "#16A34A",
          watch: "#D97706",
          critical: "#DC2626",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)"], // This now maps to Plus Jakarta Sans
        mono: ["var(--font-mono)"],
      },
    },
  },
  plugins: [],
};
export default config;
