"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface BtnBackProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 버튼 텍스트 (기본값: "뒤로가기", 텍스트 숨기고 싶으면 "" 전달) */
  label?: string;
}

export const BtnBack = ({
  label = "뒤로가기",
  className,
  onClick,
  ...props
}: BtnBackProps) => {
  const router = useRouter();

  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    // 부모에서 별도의 onClick 이벤트를 넘겨줬다면 그걸 우선 실행
    if (onClick) {
      onClick(e);
      return;
    }

    // 기본 동작: 이전 페이지로 이동
    router.back();
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
