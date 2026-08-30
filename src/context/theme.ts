// frontend-company/src/context/theme.ts
import { createContext } from 'react';

export type Theme = 'light' | 'dark' | 'system';

export interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isTransitioning: boolean;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);