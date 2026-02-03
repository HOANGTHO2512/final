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
                    50: '#EFF6FF',
                    100: '#DBEAFE',
                    DEFAULT: '#2563EB',
                    500: '#2563EB',
                    600: '#1D4ED8',
                    700: '#1E40AF',
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
