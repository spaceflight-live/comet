module.exports = {
  mode: 'jit',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'media',
  theme: {
    fontFamily: {
      inter: ['inter', 'sans-serif'],
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
