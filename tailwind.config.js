/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0b0a14',
        panel: '#1a1830',
        tile: '#25224a',
        edge: '#2b2850',
        line: '#34315e',
        fog: '#8f8aa8',
        lav: '#a5a0e8',
        lime: '#7dff5e',
        grape: '#8b7cf0',
        tang: '#ff9f1c',
        rose: '#ff6b9d',
      },
    },
  },
  plugins: [],
};
