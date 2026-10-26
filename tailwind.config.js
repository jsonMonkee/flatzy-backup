/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        flatzy: {
          yellow: '#FFC800',
          yellowLight: '#FFDE59',
          yellowDark: '#E5B400',
          navy: '#0B132B',
          navyLight: '#1C2541',
          navyDark: '#070C1B',
          coral: '#FF5722',
          coralLight: '#FF7043',
          cream: '#FFFDF9',
          sand: '#F7F5EE',
          greyLight: '#F3F4F6',
          greyMuted: '#94A3B8',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
        poppins: ['Poppins', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Noto Color Emoji"'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(11, 19, 43, 0.06), 0 2px 6px -1px rgba(11, 19, 43, 0.03)',
        'soft-lg': '0 10px 30px -4px rgba(11, 19, 43, 0.08), 0 4px 12px -2px rgba(11, 19, 43, 0.04)',
        'yellow-glow': '0 8px 25px -4px rgba(255, 200, 0, 0.45)',
        'navy-glow': '0 8px 25px -4px rgba(11, 19, 43, 0.25)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}
