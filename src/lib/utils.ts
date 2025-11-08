import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ===== DATE & TIME UTILITIES =====
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function timeAgo(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return formatDate(date);
}

// ===== STRING UTILITIES =====
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function truncate(text: string, length: number = 100): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '...';
}

// ===== VALIDATION UTILITIES =====
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// ===== ARRAY UTILITIES =====
export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function groupBy<T, K extends keyof any>(
  array: T[],
  key: (item: T) => K
): Record<K, T[]> {
  return array.reduce((result, item) => {
    const group = key(item);
    (result[group] = result[group] || []).push(item);
    return result;
  }, {} as Record<K, T[]>);
}

// ===== ARCHETYPE UTILITIES =====
export function getArchetypeColor(archetype: string): string {
  const colors = {
    allies: '#64ffda',      // Teal
    innovators: '#c792ea',  // Purple
    organizers: '#ffcb6b',  // Yellow
    patrons: '#f07178',     // Red/Pink
  };
  return colors[archetype as keyof typeof colors] || '#64ffda';
}

export function getArchetypeIcon(archetype: string): string {
  const icons = {
    allies: '🌱',
    innovators: '⚡',
    organizers: '🤝',
    patrons: '🎯',
  };
  return icons[archetype as keyof typeof icons] || '◯';
}

export function getArchetypeDescription(archetype: string): string {
  const descriptions = {
    allies: 'Those who sense the call and want to orient',
    innovators: 'Systems builders who experiment and push the field forward',
    organizers: 'Community weavers who turn frameworks into lived practice',
    patrons: 'Regenerative stewards who resource the conditions for emergence',
  };
  return descriptions[archetype as keyof typeof descriptions] || '';
}

// ===== CONFIDENCE UTILITIES =====
export function formatConfidence(confidence: number): string {
  return `${Math.round(confidence * 100)}%`;
}

export function getConfidenceLevel(confidence: number): 'high' | 'medium' | 'low' {
  if (confidence >= 0.75) return 'high';
  if (confidence >= 0.60) return 'medium';
  return 'low';
}

export function getConfidenceColor(confidence: number): string {
  const level = getConfidenceLevel(confidence);
  const colors = {
    high: '#10b981', // green
    medium: '#f59e0b', // amber
    low: '#ef4444', // red
  };
  return colors[level];
}

// ===== QUIZ UTILITIES =====
export function calculateProgress(currentQuestion: number, totalQuestions: number): number {
  return Math.round((currentQuestion / totalQuestions) * 100);
}

export function estimateTimeRemaining(
  currentQuestion: number,
  totalQuestions: number,
  avgTimePerQuestion: number = 30
): string {
  const remainingQuestions = totalQuestions - currentQuestion;
  const remainingSeconds = remainingQuestions * avgTimePerQuestion;

  if (remainingSeconds < 60) return `${remainingSeconds}s`;
  const minutes = Math.ceil(remainingSeconds / 60);
  return `${minutes}m`;
}

// ===== ERROR HANDLING UTILITIES =====
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'An unexpected error occurred';
}

export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    return error.message.includes('fetch') ||
           error.message.includes('network') ||
           error.message.includes('offline');
  }
  return false;
}

// ===== LOCAL STORAGE UTILITIES =====
export function safeLocalStorage() {
  if (typeof window === 'undefined') {
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    };
  }
  return window.localStorage;
}

export function saveToLocalStorage<T>(key: string, data: T): void {
  try {
    const storage = safeLocalStorage();
    storage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
}

export function loadFromLocalStorage<T>(key: string): T | null {
  try {
    const storage = safeLocalStorage();
    const item = storage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.warn('Failed to load from localStorage:', error);
    return null;
  }
}

// ===== BROWSER UTILITIES =====
export function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.clipboard) {
    return Promise.resolve(false);
  }

  return navigator.clipboard.writeText(text)
    .then(() => true)
    .catch(() => false);
}

export function shareUrl(url: string, title?: string): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.share) {
    return copyToClipboard(url);
  }

  return navigator.share({ url, title })
    .then(() => true)
    .catch(() => copyToClipboard(url));
}

// ===== DEBOUNCE & THROTTLE =====
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | undefined;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}