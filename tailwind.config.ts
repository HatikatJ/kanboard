import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#121212",
        surface: "#1b1b1b",
        accent: "#c5f36b",
      },
    },
  },
  plugins: [],
};

export default config;
