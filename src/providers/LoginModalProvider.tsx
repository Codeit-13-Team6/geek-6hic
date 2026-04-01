"use client";

import ModalBase from "@/components/ui/ModalBase";
import LoginForm from "@/app/(auth)/login/LoginForm";
import { useLoginModalStore } from "@/store/useLoginModalStore";

export default function LoginModalProvider() {
  const { isOpen, closeLoginModal } = useLoginModalStore();

  return (
    <ModalBase
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) closeLoginModal();
      }}
      contentClassName="w-4xl sm:px-8 sm:py-8 px-4 py-6 min-w-[500px]"
    >
      <LoginForm title="로그인이 필요합니다." onSuccess={closeLoginModal} />
    </ModalBase>
  );
}
