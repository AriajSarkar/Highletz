/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{ts,tsx,html}"],
  theme: {
    extend: {
      colors: {
        'today': {
          light: 'rgba(46, 160, 67, 0.15)',
          border: '#2ea44f',
        },
        'yesterday': {
          light: 'rgba(217, 119, 6, 0.15)',
          border: '#d97706',
        },
        'recent': {
          light: 'rgba(88, 166, 255, 0.15)',
          border: '#58a6ff',
        }
      }
    },
  },
  plugins: [],
  // Make sure the CSS classes we need are included in the output
  safelist: [
    'gh-highlight-today',
    'gh-highlight-yesterday',
    'gh-highlight-recent'
  ]
}
