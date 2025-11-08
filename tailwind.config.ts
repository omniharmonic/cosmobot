import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // OpenCivics Brand Colors
        'oc-red': '#fa5273',
        'oc-green': '#4efa9f',
        'oc-blue': '#3b20e9',
        'oc-grey': '#e4e4e4',
        'oc-slate': '#262222',
        'oc-black': '#080808',
        'oc-white': '#ffffff',

        // Terminal theme colors (for terminal aesthetic)
        'terminal': {
          bg: '#0a0e1a',
          'bg-light': '#141b2d',
          fg: '#ccd6f6',
          'fg-muted': '#8892b0',
          border: '#1a2332',
          'border-bright': '#2a3342',
        },

        // Archetype colors
        'archetype': {
          allies: '#64ffda',
          innovators: '#c792ea',
          organizers: '#ffcb6b',
          patrons: '#f07178',
        },
      },
      fontFamily: {
        mono: [
          'JetBrains Mono',
          'Fira Code',
          'SF Mono',
          'Monaco',
          'ui-monospace',
          'monospace',
        ],
        sans: [
          'Inter',
          'SF Pro',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif',
        ],
        'sharp-grotesk-medium': ['Sharp Grotesk Medium', 'sans-serif'],
        'sharp-grotesk-light': ['Sharp Grotesk Light', 'sans-serif'],
        'roboto-mono': ['Roboto Mono', 'monospace'],
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
