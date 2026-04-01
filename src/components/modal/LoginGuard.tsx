"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useLoginModalStore } from "@/store/useLoginModalStore";
import { ReactNode } from "react";

interface LoginGuardProps {
  children: ReactNode;
  fallback: ReactNode;
}

export default function LoginGuard({ children, fallback }: LoginGuardProps) {
  const userId = useAuthStore((s) => s.user?.id);
  const openLoginModal = useLoginModalStore((s) => s.openLoginModal);

  if (userId) return <>{children}</>;

  return (
    <div
      className="contents"
      onClick={(e) => {
        e.stopPropagation();
        openLoginModal();
      }}
    >
      {fallback}
    </div>
  );
}
