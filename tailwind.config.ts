import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0f0f0f',
        fg: '#e8e8e8',
        muted: '#888888',
        accent: '#a78bfa',
        border: '#222222',
      },
      maxWidth: {
        site: '680px',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
    },
  },
}

export default config
