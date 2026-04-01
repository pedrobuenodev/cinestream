/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cine: {
          red: '#E50914',
          'red-hover': '#C11119',
          dark: '#141414',
          card: '#1F1F1F',
          'card-hover': '#2A2A2A',
          muted: '#6B7280',
          light: '#E5E5E5',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(to right, rgba(0,0,0,0.9) 40%, transparent 100%)',
        'bottom-fade': 'linear-gradient(to top, #141414 5%, transparent 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};
