/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3D5A3C',
          light: '#4a6d48',
          dark: '#2f4630',
        },
        secondary: {
          DEFAULT: '#9CAF88',
          light: '#b1c29f',
          dark: '#879a74',
        },
        accent: {
          DEFAULT: '#C9A961',
          light: '#d4b97a',
          dark: '#b69451',
        },
        'dark-bg': '#0D0D0C',
        'light-bg': '#F5F3EE',
        'dark-text': '#E5E3DC',
        'light-text': '#333330',
        neutral: '#918B82',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
