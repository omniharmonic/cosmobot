'use client';

import { ThemeProvider } from '@/contexts/ThemeContext';

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
      </div>
    </ThemeProvider>
  );
}