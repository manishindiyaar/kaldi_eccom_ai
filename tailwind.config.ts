import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'foreground-muted': "var(--foreground-muted)",
        primary: {
          DEFAULT: '#00d9ff',
          dark: '#0099cc',
          light: '#66e5ff',
        },
        accent: {
          DEFAULT: '#ff6b35',
          dark: '#cc5529',
          light: '#ff9770',
        },
        card: {
          bg: 'var(--card-bg)',
          'bg-hover': 'var(--card-bg-hover)',
          border: 'var(--card-border)',
          'border-hover': 'var(--card-border-hover)',
        },
        status: {
          success: 'var(--success)',
          error: 'var(--error)',
          warning: 'var(--warning)',
          info: 'var(--info)',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'wave': 'wave 1.5s ease-in-out infinite',
        'ripple': 'ripple 1.5s ease-out infinite',
        'fade-in': 'fade-in 0.3s ease-in-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-in-left': 'slide-in-left 0.3s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': {
            opacity: '1',
            boxShadow: '0 0 20px var(--primary), 0 0 40px var(--primary)',
          },
          '50%': {
            opacity: '0.7',
            boxShadow: '0 0 30px var(--primary), 0 0 60px var(--primary)',
          },
        },
        wave: {
          '0%, 100%': { transform: 'scaleY(0.5)' },
          '50%': { transform: 'scaleY(1)' },
        },
        ripple: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(1.5)', opacity: '0' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { transform: 'translateY(20px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-in-left': {
          from: { transform: 'translateX(-100%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-in-right': {
          from: { transform: 'translateX(100%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        'glow-pulse': {
          '0%, 100%': {
            filter: 'drop-shadow(0 0 10px var(--primary)) drop-shadow(0 0 20px var(--primary))',
          },
          '50%': {
            filter: 'drop-shadow(0 0 20px var(--primary)) drop-shadow(0 0 40px var(--primary))',
          },
        },
      },
      transitionDuration: {
        'fast': '150ms',
        'normal': '300ms',
        'slow': '500ms',
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(0, 217, 255, 0.3)',
        'glow-accent': '0 0 20px rgba(255, 107, 53, 0.3)',
        'glow-primary-lg': '0 0 20px rgba(0, 217, 255, 0.3), 0 0 40px rgba(0, 217, 255, 0.3)',
      },
    },
  },
  plugins: [],
};
export default config;
