/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brandBlue: "#1E40AF", //  primary blue color
        hoverBlue: "#1E3A8A", // Slightly darker blue for hover effects
        lightBlue: "#3B82F6", // Light blue for icons and accents
        secondaryBlue: "#60A5FA", // Secondary blue for less emphasized text
        red: "#EF4444", // Red for prices when discounted
        white: "#ffffff", // White for backgrounds or text
        grayDark: "#1F2937", // Dark gray for text
        grayLight: "#F3F4F6", // Light gray for backgrounds
      },
      fontFamily: {
        sans: ["Open Sans", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
