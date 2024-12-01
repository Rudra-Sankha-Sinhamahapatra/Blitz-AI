import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ts/useTheme';

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 p-2 rounded-lg bg-white dark:bg-gray-800 
                 shadow-lg hover:shadow-xl transition-all duration-300
                 text-gray-800 dark:text-gray-200 z-50"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
}