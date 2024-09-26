// tailwind.config.js
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#457b9d', // blue-700
        primaryHover: '#1d3557', // blue-600
        secondary: '#10B981', // green-500
        secondaryHover: '#059669', // green-600
        danger: '#EF4444', // red-500
        dangerHover: '#DC2626', // red-600
        background: '#F3F4F6', // gray-100
        foreground: '#1F2937', // gray-800
        accepted: '#c6f6d5', // green-200
        rejected: '#fed7d7', // red-200
        pending: '#fefcbf', // yellow-200
        default: '#e2e8f0', // gray-200
      },
      fontSize: {
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
};