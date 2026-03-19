"use client";

import { useEffect } from "react";
import { fetchMe } from "@/api/auth";
import { useAuthStore } from "@/store/useAuthStore";

interface MemberProviderProps {
  children: React.ReactNode;
}

export function MemberProvider({ children }: MemberProviderProps) {
  const setUser = useAuthStore((s) => s.setUser);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const setAuthLoading = useAuthStore((s) => s.setAuthLoading);

  useEffect(() => {
    const init = async () => {
      setAuthLoading(true);
      const user = await fetchMe();
      if (user) setUser(user);
      else clearAuth();
    };
    init();
  }, [setUser, clearAuth, setAuthLoading]);

  return <>{children}</>;
}
