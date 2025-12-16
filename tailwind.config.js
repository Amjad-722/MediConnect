/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx,svelte}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#00509D',
                    dark: '#003B73',
                    light: '#4A90E2',
                },
                secondary: {
                    DEFAULT: '#00C4CC',
                },
                accent: '#FF6B6B',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
