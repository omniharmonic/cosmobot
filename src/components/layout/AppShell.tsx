'use client';

import { ThemeProvider } from '@/contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <ThemeProvider>
      <div className="app-shell relative min-h-screen">
        <main className="flex-1">
          {children}
        </main>
        {/* Theme toggle in bottom right */}
        <div className="fixed bottom-6 right-6 z-50">
          <ThemeToggle />
        </div>
      </div>
    </ThemeProvider>
  );
}