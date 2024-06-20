/** @type {import('tailwindcss').Config} */

const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./formkit.config.js",
    "./node_modules/vue-tailwind-datepicker/**/*.js",//Instalacion de tailwind para datapicker
  ],
  theme: {
    extend: {
      colors: {
        "vtd-primary": colors.yellow,
        "vtd-secondary": colors.gray,
      },
      fontFamily: {
        inter: ['Inter', 'sans'],
      },
    },
  },
  
  variants: {
    extend: {
      display: ['group-hover'],
    },
  },

  plugins: [
    
  ],
}
