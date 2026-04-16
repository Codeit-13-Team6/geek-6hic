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
    // layout에서 initialUser를 전달하지 않는 모드에서는
    // AuthBootstrapProvider가 auth 상태를 확정하도록 여기서는 상태를 건드리지 않습니다.
    if (typeof initialUser === "undefined") return;

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
