/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          50: "#f9f9f9",
          100: "#f0f0f0",
          200: "#e0e0e0",
          300: "#c0c0c0",
          400: "#a0a0a0",
          500: "#808080",
          600: "#606060",
          700: "#404040",
          800: "#202020",
          900: "#101010",
        },
        accent: {
          gold: "#d4af37",
          silver: "#c0c0c0",
          neon: {
            blue: '#00ffff',
            purple: '#ff00ff',
            cyan: '#00ffea',
            pink: '#ff0080',
          }
        },
        cyber: {
          900: '#0a0a0a',
          800: '#121212',
          glow: '#d4af37',
        }
      },
      animation: {
        'neon-pulse': 'neonPulse 2s ease-in-out infinite',
        'float-slow': 'float 4s ease-in-out infinite',
        'bounce-glow': 'bounceGlow 3s ease-in-out infinite',
      },
      keyframes: {
        neonPulse: {
          '0%, 100%': { boxShadow: '0 0 5px var(--neon-blue), 0 0 10px var(--neon-blue), 0 0 15px var(--neon-blue)' },
          '50%': { boxShadow: '0 0 20px var(--neon-blue), 0 0 40px var(--neon-blue), 0 0 60px var(--neon-blue)' },
        },
        bounceGlow: {
          '0%, 100%': { transform: 'translateY(0)', boxShadow: '0 10px 30px rgba(212, 175, 55, 0.2)' },
          '50%': { transform: 'translateY(-10px)', boxShadow: '0 20px 50px rgba(212, 175, 55, 0.4)' },
        }
      }
    },
  },
  plugins: [],
}
