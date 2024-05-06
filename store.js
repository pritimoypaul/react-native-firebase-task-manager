import { create } from "zustand";

export const useStore = create((set) => ({
  updatedTime: 0,
  setUpdatedTime: (newVal) => set((state) => ({ updatedTime: newVal })),
}));

export const useAuthStore = create((set) => ({
  user: null,
  setUser: (newVal) => set((state) => ({ user: newVal })),
}));
