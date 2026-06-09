import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./lib/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["Georgia", "ui-serif", "serif"]
      },
      colors: {
        ink: "#20211f",
        paper: "#f7f4ee",
        moss: "#496456",
        clay: "#b7614f",
        skysoft: "#dce8ed"
      },
      boxShadow: {
        soft: "0 24px 70px rgba(32, 33, 31, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
