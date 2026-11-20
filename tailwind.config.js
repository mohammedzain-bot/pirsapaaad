/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: '#FFE600',       // Vibrant electric yellow from poster
          'yellow-light': '#FFF566',
          'yellow-dark': '#E5CE00',
          black: '#0D0D0D',        // Deep matte black
          charcoal: '#1A1A1A',
          card: '#141414',
          gray: '#282828',
          gold: '#D4AF37'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Syne', 'Plus Jakarta Sans', 'sans-serif']
      },
      boxShadow: {
        'glow-yellow': '0 0 25px rgba(255, 230, 0, 0.35)',
        'glow-sm': '0 0 15px rgba(255, 230, 0, 0.2)',
        'premium': '0 10px 30px -10px rgba(0, 0, 0, 0.5)'
      }
    },
  },
  plugins: [],
}
