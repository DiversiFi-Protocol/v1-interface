// Context provider for theme
import { createContext, useCallback, useContext, useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/state/appTypes';
import { setTheme } from '@/state/theme';
import { selectTheme } from '@/state/themeSelector';

type ThemeContextType = {
  theme: 'light' | 'dark';
  toggleTheme: (setTo: 'light' | 'dark') => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const theme = useAppSelector(selectTheme);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = useCallback(
    (setTo: 'light' | 'dark') => {
      dispatch(setTheme(setTo));
    },
    [dispatch]
  );

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};
