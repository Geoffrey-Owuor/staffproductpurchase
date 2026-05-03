import { create } from "zustand";

export const useLoadingLineStore = create((set) => ({
  // State
  isLoading: false,

  // Actions
  startLoading: () => set({ isLoading: true }),
  stopLoading: () => set({ isLoading: false }),
}));
