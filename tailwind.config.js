/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        hufflepuff: {
          yellow: "#F0C75E",
          gold: "#EDB526",
          black: "#2C2C2C",
          gray: "#726255",
          light: "#FFF8DC",
        },
        badger: {
          brown: "#5C4033",
          cream: "#F5E6D3",
        },
      },
    },
  },
  plugins: [],
};
