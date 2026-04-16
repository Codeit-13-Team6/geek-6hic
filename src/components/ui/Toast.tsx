"use client";

import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ToastProps } from "@/types";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

/**
 * 예시)
 * Toast({ message: "성공적으로 저장되었습니다.", type: "success" });
 * Toast({ message: "삭제 완료", size: "sm", duration: 1500 });
 * Toast({
 *   message: "로그인이 필요합니다.",
 *   className: "border border-red-500",
 * });
 */

const TYPE_CONFIG = {
  success: {
    icon: CheckCircle2,
    color: "text-green-400",
    glow: "drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]",
    borderColor: "border-green-500/30",
  },
  error: {
    icon: AlertCircle,
    color: "text-red-400",
    glow: "drop-shadow-[0_0_8px_rgba(248,113,113,0.5)]",
    borderColor: "border-red-500/30",
  },
  info: {
    icon: Info,
    color: "text-amber-200",
    glow: "drop-shadow-[0_0_8px_rgba(148,163,184,0.6)]",
    borderColor: "border-amber-300/40",
  },
};

const TOAST_SIZE_STYLES = {
  lg: "min-h-[52px] min-w-[200px] w-fit max-w-[400px] rounded-full px-7 py-3 text-[15px]",
  sm: "min-h-[40px] min-w-[140px] w-fit max-w-[300px] rounded-full px-5 py-2 text-[13px]",
};

export const Toast = ({
  message,
  type = "success",
  size = "lg",
  duration = 2000,
  className,
}: ToastProps) => {
  const config = TYPE_CONFIG[type];
  const Icon = config.icon;

  toast.custom(
    () => (
      <div className="flex w-full justify-center">
        <div
          className={cn(
            "relative flex items-center justify-center gap-3 overflow-hidden text-center",
            "bg-slate-950/85 tracking-tight text-white backdrop-blur-2xl",
            "shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] ring-1 ring-white/15",
            config.borderColor,
            TOAST_SIZE_STYLES[size],
            className,
          )}
        >
          <Icon
            className={cn(
              config.color,
              config.glow,
              "flex-shrink-0",
              size === "lg" ? "size-5" : "size-4",
            )}
            strokeWidth={3}
          />

          <span className="truncate font-bold whitespace-nowrap">
            {message}
          </span>

          <div
            className={cn(
              "pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r opacity-10",
              type === "success"
                ? "from-green-500/20"
                : type === "error"
                  ? "from-red-500/20"
                  : "from-slate-400/20",
            )}
          />
        </div>
      </div>
    ),
    { duration },
  );
};
