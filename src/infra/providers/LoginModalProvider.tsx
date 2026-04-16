"use client";

import ModalBase from "@/shared/components/modal/ModalBase";
import LoginForm from "@/app/(auth)/login/LoginForm";
import { useLoginModalStore } from "@/infra/store/useLoginModalStore";

export default function LoginModalProvider() {
  const { isOpen, closeLoginModal } = useLoginModalStore();

  return (
    <ModalBase
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) closeLoginModal();
      }}
      contentClassName="w-full sm:max-w-[480px] rounded-[32px] border-none px-6 py-4 sm:p-12 shadow-[0_40px_80px_rgba(0,0,0,0.15)]"
    >
      <div className="flex flex-col items-center">
        <LoginForm title="로그인" onSuccess={closeLoginModal} />
      </div>
    </ModalBase>
  );
}
