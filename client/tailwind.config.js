/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        "pulse-slow": "pulse 8s linear infinite",
        border: "border 4s linear infinite",
        botAnimate: "botAnimate 3s ease-in-out infinite alternate",
        slideBg: "slideBg 8s ease-in-out infinite alternate",
      },
      keyframes: {
        border: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        slideBg: {
          "0%": {
            transform: "translateX(0)",
          },
          "100%": {
            transform: "translateX(-50%)",
          },
        },
        botAnimate: {
          "0%": {
            transform: "scale(1) rotate(0deg)",
          },
          "100%": {
            transform: "scale(1.1) rotate(-5deg)",
          },
        },
      },
    },
  },
  plugins: [],
};
