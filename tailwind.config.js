/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          pink: '#BD477A',
          green: '#3CC345',
          purple: '#4D497E',
          blue: '#3A6FB6',
        },
        ink: {
          50: '#f6f7fb',
          100: '#eceef6',
          200: '#d5dae9',
          300: '#b0bad4',
          400: '#8593bd',
          500: '#6572a5',
          600: '#4d497e',
          700: '#403f6a',
          800: '#363a58',
          900: '#1f2338',
          950: '#131625',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 20px -4px rgb(19 22 37 / 0.12)',
        lift: '0 10px 30px -8px rgb(19 22 37 / 0.22)',
      },
    },
  },
  plugins: [],
}
