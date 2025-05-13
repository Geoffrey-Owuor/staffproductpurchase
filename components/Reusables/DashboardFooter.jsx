"use client";

import { useLayoutEffect, useState, useRef } from "react"; // Use useLayoutEffect

export default function DashboardFooter({ isSidebarOpen }) {
  const [isScrollable, setIsScrollable] = useState(false);
  const timeoutRef = useRef(null);

  // useLayoutEffect runs synchronously after DOM mutations
  useLayoutEffect(() => {
    const checkScrollable = () => {
      // Perform the scrollability check immediately
      const hasScrollbar =
        document.documentElement.scrollHeight > window.innerHeight;

      // Clear any existing timeout to debounce the state update
      clearTimeout(timeoutRef.current);

      // Schedule the state update after a short delay
      // This debounces the state change, preventing excessive re-renders
      // during rapid events like scrolling.
      timeoutRef.current = setTimeout(() => {
        // Only update state if it has changed
        if (hasScrollbar !== isScrollable) {
          setIsScrollable(hasScrollbar);
        }
      }, 100); // Adjust the delay as needed, 100ms is a common debounce value
    };

    // Initial check when the component mounts
    checkScrollable();

    // Set up observers to detect DOM changes and resize events
    // These will call checkScrollable when changes occur
    const resizeObserver = new ResizeObserver(checkScrollable);
    // Observe the body for overall layout changes
    resizeObserver.observe(document.body);

    const mutationObserver = new MutationObserver(checkScrollable);
    // Observe the body for changes to its children, subtree, attributes, and character data
    mutationObserver.observe(document.body, {
      childList: true, // Observe direct children
      subtree: true, // Observe all descendants
      attributes: true, // Observe attribute changes
      characterData: true, // Observe changes to text content
    });

    // Add event listeners for window resize and scroll
    // The scroll listener uses { passive: true } for better performance
    window.addEventListener("resize", checkScrollable);
    window.addEventListener("scroll", checkScrollable, { passive: true });

    // Cleanup function: disconnect observers and remove event listeners
    // when the component unmounts or the effect re-runs (though dependencies are empty)
    return () => {
      clearTimeout(timeoutRef.current); // Clear any pending timeout
      resizeObserver.disconnect(); // Stop observing resize
      mutationObserver.disconnect(); // Stop observing mutations
      window.removeEventListener("resize", checkScrollable); // Remove resize listener
      window.removeEventListener("scroll", checkScrollable); // Remove scroll listener
    };

    // The effect has no dependencies, so it runs once after the initial render
    // and the cleanup runs when the component unmounts.
  }, [isScrollable]); // Added isScrollable as a dependency to ensure the comparison in timeout uses latest state

  // Calculate the CSS classes for the footer based on scrollability and sidebar state
  const footerClasses = [
    "bg-white", // Always apply white background
    isScrollable // If the page is scrollable...
      ? `${isSidebarOpen ? "ml-56" : "ml-0"}` // ...use normal flow positioning with margin based on sidebar
      : `fixed right-0 bottom-0 left-0 ${isSidebarOpen ? "ml-56" : "ml-0"}`, // ...otherwise, use fixed positioning with margin
    // Optional: Add a transition class for smoother visual changes
    // "transition-all",
    // "duration-300",
    // "ease-in-out",
  ].join(" "); // Join the array of classes into a single string

  return (
    <footer className={footerClasses}>
      <div className="mx-auto max-w-4xl px-4">
        <div className="py-3 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Hotpoint Appliances Ltd. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
