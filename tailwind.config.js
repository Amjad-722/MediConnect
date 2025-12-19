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
                    DEFAULT: '#00C4CC', // New primary (Cyan)
                    dark: '#009BA1',
                    light: '#CCF5F7',
                },
                secondary: {
                    DEFAULT: '#00509D', // New secondary (Navy)
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
