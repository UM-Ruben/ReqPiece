/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Pirata One", "serif"],
        body: ["Exo 2", "sans-serif"],
      },
    },
  },
  plugins: [],
};
