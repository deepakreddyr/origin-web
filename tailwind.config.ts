import type { Config } from "tailwindcss";
import "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FFDD00",
          100: "#F8F4E9",
          "100-0": "#F8F4E900",
          "100-80": "#F8F4E9cc",
          200: "#EDE6D4",
          "200-0": "#EDE6D400",
          "200-80": "#EDE6D4CC",
        },
        secondary: {
          DEFAULT: "#25874D",
          100: "#DDEEDD",
          200: "#CFE6D2",
          300: "#26B45F",
          400: "#231F20",
        },
        oGrey: {
          DEFAULT: "#BFBFBF",
          100: "#EEEEEE",
          200: "#D9D9D9",
          300: "#E5E4E4",
        },
        black: {
          DEFAULT: "#231f20",
          "op-60": "#231f2099",
          "op-50": "#231f2080",
          "op-30": "#231F204d",
        },
      },
      boxShadow: {
        origin: "0 5px 0 0 rgb(0,0,0,05%)",
        sm: "4px 4px 32px 0px #00000014",
      },

      screens: {
        xs: "390px",
        sm: "600px", // Small screens, default mobile size
        md: "900px", // Medium screens, tablets
        lg: "1150px", // Large screens, laptops
        xl: "1450px", // Extra large screens, desktops
        "2xl": "1600px", // Double extra large screens, large desktops
      },
      backgroundImage: {
        noise: "url('/assets/noise-texture.png')", // Replace with your noise texture URL
      },
      animation: {
        "infinite-scroll": "infinite-scroll 25s linear infinite",
      },
      keyframes: {
        "infinite-scroll": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-100%)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
