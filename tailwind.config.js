/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,vue}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        primary: '#1B4332',
        accent: '#C8A951',
        'tcm-up': '#E53935',
        'tcm-down': '#43A047',
        'tcm-bg': '#FAF8F5',
      },
    },
  },
  plugins: [],
};
