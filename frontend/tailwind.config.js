/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff4e8',
          100: '#ffe5c8',
          200: '#ffc98f',
          300: '#f6a85c',
          400: '#ef8c3b',
          500: '#e87324',
          600: '#c85a18',
          700: '#a54316',
          800: '#853719',
          900: '#6d2f1b',
        },
      },
      boxShadow: {
        glow: '0 25px 80px rgba(67, 56, 202, 0.18)',
      },
      backgroundImage: {
        'hero-gradient':
          'radial-gradient(circle at top left, rgba(232,115,36,0.16), transparent 32%), radial-gradient(circle at bottom right, rgba(88,68,52,0.08), transparent 36%)',
      },
    },
  },
  plugins: [],
}

