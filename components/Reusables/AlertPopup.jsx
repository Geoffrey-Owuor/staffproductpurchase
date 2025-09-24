// components/AlertPopup.jsx
import React from "react";

const AlertPopup = ({ message, show }) => {
  return (
    <div
      className={`fixed top-6 left-1/2 z-50 -translate-x-1/2 transform rounded-lg bg-black px-6 py-3 text-sm text-white shadow-lg transition-opacity duration-500 ease-in-out dark:bg-white dark:text-black ${show ? "opacity-100" : "pointer-events-none opacity-0"}`}
    >
      {message}
    </div>
  );
};

export default AlertPopup;
