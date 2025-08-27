import React from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useToast } from "../contexts/ToastContext";

export const TestThemeAndToast: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useToast();

  const testToast = (type: "success" | "error" | "warning" | "info") => {
    addToast({
      type,
      message: `Test ${type} toast message!`,
      duration: 3000,
    });
  };

  const checkDarkMode = () => {
    const hasClass = document.documentElement.classList.contains("dark");
    addToast({
      type: "info",
      message: `HTML has dark class: ${hasClass}`,
      duration: 3000,
    });
    console.log("Current HTML classes:", document.documentElement.className);
    console.log("Current theme state:", theme);
  };

  return (
    <div className="fixed bottom-4 left-4 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-300 dark:border-slate-600">
      <h3 className="text-sm font-semibold mb-3 text-gray-900 dark:text-white">
        Debug Panel
      </h3>

      {/* Visual indicator */}
      <div className="mb-3 p-2 rounded bg-gray-100 dark:bg-slate-700">
        <div className="text-xs">
          <div className="text-gray-600 dark:text-gray-300">
            Current: {theme}
          </div>
          <div className="text-gray-600 dark:text-gray-300">
            Dark class:{" "}
            {document.documentElement.classList.contains("dark") ? "YES" : "NO"}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex gap-2">
          <button
            onClick={toggleTheme}
            className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
          >
            Toggle Theme
          </button>
          <button
            onClick={checkDarkMode}
            className="px-3 py-1 bg-purple-500 text-white text-xs rounded hover:bg-purple-600"
          >
            Check Dark
          </button>
        </div>

        <div className="flex gap-1">
          <button
            onClick={() => testToast("success")}
            className="px-2 py-1 bg-green-500 text-white text-xs rounded"
          >
            Success
          </button>
          <button
            onClick={() => testToast("error")}
            className="px-2 py-1 bg-red-500 text-white text-xs rounded"
          >
            Error
          </button>
          <button
            onClick={() => testToast("warning")}
            className="px-2 py-1 bg-yellow-500 text-white text-xs rounded"
          >
            Warning
          </button>
          <button
            onClick={() => testToast("info")}
            className="px-2 py-1 bg-blue-500 text-white text-xs rounded"
          >
            Info
          </button>
        </div>
      </div>
    </div>
  );
};
