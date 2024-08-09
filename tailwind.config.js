// eslint-disable-next-line @typescript-eslint/no-var-requires
const colors = require('./colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: colors.Colors,
    },
  },
  plugins: [],
}
