/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['Lora', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      colors: {
        paper: '#fffff8',
        ink: '#1a1a1a',
        'ink-light': '#666666',
        accent: '#d00000',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
