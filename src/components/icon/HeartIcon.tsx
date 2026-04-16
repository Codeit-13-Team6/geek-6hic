import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeartIconProps {
  /** 좋아요 상태 여부 */
  liked: boolean;
  /** 클릭 이벤트 핸들러 */
  onClick?: (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => void; /** 아이콘 크기 (기존 Lucide size 프롭과 동일) */
  size?: number | string;
  /** 추가 커스텀 클래스 */
  className?: string;
  /** 비활성화 여부 */
  disabled?: boolean;
}

export function HeartIcon({
  liked,
  onClick,
  size = 20,
  className,
  disabled = false,
}: HeartIconProps) {
  return (
    <button
      type="button"
      onClick={(e) => onClick?.(e)}
      disabled={disabled}
      className={cn(
        "group relative z-20 flex items-center justify-center rounded-full p-2",
        "transition-all duration-300 ease-out",
        "hover:bg-main-purple/5 active:scale-90",
        disabled && "cursor-not-allowed opacity-40",
        className,
      )}
      aria-label={liked ? "좋아요 취소" : "좋아요"}
    >
      <Heart
        size={size}
        className={cn(
          "ease-spring transition-all duration-300", // 스프링 느낌의 부드러운 전환
          "group-hover:text-main-purple/80 text-slate-300", // 평소엔 연한 회색, 호버 시 보라색 테두리

          liked && "fill-main-purple text-main-purple scale-110",

          disabled && "group-hover:text-slate-300",
        )}
        strokeWidth={liked ? 1.5 : 2}
      />
    </button>
  );
}
