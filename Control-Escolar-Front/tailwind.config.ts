// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontFamily: {
      'kaushan': ['Kaushan Script', 'cursive'],
      'lato': ['Lato', 'sans-serif'],
    },
    extend: {
      colors: {
        'azulF': {
          '50': '#f5f7fa',
          '100': '#eaeef4',
          '200': '#d0dbe7',
          '300': '#a7bcd2',
          '400': '#7899b8',
          '500': '#577ca0',
          '600': '#436386',
          '700': '#37516d',
          '800': '#2e4156',
          '900': '#2d3b4d',
          '950': '#1e2733',
        },

        'grisF': {
          '50': '#f7f8f8',
          '100': '#eef0f0',
          '200': '#d9dede',
          '300': '#aab7b7',
          '400': '#90a0a0',
          '500': '#728585',
          '600': '#5c6c6d',
          '700': '#4b5959',
          '800': '#414b4b',
          '900': '#394141',
          '950': '#262b2b',
        },

        'grisC': {
          '50': '#f7f8f8',
          '100': '#eeeff0',
          '200': '#d8dddf',
          '300': '#c0c8ca',
          '400': '#8f9da1',
          '500': '#728185',
          '600': '#5c696d',
          '700': '#4b5659',
          '800': '#40494c',
          '900': '#393f41',
          '950': '#262a2b',
        },

        'hueso': {
          '50': '#f6f7f8',
          '100': '#eaecef',
          '200': '#d4d8dd',
          '300': '#c2c8ce',
          '400': '#a4acb6',
          '500': '#8d96a4',
          '600': '#7c8494',
          '700': '#6f7586',
          '800': '#5e626f',
          '900': '#4d515b',
          '950': '#323439',
        },

        'customDanger': {
          DEFAULT: '#D90429', // Un rojo fuerte para pruebas
          light: '#FFCCCC',   // Tono claro para fondos
          dark: '#9A031B',    // Tono oscuro para bordes
        },

      },
      fontSize: {
        xs: ['12px', { lineHeight: '16px' }],
        sm: ['14px', { lineHeight: '20px' }],
        base: ['16px', { lineHeight: '24px' }],
        lg: ['18px', { lineHeight: '28px' }],
        xl: ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['30px', { lineHeight: '36px' }],
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '32px',
        '3xl': '48px',
      },
      borderRadius: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
      },
    },
  },
  plugins: [],
};

export default config;
