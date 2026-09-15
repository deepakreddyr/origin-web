import type { Config } from 'tailwindcss';
import 'tailwindcss/defaultTheme';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        SofiaPro: ['"SofiaPro"'],
        Stinger: ['"Stinger"'],
        Recoleta: ['"Recoleta"', 'Georgia', 'serif']
      },
      colors: {
        danger: '#C70000',
        error: '#D0583F',
        beige: {
          100: '#F8F4E9',
          200: '#F2EEE4'
        },
        primary: {
          DEFAULT: '#fac510',
          100: '#F8F4E9',
          '100-0': '#F8F4E900',
          '100-80': '#F8F4E9cc',
          200: '#EDE6D4',
          '200-0': '#EDE6D400',
          '200-80': '#EDE6D4CC'
        },
        secondary: {
          DEFAULT: '#619269',
          100: '#DDEEDD',
          200: '#CFE6D2',
          300: '#26B45F',
          400: '#231F20'
        },
        oGrey: {
          DEFAULT: '#BFBFBF',
          100: '#EEEEEE',
          200: '#D9D9D9',
          300: '#E5E4E4'
        },
        black: {
          DEFAULT: '#231f20',
          'op-60': '#231f2099',
          'op-50': '#231f2080',
          'op-30': '#231F204d',
          'op-80': '#231F20CC',
          'op-70': '#231F20B2'
        },
        'brand-yellow': {
          100: '#f9db5a',
          200: '#ffdd00',
          300: '#ffd000',
          400: '#fac510',
          500: '#febe10',
          600: '#fbab18'
        },
        ink: {
          DEFAULT: '#191712',
          soft: '#2c281f'
        },
        cream: {
          DEFAULT: '#faf6ec',
          dim: '#f3ecdc'
        },
        paper: '#fffdf8',
        'og-grey': {
          DEFAULT: '#6b6558',
          light: '#a39d8c'
        }
      },
      boxShadow: {
        origin: '0 5px 0 0 rgb(0,0,0,05%)',
        sm: '4px 4px 32px 0px #00000014'
      },
      screens: {
        mob: { max: '600px' },
        xs: '390px',
        sm: '600px',

        // 👇 New and improved device-based breakpoints
        tabp: '768px', // iPad portrait (768x1024)
        tabl: '1024px', // iPad landscape (1024x1366)
        chrometab: '1024px', // Chromebook/small tablet landscape (1024x600)

        md: '900px',
        midlg: '1180px',
        lg: '1150px',
        xl: '1450px',
        '2xl': '1600px'
      },
      backgroundImage: {
        noise: "url('/assets/noise-texture.png')"
      },
      animation: {
        'infinite-scroll': 'infinite-scroll 50s linear infinite',
        'marquee-left': 'marquee-left var(--duration, 30s) linear infinite'
      },
      keyframes: {
        'infinite-scroll': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-100%)' }
        },
        'marquee-left': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }
        }
      }
    }
  },
  plugins: []
};

export default config;
