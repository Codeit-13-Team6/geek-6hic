'use client';

import { useEffect } from 'react';
import { fetchMe } from '@/api/auth';
import { useAuthStore } from '@/store/useAuthStore';

interface MemberProviderProps {
  children: React.ReactNode;
  // isAuthenticated: boolean;
}

export function MemberProvider({
  children,
  // isAuthenticated,
}: MemberProviderProps) {
  const setUser = useAuthStore((s) => s.setUser);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  useEffect(() => {
    const init = async () => {
      // if (!isAuthenticated) {
      //   console.log("1");
      //   clearAuth();
      //   return;
      // }

      try {
        const user = await fetchMe();
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