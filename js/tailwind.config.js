tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        telugu: ['Noto Sans Telugu', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        temple: {
          maroon: '#3b060d',
          deepWine: '#250207',
          gold: '#f5b041',
          goldLight: '#ffd97d',
          goldDark: '#b78103',
          vermilion: '#d9381e',
          saffron: '#ff7722',
          cream: '#fff9ea',
          cardBg: '#470b13',
        }
      },
      animation: {
        'glow-pulse': 'glowPulse 3s infinite ease-in-out',
        'spin-slow': 'spin 22s linear infinite',
        'float': 'float 4s ease-in-out infinite'
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { filter: 'drop-shadow(0 0 12px rgba(245, 176, 65, 0.45))' },
          '50%': { filter: 'drop-shadow(0 0 24px rgba(245, 176, 65, 0.85))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' }
        }
      }
    }
  }
};
