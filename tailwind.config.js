/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        script: ['"Dancing Script"', 'cursive'],
      },
      colors: {
        luxury: {
          gold: '#D4AF37',
          lightgold: '#F3E5AB',
          champagne: '#F7E7CE',
          dark: '#0A0A0B',
          charcoal: '#141416',
          muted: '#8E8E93',
          border: 'rgba(255, 255, 255, 0.08)',
        }
      }
    },
  },
  plugins: [],
}
