import { create } from "zustand";
import { useAuthStore } from "@/store/useAuthStore";

interface LoginModalState {
  isOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  loginGuardAction: (action: () => void) => void;
}

export const useLoginModalStore = create<LoginModalState>((set) => ({
  isOpen: false,
  openLoginModal: () => set({ isOpen: true }),
  closeLoginModal: () => set({ isOpen: false }),
  loginGuardAction: (action) => {
    const userId = useAuthStore.getState().user?.id;
    if (userId) {
      action();
    } else {
      set({ isOpen: true });
    }
  },
}));
