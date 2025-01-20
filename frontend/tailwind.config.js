/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        customBlue: '#010d3f',
        customYellow: '#f9e400',
        customGrey: '#f6f6f6',
        customRed: '#ff4f55',
        custombluegrey: '#b7c1e2',
        customDarkgrey: '#2a3759',
        customDarkred: '#dc4e57'
      },
    },
  },
  plugins: [],
}

