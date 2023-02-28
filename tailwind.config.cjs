/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        background_plane: "url('/public/background.png')",
      },
      fontfamily: {
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        primary: "#1893F8",
        alert: "#F81893",
      },
    },
  },
  plugins: [],
};
