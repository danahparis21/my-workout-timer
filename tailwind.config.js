/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      fontFamily: {
        seasons: ['"Poppins"', "serif"],
      },
      colors: {
        rosePink: "#e991af",
        ovalBg: "#ffe0ec",
      },

      keyframes: {
        scaleIn: {
          "0%": { transform: "scale(0)", opacity: "0" },
          "50%": { transform: "scale(1.2)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        scaleIn: "scaleIn 0.6s ease-out",
      },
    },
  },
  plugins: [],
};
