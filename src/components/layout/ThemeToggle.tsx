'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 border-none rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--bg-primary)] flex items-center justify-center transition-all duration-200 hover:scale-105"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon size={16} className="text-[var(--text-primary)]" />
      ) : (
        <Sun size={16} className="text-[var(--text-primary)]" />
      )}
    </button>
  );
}