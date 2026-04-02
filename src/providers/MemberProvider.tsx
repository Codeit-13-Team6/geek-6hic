"use client";

import { useRef } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { MemberProviderProps } from "@/types";
import type { User } from "@/types";

interface Props extends MemberProviderProps {
  initialUser?: Pick<User, "id" | "name" | "image"> | null;
}

export function MemberProvider({ children, initialUser }: Props) {
  const initialized = useRef(false);
  if (!initialized.current && initialUser) {
    useAuthStore.setState({ user: initialUser as User, isAuthLoading: false });
    initialized.current = true;
  }

  return <>{children}</>;
}
