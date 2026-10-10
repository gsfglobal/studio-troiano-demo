/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  safelist: ['btn-primary', 'btn-ghost', 'btn-light', 'btn-outline-light'],
  theme: {
    screens: { sm: '640px', md: '768px', lg: '1024px', xl: '1280px', '2xl': '1600px' },
    extend: {
      colors: {
        ink: 'rgb(var(--ink) / <alpha-value>)',
        'ink-soft': 'rgb(var(--ink-soft) / <alpha-value>)',
        paper: 'rgb(var(--paper) / <alpha-value>)',
        mist: 'rgb(var(--mist) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        blue: 'rgb(var(--blue) / <alpha-value>)',
        'blue-deep': 'rgb(var(--blue-deep) / <alpha-value>)',
        green: 'rgb(var(--green) / <alpha-value>)',
        aqua: 'rgb(var(--aqua) / <alpha-value>)',
        sky: 'rgb(var(--sky) / <alpha-value>)',
        night: 'rgb(var(--night) / <alpha-value>)',
        'night-2': 'rgb(var(--night-2) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'Cormorant', 'Georgia', 'Times New Roman', 'serif'],
      },
      maxWidth: { site: '1440px' },
      transitionTimingFunction: { 'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)' },
    },
  },
  plugins: [],
}
