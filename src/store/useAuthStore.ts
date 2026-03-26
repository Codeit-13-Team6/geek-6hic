import { create } from "zustand";
import type { User } from "@/types/index";

interface AuthState {
  user: User | null;
  isAuthLoading: boolean;
  setUser: (user: User | null) => void;
  clearAuth: () => void;
  setAuthLoading: (isAuthLoading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthLoading: true,
  setUser: (user) => set({ user, isAuthLoading: false }),
  clearAuth: () => set({ user: null, isAuthLoading: false }),
  setAuthLoading: (isAuthLoading) => set({ isAuthLoading }),
}));

// 페이지에서 사용 예시
// import { useAuthStore } from '@/store/useAuthStore';
// const user = useAuthStore((s) => s.user);
// const clearAuth = useAuthStore((s) => s.clearAuth);
// console.log(user);
// console.log(user?.id);