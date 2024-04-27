/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'custom-gradient': "linear-gradient(to right, #8BD8DB, #8DD9A7, #95D273)",
      },
    },
  },
  plugins: [],
}

