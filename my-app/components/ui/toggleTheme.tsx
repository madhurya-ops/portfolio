import React from "react";
import { Button } from "./button";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./themeProvider";
import { usePathname } from "next/navigation";

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  const handleToggle = (e: React.MouseEvent) => {
    // Prevent any default behavior
    e.preventDefault();
    e.stopPropagation();
    
    // Don't toggle theme on landing page
    if (!isLandingPage) {
      toggleTheme();
    }
  };

  return (
    <Button
      variant="ghost"
      size="lg" // Changed from "default" to "lg" for larger button size
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      onClick={handleToggle}
      type="button"
      className={`bg-transparent hover:bg-transparent transition-all duration-300 hover:scale-125 active:scale-105 border-none outline-none focus:outline-none ${
        isLandingPage ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      }`}
    >
      {theme === "light" ? (
        <Moon className="w-8 h-8 text-white transition-all duration-300 hover:rotate-12 stroke-3" />
      ) : (
        <Sun className="w-8 h-8 text-white transition-all duration-300 hover:rotate-12 stroke-3" />
      )}
    </Button>
  );
};

export default ThemeToggle;
