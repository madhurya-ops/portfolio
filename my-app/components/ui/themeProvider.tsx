"use client"

import React, {
    useEffect,
    useState,
    createContext,
    useContext,
    useCallback,
    ReactNode,
    SetStateAction,
    Dispatch,
  } from "react";
  
  type Theme = "light" | "dark";
  interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
  }
  
  export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
  
  export function useTheme(): ThemeContextType {
    const context = useContext(ThemeContext);
    if (!context) {
      throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
  }
  
  interface ThemeProviderProps {
    children: ReactNode;
  }
  
  const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [theme, setThemeState] = useState<Theme>(() => {
      if (typeof window !== "undefined") {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "light" || savedTheme === "dark") {
          return savedTheme;
        }
        // Check system preference
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      }
      return "light";
    });
  
    useEffect(() => {
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(theme);
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", theme);
      }
    }, [theme]);
  
    // Listen for system theme changes
    useEffect(() => {
      if (typeof window !== "undefined") {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = (e: MediaQueryListEvent) => {
          // Only auto-switch if no manual preference is saved
          if (!localStorage.getItem("theme")) {
            setThemeState(e.matches ? "dark" : "light");
          }
        };
  
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
      }
    }, []);
  
    const toggleTheme = useCallback(() => {
      setThemeState((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    }, []);
  
    const setSpecificTheme = useCallback((newTheme: Theme) => {
      if (newTheme === "light" || newTheme === "dark") {
        setThemeState(newTheme);
      }
    }, []);
  
    return (
      <ThemeContext.Provider
        value={{ theme, setTheme: setSpecificTheme, toggleTheme }}
      >
        {children}
      </ThemeContext.Provider>
    );
  };
  
  export default ThemeProvider;
  