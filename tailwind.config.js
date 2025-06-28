/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html"
  ],
  // theme: {
  //   extend: {
  //     colors: {
  //       primary: {
  //         DEFAULT: 'hsl(165, 65%, 35%)', // main
  //         light: 'hsl(165, 65%, 45%)',
  //         foreground: '#fff',
  //       },
  //       secondary: {
  //         DEFAULT: '#f59e42', // Example: orange, you can change this
  //         light: '#ffd8b0',
  //         foreground: '#fff',
  //       },
  //     },
  //   },
  // },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography")
  ],
};
