import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // New Design System Colors
        border: {
          primary: 'var(--border-primary)',
        },
        background: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
        },
        foreground: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
        },
        accent: 'var(--accent)',

        // OpenCivics Brand Colors (preserved)
        'oc': {
          red: '#fa5273',
          green: '#4efa9f',
          blue: '#3b20e9',
          grey: '#e4e4e4',
          slate: '#262222',
          black: '#080808',
          white: '#ffffff',
        },

        // Archetype colors (preserved)
        'archetype': {
          allies: '#64ffda',
          innovators: '#c792ea',
          organizers: '#ffcb6b',
          patrons: '#f07178',
        },

        // Chat-specific colors
        'chat': {
          'message-user': 'var(--chat-message-user)',
          'message-bot': 'var(--chat-message-bot)',
          'message-border': 'var(--chat-message-border)',
        },
      },
      fontFamily: {
        // Modern headers (Rubik/system)
        'header': ['Rubik', 'system-ui', '-apple-system', 'sans-serif'],
        // Chat/terminal monospace
        'chat': ['Roboto Mono', 'JetBrains Mono', 'monospace'],
        // Body text
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
        mono: ['Roboto Mono', 'JetBrains Mono', 'monospace'],
      },
      animation: {
        'cursor-blink': 'cursor-blink 1s step-end infinite',
        'text-reveal': 'text-reveal 0.3s ease-out',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        'cursor-blink': {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        'text-reveal': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scanline': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
