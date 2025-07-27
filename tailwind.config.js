import brandTheme from './src/styles/brand-theme.js';

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: brandTheme.colors,
      spacing: brandTheme.spacing,
    },
  },
  plugins: [],
};

export default config;
