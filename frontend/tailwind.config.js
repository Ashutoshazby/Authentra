/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#07111f",
        accent: "#ff7a59",
        aqua: "#56d7c7",
        gold: "#f4c95d",
        mist: "#dce7f3"
      },
      boxShadow: {
        glow: "0 24px 80px rgba(86, 215, 199, 0.15)"
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        pulseSoft: "pulseSoft 1.8s ease-in-out infinite"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" }
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.45" },
          "50%": { opacity: "1" }
        }
      }
    }
  },
  plugins: []
};
