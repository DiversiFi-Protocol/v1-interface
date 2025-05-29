import { Moon, Sun } from 'lucide-react';

import { useTheme } from '@/providers/ThemeProvider';

import { Button } from './ui/button';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      onClick={() => toggleTheme(theme === 'dark' ? 'light' : 'dark')}
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 text-foreground" />
      ) : (
        <Moon className="h-5 w-5 text-foreground" />
      )}
    </Button>
  );
}
