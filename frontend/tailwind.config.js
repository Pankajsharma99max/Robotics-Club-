/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'neon-blue': '#00f0ff',
                'neon-purple': '#b000ff',
                'neon-pink': '#ff00ff',
                'dark-bg': '#0a0a0f',
                'dark-surface': '#1a1a2e',
                'dark-card': '#16213e',
            },
            fontFamily: {
                'sans': ['Inter', 'system-ui', 'sans-serif'],
                'display': ['Orbitron', 'sans-serif'],
            },
            animation: {
                'glow': 'glow 2s ease-in-out infinite alternate',
                'float': 'float 3s ease-in-out infinite',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                glow: {
                    'from': {
                        textShadow: '0 0 10px #00f0ff, 0 0 20px #00f0ff, 0 0 30px #00f0ff',
                    },
                    'to': {
                        textShadow: '0 0 20px #00f0ff, 0 0 30px #b000ff, 0 0 40px #b000ff',
                    },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
}
