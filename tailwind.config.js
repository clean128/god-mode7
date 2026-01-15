/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Fredoka One', 'cursive'],
        'body': ['Nunito', 'sans-serif'],
        'game': ['Bungee', 'cursive'],
      },
      colors: {
        'game-primary': '#00D9FF',
        'game-primary-dark': '#4A90E2',
        'game-success': '#00FF88',
        'game-success-dark': '#00CC6A',
        'game-accent-orange': '#FF6B35',
        'game-accent-yellow': '#FFD93D',
        'game-accent-purple': '#A855F7',
        'game-accent-pink': '#FF6B9D',
      },
      borderRadius: {
        'game': '20px',
      },
      boxShadow: {
        'game-blue': '0 8px 24px rgba(74, 144, 226, 0.4)',
        'game-green': '0 8px 24px rgba(0, 255, 136, 0.4)',
        'game-orange': '0 8px 24px rgba(255, 107, 53, 0.4)',
        'game-glow': '0 0 20px rgba(74, 144, 226, 0.5), 0 0 40px rgba(0, 217, 255, 0.3)',
      },
      animation: {
        'bounce-game': 'bounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'pulse-game': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}

