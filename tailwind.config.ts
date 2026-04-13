import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0D1B2A',
        'navy-light': '#1A2E45',
        surface: '#F4F6F8',
        'surface-dark': '#E8EDF2',
        border: '#CBD5E1',
        'border-dark': '#94A3B8',
        accent: '#16A34A',
        'accent-dark': '#15803D',
        danger: '#B91C1C',
        'danger-light': '#FEF2F2',
        'danger-border': '#FECACA',
        amber: '#D97706',
        'amber-light': '#FFFBEB',
        text: {
          primary: '#0D1B2A',
          secondary: '#475569',
          muted: '#94A3B8',
          inverse: '#F8FAFC',
        },
      },
      fontFamily: {
        sans: ['IBM Plex Sans', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.10)',
      },
    },
  },
  plugins: [],
}

export default config
