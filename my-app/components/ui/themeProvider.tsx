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
    const [theme, setThemeState] = useState<Theme>("light"); // Always start with light to avoid hydration mismatch
    const [mounted, setMounted] = useState(false);
  
    // Initialize theme after component mounts to avoid hydration mismatch
    useEffect(() => {
      setMounted(true);
      
      // Get theme from localStorage or system preference
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "light" || savedTheme === "dark") {
        setThemeState(savedTheme);
      } else {
        // Check system preference
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        setThemeState(systemTheme);
      }
    }, []);

    useEffect(() => {
      if (mounted) {
        // Use requestAnimationFrame to ensure DOM is ready
        requestAnimationFrame(() => {
          document.documentElement.classList.remove("light", "dark");
          document.documentElement.classList.add(theme);
          localStorage.setItem("theme", theme);
        });
      }
    }, [theme, mounted]);

  
    // Listen for system theme changes
    useEffect(() => {
      if (!mounted) return;
      
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent) => {
        // Only auto-switch if no manual preference is saved
        if (!localStorage.getItem("theme")) {
          setThemeState(e.matches ? "dark" : "light");
        }
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }, [mounted]);
  
    const toggleTheme = useCallback(() => {
      setThemeState((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    }, []);
  
    const setSpecificTheme = useCallback((newTheme: Theme) => {
      if (newTheme === "light" || newTheme === "dark") {
        setThemeState(newTheme);
      }
    }, []);

    // Don't render children until mounted to prevent hydration mismatch
    if (!mounted) {
      return (
        <ThemeContext.Provider
          value={{ theme: "light", setTheme: setSpecificTheme, toggleTheme }}
        >
          {children}
        </ThemeContext.Provider>
      );
    }
  
    return (
      <ThemeContext.Provider
        value={{ theme, setTheme: setSpecificTheme, toggleTheme }}
      >
        {children}
      </ThemeContext.Provider>
    );
  };
  
  export default ThemeProvider;