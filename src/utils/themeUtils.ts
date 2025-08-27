// Script to force apply dark mode
export const applyTheme = (theme: "dark" | "light") => {
  const htmlElement = document.documentElement;

  // Remove all theme classes first
  htmlElement.classList.remove("dark", "light");

  // Add the new theme class
  htmlElement.classList.add(theme);

  // Force style recalculation
  htmlElement.style.display = "none";
  htmlElement.offsetHeight; // Trigger reflow
  htmlElement.style.display = "";

  // Update color scheme for browser
  htmlElement.style.colorScheme = theme;

  console.log("Force applied theme:", theme);
  console.log("HTML classes:", htmlElement.className);
};
