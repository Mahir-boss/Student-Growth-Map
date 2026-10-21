/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // <--- Add this exact line
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}