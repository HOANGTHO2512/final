/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Primary Colors
                primary: {
                    50: '#EFF8FC',
                    100: '#D1EBF7',
                    DEFAULT: '#9FD7F9',
                    500: '#9FD7F9',
                    600: '#6FC4F4',
                    700: '#3FA8E8',
                },
                // Accent Colors
                accent: {
                    50: '#F5F3FF',
                    100: '#EDE9FE',
                    DEFAULT: '#7C3AED',
                    500: '#7C3AED',
                    600: '#6D28D9',
                    700: '#5B21B6',
                },
                // Status Colors
                success: '#10B981',
                warning: '#F59E0B',
                error: '#EF4444',
                info: '#0EA5E9',
                // Neutral Colors
                'light-gray': '#F3F4F6',
                'dark-gray': '#374151',
                'text-main': '#374151',
                'text-sub': '#9CA3AF',
                surface: '#FFFFFF',
            },
            fontFamily: {
                sans: ['Inter', 'Noto Sans TC', 'sans-serif'],
            },
            animation: {
                'fade-in-up': 'fadeInUp 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
                'slide-up': 'slideUp 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
            },
            keyframes: {
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(40px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(40px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
            boxShadow: {
                'soft': '0 10px 40px -10px rgba(159, 215, 249, 0.2)',
                'hover': '0 20px 40px -10px rgba(159, 215, 249, 0.3)',
            },
        },
    },
    plugins: [],
}
