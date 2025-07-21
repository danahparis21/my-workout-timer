/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  
  theme: {
    extend: {
      fontFamily: {
        seasons: ['"Poppins"', 'serif'],
      },
      colors: {
        rosePink: "#e991af",
        ovalBg: "#ffe0ec",
      },
    },
  },
  plugins: [],
}

