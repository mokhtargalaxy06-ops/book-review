/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#17211b',
        parchment: '#f7f3e8',
        moss: {
          50: '#f3f8f3',
          100: '#e3efe3',
          500: '#4f7c59',
          600: '#3d6547',
          700: '#32523b',
          900: '#1c3023',
        },
        amberbook: '#d69b42',
      },
      fontFamily: {
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        book: '0 22px 60px -30px rgba(31, 48, 37, .45)',
      },
    },
  },
  plugins: [],
}
