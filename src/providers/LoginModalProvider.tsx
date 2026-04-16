"use client";

import ModalBase from "@/components/modal/ModalBase";
import LoginForm from "@/components/features/form/LoginForm";
import { useLoginModalStore } from "@/store/useLoginModalStore";
import { useRouter } from "next/navigation";

export default function LoginModalProvider() {
  const router = useRouter();
  const { isOpen, closeLoginModal } = useLoginModalStore();

  const handleLoginSuccess = () => {
    closeLoginModal();
    // 모달 로그인 후에는 현재 경로를 유지한 채 RSC를 갱신해
    // GNB(서버 컴포넌트)의 세션 유저 표시를 즉시 동기화합니다.
    router.refresh();
  };

  return (
    <ModalBase
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) closeLoginModal();
      }}
      contentClassName="w-full sm:max-w-[480px] rounded-[32px] border-none px-6 py-4 sm:p-12 shadow-[0_40px_80px_rgba(0,0,0,0.15)]"
    >
      <div className="flex flex-col items-center">
        <LoginForm title="로그인" onSuccess={handleLoginSuccess} />
      </div>
    </ModalBase>
  );
}
