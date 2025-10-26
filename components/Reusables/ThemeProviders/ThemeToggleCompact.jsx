"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";

export default function ThemeToggleCompact() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // This effect ensures the component only renders on the client side.
  useEffect(() => {
    setMounted(true);
  }, []);

  // This effect adds a listener to close the dropdown when clicking outside of it.
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  if (!mounted) {
    return null; // Avoids hydration mismatch
  }

  const renderTriggerIcon = () => {
    // Displays the correct icon based on the current theme.
    switch (theme) {
      case "light":
        return <Sun className="h-5 w-5" />;
      case "dark":
        return <Moon className="h-5 w-5" />;
      default:
        return <Monitor className="h-5 w-5" />; // System theme
    }
  };

  const themeOptions = [
    { value: "light", label: "Light", icon: <Sun className="mr-2 h-4 w-4" /> },
    { value: "dark", label: "Dark", icon: <Moon className="mr-2 h-4 w-4" /> },
    {
      value: "system",
      label: "System",
      icon: <Monitor className="mr-2 h-4 w-4" />,
    },
  ];

  return (
    <div className="relative hidden md:block" ref={dropdownRef}>
      {/* Button to trigger the dropdown */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full p-2 text-gray-700 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        aria-label="Toggle theme menu"
      >
        {renderTriggerIcon()}
      </button>

      {/* The Dropdown Menu */}
      {isOpen && (
        <div className="absolute -left-15 z-50 mt-2 w-40 space-y-1 rounded-lg border border-gray-200 bg-white p-1 shadow-lg focus:outline-none dark:border-gray-700 dark:bg-gray-900">
          {themeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                setTheme(option.value);
                setIsOpen(false);
              }}
              className={`flex w-full items-center rounded-lg px-4 py-2 text-left text-sm transition-colors ${
                theme === option.value
                  ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
                  : "text-gray-700 dark:text-gray-300"
              } hover:bg-gray-100 hover:dark:bg-gray-800`}
              role="menuitem"
            >
              {option.icon}
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
