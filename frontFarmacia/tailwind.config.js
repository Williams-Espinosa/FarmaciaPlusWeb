export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          pharmacy: {
            light: '#e0f2fe', // sky-100
            DEFAULT: '#0284c7', // sky-600
            dark: '#0c4a6e', // sky-900
            accent: '#0ea5e9', // sky-500
          }
        }
      },
    },
    plugins: [],
  }
