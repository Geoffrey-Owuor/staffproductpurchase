"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

// Define the theme options in an array
const themeOptions = [
  { name: "light", Icon: Sun },
  { name: "dark", Icon: Moon },
  { name: "system", Icon: Monitor },
];

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ignore if user is typing in an input, textarea, or contenteditable element
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target.isContentEditable
      ) {
        return;
      }
      if (e.key === "d" || e.key === "D") {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [setTheme, resolvedTheme]);

  if (!mounted) {
    // Avoid rendering theme-dependent UI until the client has mounted
    return null;
  }

  return (
    <div className="flex items-center space-x-1 rounded-full bg-gray-100 p-1 md:p-2 dark:bg-gray-800">
      {themeOptions.map(({ name, Icon }) => (
        <button
          key={name}
          onClick={() => setTheme(name)}
          className={`rounded-full p-1 transition ${
            theme === name
              ? "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white"
              : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          }`}
          aria-label={`Switch to ${name} theme`}
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}
