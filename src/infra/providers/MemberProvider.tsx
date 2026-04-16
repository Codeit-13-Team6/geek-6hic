"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/infra/store/useAuthStore";
import { MemberProviderProps } from "@/shared/types";
import type { User } from "@/shared/types";

interface Props extends MemberProviderProps {
  initialUser?: Pick<User, "id" | "name" | "image"> | null;
}

export function MemberProvider({ children, initialUser }: Props) {
  // const initialized = useRef(false);
  useEffect(() => {
    if (initialUser) {
      useAuthStore.setState({
        user: initialUser as User,
        isAuthLoading: false,
      });
    }
  }, [initialUser?.id, initialUser?.name, initialUser?.image]);

  return <>{children}</>;
}
