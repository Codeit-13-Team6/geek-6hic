import { create } from "zustand";
import type { User } from "@/types/user";

interface AuthState {
  userId: User | null;
  setUserId: (id: number) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  userId: null,
  setUserId: (id) => set({ userId: id }),
}));
