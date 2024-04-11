/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        '2xl': '2560px',
        'min-md': { 'max': '767px' }
      },
      fontSize: {
        '2xs': '10px',
        '2sm': '13px',
        '3.5xl': '32px'
      },
      spacing: {
        6.5: '1.625rem',
        18: '4.5rem',
        21: '5.25rem',
        22: '5.5rem',
        25: '6.25rem',
        66: '16.5rem',
        68: '17rem',
        82: '21rem',
        84: '22rem',
        106: '30rem',
      },
      colors: {
        'nav-background': '#3F3F46',
        'neutral-primary': '#1e2226',
        'neutral-secondary': '#4C5863',
        'neutral-background': '#f1f3f5',
        'neutral-placeholder': '#8F9AA6',
        'neutral-disable': '#bec4cc',
        'neutral-divider': '#e6eaed',
        'neutral-title': '#050608',
        'neutral-white': '#FEFEFE',
        'neutral-gray-light': '#FAFBFC',
        'transparent-4': 'rgba(145, 158, 171, 0.16)',
        'neutral-border': '#D5DBE0',
        'secondary-background': '#f0f6ff',
        'secondary-main': '#CC4D23',
        'secondary-main-blue': '#3370CC',
        'secondary-border': '#709ADB',
        main: '#3370CC',
        'primary-background': '#EEFAF3',
        'primary-main': '#0E873F',
        'primary-green5': '#116534',
        'primary-border': '#5EB281',
        'litght-primary': '#212B36',
        'success-active': '#33991F',
        'success-background': '#EDFAE9',
        'error-active': '#D92B2B',
        'error-background': '#FFECEA',
        'error-border': "#F0AFA8",
        'warning-active': '#CC6A00',
        'warning-background': '#FFF3E6',
        'warning-darker': ' #7A4100',
        'info-background': '#D0F2FF',
        'info-active': '#1782E5',
        'blue-primary': '#3370CC',
        pink: '#D96285',
        gold: '#E59803',
        red5: '#99260F',
        red4: '#984F00',
        brown: '#984F00',
        violet: '#8F61F2',
        shopee: "#F1592A",
        lazada: "#00037E",
        'other-blue': '#4A94EC'
      },
      backgroundImage: {
        'linear-black': 'linear-gradient(180deg, rgba(22, 28, 36, 0) 0%, rgba(22, 28, 36, 0.4) 100%)',
      },
      boxShadow: {
        dropdown: '0px 4px 16px rgba(60, 69, 79, 0.2)',
        posSummary: '0px 4px 8px rgba(60, 69, 79, 0.1)',
        revert: '0px -2px 4px rgba(60, 69, 79, 0.1)',
        card: '0px 4px 12px rgba(60, 69, 79, 0.12)',
        productItem: '0px 2px 2px rgba(60, 69, 79, 0.1)'
      },
      zIndex: {
        1050: '1050',
        2000: '2000',
      },
      width: {
        xs: '368px',
        150: '37.5rem',
        '5/12': '41.66%',
        'a4': '210mm'
      },
      height: {
        'a4': '297mm',
      },
      minWidth: {
        'sm': '24rem',
        6: '1.5rem',
        20: '5rem',
        25: '6.25rem',
      },
      maxWidth: {
        '1/2': '50%',
        '1/12': '8.33%',
        '2/12': '16.66%',
        '3/12': '25%',
        '4/12': '33.33%',
        '5/12': '41.66%',
        '8/12': '66.66%',
        '9/12': '75%',
        '4/10': '40%',
        25: "6.25rem",
        37.5: "9.375rem",
        75: "18.75rem",
      },
      minHeight: {
        4: '1rem',
        14: '3.5rem',
        34.5: '8.625rem',
        64: '16rem',
      },
      maxHeight: {
        34.5: '8.625rem',
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
      },
      flex: {
        '2': "2 2 0%"
      }
    },
  },
  plugins: [],
  prefix: 'pw-',
};
