"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { MemberProviderProps } from "@/types";
import type { User } from "@/types";

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
