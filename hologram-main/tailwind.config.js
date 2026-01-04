/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './theme.config.tsx'
  ],
  theme: {
    extend: {
      colors: {
        // Hologram Design System Colors
        cyan: {
          DEFAULT: '#00d4aa',
          50: '#e6fff9',
          100: '#b3ffe9',
          200: '#80ffd9',
          300: '#4dffc9',
          400: '#1affb9',
          500: '#00d4aa',
          600: '#00a888',
          700: '#007c66',
          800: '#005044',
          900: '#002422'
        },
        violet: {
          DEFAULT: '#8b5cf6',
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95'
        }
      }
    }
  },
  plugins: [],
  darkMode: 'class'
}

