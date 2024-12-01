import { createContext } from "react";

interface ThemeContextType {
    isDark: boolean;
    toggleTheme: () => void;
  }
  
  export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);