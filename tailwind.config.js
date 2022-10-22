/** @type {import('tailwindcss').Config} */
module.exports = {
content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
 "colors": {
  "vertPomme": "#70ce58",
  "titres": "#50a839"
 },
 "fontSize": {
  "base": "1.25rem",
  "lg": "1.375rem",
  "xl": "1.4375rem",
  "2xl": "1.5625rem",
  "3xl": "2.1875rem",
  "4xl": "2.8125rem"
 },
 "fontFamily": {
  "montserrat": "Montserrat"
 },
 "borderRadius": {
  "none": "0",
  "xs": "0.625rem"
 }

    },
  },
  plugins: [],
}
