/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        customSidebarBg: "#ACC9BA", // Tên custom color
        customHoverSidebar: "#027C3F",
      },
    },
  },
  plugins: [],
};
