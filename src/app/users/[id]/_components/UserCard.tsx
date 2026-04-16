"use client";

import { useState } from "react";
import { Users, Calendar, LucideLock, Lock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { UserCardProps } from "@/types";
import { cn } from "@/lib/utils";
import FallbackImage from "@/components/img/FallbackImage";
import { HeartIcon } from "@/components/ui/HeartIcon";

export function UserCard({
  title = "제목이 없습니다.",
  type = "유형이 없습니다.",
  date = new Date(),
  imageSrc,
  defaultLiked = false,
  participantCount = 0,
  capacity = 20,
  showLikeBtn = true,
  showLockBtn = false,
  isSecret = false,
  onHeartClick,
  onDetailClick,
}: UserCardProps) {
  const [isLiked, setIsLiked] = useState(defaultLiked);

  const handleHeartClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const isNextLiked = !isLiked;
    setIsLiked(isNextLiked);
    onHeartClick?.(isNextLiked);
  };

  return (
    <Card
      className={cn(
        "group relative flex w-full cursor-pointer flex-col gap-0 overflow-hidden transition-all duration-300 focus-visible:ring-2 focus-visible:ring-black sm:gap-4",
        "border border-slate-100/50 bg-white p-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)]",
        "hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(38,6,86,0.08)]",
        "sm:h-[180px] sm:flex-row sm:items-center sm:gap-8 sm:rounded-[24px] sm:p-6 sm:hover:bg-slate-50",
      )}
      onClick={onDetailClick}
      tabIndex={0}
      role="button"
      aria-label={`${title} 상세 보기`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onDetailClick?.();
        }
      }}
    >
      <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-slate-50 sm:h-32 sm:w-32 sm:rounded-2xl">
        <FallbackImage
          src={imageSrc}
          alt={`${title} 모임 이미지`}
          fill
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {isSecret && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/60 backdrop-blur-[2px]">
            <div className="flex flex-col items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-full bg-slate-800/80 shadow-lg ring-1 ring-slate-700/50">
                <Lock className="size-5 text-slate-300" />
              </div>
              <span className="text-xs font-bold tracking-[0.2em] text-slate-300">
                SECRET
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-row items-start justify-between p-6 sm:p-0">
        <div className="flex h-28 min-w-0 flex-1 basis-0 flex-col justify-between">
          <div className="min-w-0">
            <span className="bg-main-purple/5 text-main-purple ring-main-purple/10 rounded-md px-2 py-0.5 text-[10px] font-black tracking-[0.1em] ring-1 sm:text-[11px]">
              {type}
            </span>

            <h3 className="mt-3 mb-4 w-full truncate pr-4 text-lg font-extrabold tracking-tighter text-slate-950 md:text-xl">
              {title}
            </h3>
          </div>

          <div className="flex items-center gap-6 text-[13px] font-bold tracking-tight text-slate-400 uppercase">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-slate-400" />
              <span className="min-w-[56px] text-slate-500">
                {date.toLocaleDateString("ko-KR", {
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={18} className="text-slate-400" />
              <p className="text-slate-500">
                <span className="text-main-purple">{participantCount}</span>
                <span className="mx-0.5 opacity-30">/</span>
                {capacity}
              </p>
            </div>
          </div>
        </div>
        <div className="absolute right-4 bottom-24 shrink-0 sm:top-5 sm:right-5">
          {showLikeBtn && (
            <HeartIcon liked={isLiked} onClick={handleHeartClick} size={22} />
          )}
        </div>
        <div className="absolute right-5.5 bottom-28.5 shrink-0 sm:top-6.5 sm:right-5.5">
          {showLockBtn && <LucideLock size={22} aria-hidden="true" />}
        </div>
      </div>
    </Card>
  );
}
