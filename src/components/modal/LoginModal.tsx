"use client";

import Link from "next/link";
import { BtnCommon } from "@/components/ui/BtnCommon";
import { useAuthStore } from "@/store/useAuthStore";
import { ReactNode, useState } from "react";
import ModalBase from "@/components/ui/ModalBase";
import LoginForm from "@/app/(auth)/login/LoginForm";

interface LoginModalProps {
  children: ReactNode;
  fallback: ReactNode;
}

export default function LoginModal({ children, fallback }: LoginModalProps) {
  const userId = useAuthStore((state) => state.user?.id);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {userId ? (
        <>{children}</>
      ) : (
        <div
          className="contents"
          onClick={(e) => {
            e.stopPropagation();
            setIsModalOpen(true);
          }}
        >
          {fallback}
        </div>
      )}
      <ModalBase
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        contentClassName="w-4xl sm:px-8 sm:py-8 px-4 py-6 min-w-[500px]"
      >
        <LoginForm
          title="로그인이 필요합니다."
          onSuccess={() => setIsModalOpen(false)}
        />
      </ModalBase>
    </>
  );
}
