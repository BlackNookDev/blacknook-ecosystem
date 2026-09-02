import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        zinc: {
          950: '#09090b',
          900: '#18181b',
          800: '#27272a',
          700: '#3f3f46',
        },
        bn: {
          bg: '#161618',
          surface: '#1c1c1f',
          elevated: '#242428',
        },
        wa: {
          header: '#075E54',
          headerLight: '#128C7E',
          chat: '#ECE5DD',
          accent: '#25D366',
          teal: '#008069',
          bubble: '#DCF8C6',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['var(--font-body)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        premium: '450ms',
      },
    },
  },
  plugins: [],
};

export default config;
