/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        netflix: {
          light: '#E50914',
          DEFAULT: '#E50914',
          dark: '#B81D24',
          black: '#141414',
          gray: '#808080'
        }
      }
    },
  },
  plugins: [],
}
