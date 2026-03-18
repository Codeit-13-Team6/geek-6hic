import { create } from "zustand";
import type { User } from "@/types/index";

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearAuth: () => set({ user: null }),
}));

// 페이지에서 사용 예시
// import { useAuthStore } from '@/store/useAuthStore';
// const user = useAuthStore((s) => s.user);
// const clearAuth = useAuthStore((s) => s.clearAuth);
// console.log(user);
// console.log(user?.id);