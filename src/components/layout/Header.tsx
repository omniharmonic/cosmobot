'use client';

import ThemeToggle from './ThemeToggle';
import { useTheme } from '@/contexts/ThemeContext';

export default function Header() {
  const { theme } = useTheme();

  return (
    <header className="h-16 border-b border-border-primary bg-background-primary flex items-center justify-between px-6">
      {/* Left spacer */}
      <div className="w-10" />

      {/* Centered Logo */}
      <div className="flex-1 flex justify-center items-center">
        <div className="flex items-center gap-3">
          <img
            src={theme === 'dark' ? '/logo-green.svg' : '/logo-blue.svg'}
            alt="OpenCivics"
            className="w-6 h-6 object-contain"
          />
          <h1 className="text-xl font-header font-semibold text-foreground-primary">
            OpenCivics
          </h1>
        </div>
      </div>

      {/* Right - Theme Toggle */}
      <div className="w-10 flex justify-end">
        <ThemeToggle />
      </div>
    </header>
  );
}