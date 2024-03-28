/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        customSidebarBg: "#ACC9BA", // Tên custom color
        customHoverSidebar: "#0abe63",
        mainColor: "#0abe63",
        mainTextColorButton: "#ffffff",
      },
      fontFamily: {
        sans: ["Nunito Sans", "sans-serif"],
      },
      boxShadow: {
        "custom-green":
          "0 4px 6px -1px rgba(16, 185, 129, 0.5), 0 2px 4px -2px rgba(16, 185, 129, 0.7)", // ví dụ shadow màu xanh
      },
    },
  },
  plugins: [],
};
