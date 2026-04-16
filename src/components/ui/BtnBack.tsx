"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib";

interface BtnBackProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  /** 다이렉트 진입 시 돌아갈 대체 경로 */
  fallbackHref?: string;
}

export const BtnBack = ({
  label = "뒤로가기",
  fallbackHref = "/", // 기본값은 홈으로 설정
  className,
  onClick,
  ...props
}: BtnBackProps) => {
  const router = useRouter();

  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e);
      return;
    }

    // 이전 페이지의 URL을 가져옴
    const referrer = document.referrer;
    // 현재 우리 사이트의 도메인
    const currentHost = window.location.host;

    // 이전 페이지가 우리 사이트 내부라면 정상적으로 뒤로가기
    if (referrer && referrer.includes(currentHost)) {
      router.back();
    } else {
      // 다이렉트 진입(북마크, 링크 공유)이거나 외부 사이트에서 넘어온 경우 폴백 라우팅
      router.push(fallbackHref);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={cn(
        "mb-5 flex items-center gap-1 text-sm font-medium text-gray-400 transition-colors hover:text-gray-600",
        className,
      )}
      {...props}
    >
      <ChevronLeft className="size-5" />
      {label && <span>{label}</span>}
    </button>
  );
};
