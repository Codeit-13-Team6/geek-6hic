import { create } from "zustand";

interface AuthState {
  userId: number | null;
  setUserId: (id: number) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  userId: null,
  setUserId: (id) => set({ userId: id }),
}));
