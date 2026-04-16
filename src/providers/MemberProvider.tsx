"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { MemberProviderProps } from "@/types";
import type { User } from "@/types";

interface Props extends MemberProviderProps {
  initialUser?: Pick<User, "id" | "name" | "image"> | null;
}

export function MemberProvider({ children, initialUser }: Props) {
  // const initialized = useRef(false);
  useEffect(() => {
    useAuthStore.setState((prev) => {
      if (!initialUser) {
        return {
          user: null,
          isAuthLoading: false,
        };
      }

      const prevUser = prev.user;

      // layout에서 내려오는 initialUser는 최소 필드(id/name/image)라
      // 동일 유저의 기존 상세 필드(email/companyName)를 덮어쓰지 않도록 merge 처리.
      if (prevUser && prevUser.id === initialUser.id) {
        return {
          user: {
            ...prevUser,
            ...initialUser,
          } as User,
          isAuthLoading: false,
        };
      }

      return {
        user: initialUser as User,
        isAuthLoading: false,
      };
    });
  }, [initialUser?.id, initialUser?.name, initialUser?.image]);

  return <>{children}</>;
}
