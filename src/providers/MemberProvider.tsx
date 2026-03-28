"use client";

import { useEffect } from "react";
import { getUserData } from "@/api/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { MemberProviderProps } from "@/types";

export function MemberProvider({ children }: MemberProviderProps) {
  const setUser = useAuthStore((s) => s.setUser);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  useEffect(() => {
    const init = async () => {
      try {
        const user = await getUserData();

        if (user) {
          setUser(user);
        } else {
          clearAuth();
        }
      } catch {
        clearAuth();
      }
    };

    init();
  }, [setUser, clearAuth]);

  return <>{children}</>;
}
