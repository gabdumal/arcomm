/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    fontFamily: {
      heading: ["Raleway", "sans-serif"],
      common: ["Montserrat", "sans-serif"],
    },
    colors: {
      primary: {
        common: colors.green[500],
        dark: colors.green[600],
        darker: colors.green[700],
      },
      secondary: {
        common: colors.emerald[200],
        dark: colors.emerald[300],
        darker: colors.emerald[400],
      },
      accent: {
        common: colors.teal[500],
        dark: colors.teal[600],
        darker: colors.teal[700],
      },
      danger: {
        common: colors.red[500],
        dark: colors.red[600],
        darker: colors.red[700],
      },
      inactive: {
        common: colors.neutral[400],
        dark: colors.neutral[500],
        darker: colors.neutral[600],
      },
      light: colors.neutral[50],
      dark: colors.neutral[950],
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
