import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@kareemelbalshe/any-table/**/*.{js,mjs,jsx}',
    '../../node_modules/@kareemelbalshe/any-table/**/*.{js,mjs,jsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        farahna: {
          burgundy: '#720925',
          darkBurgundy: '#4A0E17',
          gold: '#D4AF37',
          lightGold: '#F3E5AB',
          darkGold: '#997A15',
          cream: '#FAF7F2',
          sand: '#F2EBD9',
          charcoal: '#1A1819',
          rose: '#9C5162',
          softPink: '#FBF3F5',
        },
      },
      fontFamily: {
        cairo: ['var(--font-cairo)', 'Cairo', 'sans-serif'],
        tajawal: ['var(--font-tajawal)', 'Tajawal', 'sans-serif'],
        amiri: ['var(--font-amiri)', 'Amiri', 'serif'],
      },
      keyframes: {
        'envelope-open': {
          '0%': { transform: 'rotateX(0deg)' },
          '100%': { transform: 'rotateX(-180deg)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'envelope-open': 'envelope-open 1s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
      },
    },
  },
  plugins: [],
};

export default config;
