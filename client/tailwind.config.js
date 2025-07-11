/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./{app,screen,components}/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}