/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'brand-dark': '#0E0E0E', // Deep black background
        'brand-light': '#E5E5E5', // Off-white text
        'brand-accent': '#FF3C00', // The bold orange from the image
        'brand-gray': '#2A2A2A', // Card backgrounds
      },
      fontFamily: {
        'display': ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        'mono': ['"Courier New"', 'Courier', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      borderRadius: {
        'none': '0',
        'sm': '2px',
      },
    },
  },
  plugins: [],
};
