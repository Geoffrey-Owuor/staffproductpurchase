import { create } from "zustand";

export const useSidebarStore = create((set) => ({
  // State
  sidebarOpen: true,
  showTopbar: false,

  // Setters
  setSidebarOpen: (isOpen) => set({ sidebarOpen: isOpen }),
  setShowTopbar: (isShow) => set({ showTopbar: isShow }),
}));
