import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0b1220',
        foreground: '#e6ebff',
        glass: 'rgba(255,255,255,0.06)'
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.35)'
      },
      backdropBlur: {
        xs: '2px'
      },
      fontFamily: {
        inter: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      animation: {
        fadeIn: 'fadeIn 600ms ease-out',
        float: 'float 6s ease-in-out infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' }
        }
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
}
export default config
