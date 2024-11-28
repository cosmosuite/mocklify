import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif'
        ],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "morph": "morph 8s ease-in-out infinite",
        "morph-slow": "morph 12s ease-in-out infinite",
        "morph-slower": "morph 16s ease-in-out infinite",
        "float-up": "floatUp 8s ease-in-out infinite",
        "glow": "glow 3s ease-in-out infinite",
      },
      keyframes: {
        morph: {
          '0%, 100%': {
            'border-radius': '40% 60% 70% 30% / 40% 40% 60% 50%'
          },
          '34%': {
            'border-radius': '70% 30% 50% 50% / 30% 30% 70% 70%'
          },
          '67%': {
            'border-radius': '30% 60% 70% 40% / 50% 60% 30% 60%'
          }
        },
        floatUp: {
          '0%, 100%': { transform: 'translateY(0)', opacity: '0' },
          '50%': { transform: 'translateY(-100px)', opacity: '0.5' }
        },
        glow: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.3' },
          '50%': { transform: 'scale(1.5)', opacity: '0.7' }
        }
      }
    },
  },
  plugins: [animate],
}