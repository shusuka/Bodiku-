/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Fredoka"', 'system-ui', 'sans-serif'],
        body: ['"Quicksand"', 'system-ui', 'sans-serif'],
      },
      colors: {
        candy: {
          pink: '#FF6FB5',
          mint: '#7EEBC1',
          lemon: '#FFE66D',
          grape: '#B197FC',
          peach: '#FFB088',
          sky: '#74D0F1',
        },
        cream: '#FFF8EC',
      },
      boxShadow: {
        candy: '0 8px 0 rgba(0,0,0,0.12)',
        'candy-sm': '0 4px 0 rgba(0,0,0,0.12)',
        pop: '0 12px 32px rgba(255, 111, 181, 0.35)',
      },
      animation: {
        wobble: 'wobble 1.2s ease-in-out infinite',
        'bounce-slow': 'bounce 2.5s ease-in-out infinite',
        float: 'float 4s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
        jiggle: 'jiggle 0.5s ease-in-out',
      },
      keyframes: {
        wobble: {
          '0%, 100%': { transform: 'rotate(-3deg) scale(1)' },
          '50%': { transform: 'rotate(3deg) scale(1.03)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        jiggle: {
          '0%, 100%': { transform: 'scale(1)' },
          '25%': { transform: 'scale(1.1) rotate(-2deg)' },
          '75%': { transform: 'scale(1.1) rotate(2deg)' },
        },
      },
    },
  },
  plugins: [],
};
