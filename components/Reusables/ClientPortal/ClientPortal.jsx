// A reusable createPortal function to solve server side document is not defined errors
"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const ClientPortal = ({ children, selector = "body" }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  //   Check if mounted and if document exists
  if (!mounted || typeof document === "undefined") {
    return null;
  }

  // container uses "body" by default but a specific id can be passed if needed
  const container = document.querySelector(selector);

  return container ? createPortal(children, container) : null;
};

export default ClientPortal;
