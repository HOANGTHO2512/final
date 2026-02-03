/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#2563eb',
                    light: '#eff6ff',
                    dark: '#1e3a8a',
                },
                surface: '#ffffff',
                'text-main': '#0f172a',
                'text-sub': '#64748b',
            },
            fontFamily: {
                sans: ['Inter', 'Noto Sans TC', 'sans-serif'],
            },
            animation: {
                'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            },
            keyframes: {
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
            boxShadow: {
                'soft': '0 10px 40px -10px rgba(37, 99, 235, 0.1)',
                'hover': '0 20px 40px -10px rgba(37, 99, 235, 0.2)',
            },
        },
    },
    plugins: [],
}
