"use client";

import { useState } from "react";
import { Users, Calendar, LucideLock} from "lucide-react";
import { Card } from "@/components/shadcnOrigin/card";
import { UserCardProps } from "@/types";
import { cn } from "@/lib/utils";
import FallbackImage from "@/components/img/FallbackImage";
import { HeartIcon } from "@/components/icon/HeartIcon";

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
        "group relative flex w-full cursor-pointer flex-col overflow-hidden transition-all duration-300 focus-visible:ring-2 focus-visible:ring-black",
        "border border-slate-100/50 bg-white p-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)]",
        "hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(38,6,86,0.08)]",
        "sm:h-[180px] sm:flex-row sm:items-center sm:gap-8 sm:rounded-[24px] sm:px-8 sm:hover:bg-slate-50",
      )}
      onClick={onDetailClick}
      tabIndex={0}
      role="button"
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
      </div>

      <div className="flex flex-1 flex-row items-start justify-between pt-0 pr-4 pb-6 pl-6 sm:p-0">
        <div className="flex h-25 flex-1 flex-col justify-between">
          <div>
            <div className="text-main-purple mb-1 text-xs font-bold tracking-[0.2em] uppercase">
              {type}
            </div>

            <h3 className="mb-4 line-clamp-1 truncate text-lg font-extrabold tracking-tighter text-slate-950 sm:text-xl lg:text-2xl">
              {title}
            </h3>
          </div>

          <div className="flex items-center gap-6 text-[13px] font-bold tracking-tight text-slate-400 uppercase">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-slate-200" />
              <span className="min-w-[56px] text-slate-500">
                {date.toLocaleDateString("ko-KR", {
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={14} className="text-slate-200" />
              <p className="text-slate-500">
                <span className="text-main-purple">{participantCount}</span>
                <span className="mx-0.5 opacity-30">/</span>
                {capacity}
              </p>
            </div>
          </div>
        </div>
        <div>
          {showLikeBtn && (
            <HeartIcon
              liked={isLiked}
              onClick={handleHeartClick}
              size={22}
            />
          )}
          {showLockBtn && (
            <LucideLock
              size={22}
              aria-label="비공개 모임"
            />
          )}
        </div>
      </div>
    </Card>
  );
}
