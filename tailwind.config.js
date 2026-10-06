/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      boxShadow: {
        'neu-flat': '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff',
        'neu-sm': '4px 4px 8px #d1d9e6, -4px -4px 8px #ffffff',
        'neu-inset': 'inset 4px 4px 8px #d1d9e6, inset -4px -4px 8px #ffffff',
        'neu-dark-flat': '8px 8px 18px #080c14, -8px -8px 18px #182234',
        'neu-dark-sm': '4px 4px 10px #080c14, -4px -4px 10px #182234',
        'neu-dark-inset': 'inset 4px 4px 8px #080c14, inset -4px -4px 8px #182234',
      },
    },
  },
  plugins: [],
};
