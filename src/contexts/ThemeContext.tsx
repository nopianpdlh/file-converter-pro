import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved === "light" || saved === "dark") {
        return saved as Theme;
      }
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
    }
    return "light";
  });

  const applyThemeToDOM = (newTheme: Theme) => {
    if (typeof window !== "undefined") {
      const html = document.documentElement;

      // Remove both classes first
      html.classList.remove("dark", "light");

      // Add the new theme class
      html.classList.add(newTheme);

      // Set color scheme
      html.setAttribute("data-theme", newTheme);
      html.style.colorScheme = newTheme;

      console.log(
        `Applied theme: ${newTheme}, HTML classes: ${html.className}`
      );
    }
  };

  // Apply theme on mount
  useEffect(() => {
    applyThemeToDOM(theme);
  }, []);

  // Apply theme when it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
      applyThemeToDOM(theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
