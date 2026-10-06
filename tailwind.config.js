/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        zafiro: {
          pink: '#ff8fa3',
          darkPink: '#ff4d6d',
          bg: '#fff0f3',
          lightAccent: '#ffccd5',
          wine: '#590d22',
          wineLight: '#800f2f',
          gold: '#ffb703',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
