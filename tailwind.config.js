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
          teal: '#019599',
          darkTeal: '#188487',
          lightTeal: '#23aab0',
          cyan: '#02b8c6',
          gold: '#ffde17',
          dark: '#0f172a',
          slate: '#1e293b',
          muted: '#64748b',
          bg: '#f8fafc',
          card: '#ffffff',
        },
      },
      fontFamily: {
        cairo: ['Cairo', 'Tajawal', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
