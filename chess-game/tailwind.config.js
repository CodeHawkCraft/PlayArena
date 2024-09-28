/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors:
        {
        'customBlack':'#021526',
        'customLight':'#F5EDED',
        'chessBoardColor1':'#81b64c',
        'greenColor':'#81b64c',
          'lightTealColor':'#e9e2d9',
        }
      ,
      objectPosition:{
        'heroLogo':'0% 50%'
      }
    },
  },
  plugins: [],
}

