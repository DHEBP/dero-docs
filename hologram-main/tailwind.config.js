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
        // Hologram Design System Colors - Cyan palette matching app (#22d3ee)
        cyan: {
          DEFAULT: '#22d3ee',
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344'
        },
        // Dark backgrounds matching Hologram app
        void: {
          DEFAULT: '#0a0f1a',
          50: '#1e293b',
          100: '#1a2234',
          200: '#151c2c',
          300: '#111827',
          400: '#0d1421',
          500: '#0a0f1a',
          600: '#080c15',
          700: '#060a12',
          800: '#04070d',
          900: '#020408'
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
      },
      backgroundColor: {
        dark: '#0a0f1a'
      }
    }
  },
  plugins: [],
  darkMode: 'class'
}

