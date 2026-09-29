/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0a0a0a',
        brass: {
          300: '#f3d08a',
          400: '#e9b558',
          500: '#d99a35',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Sora', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
