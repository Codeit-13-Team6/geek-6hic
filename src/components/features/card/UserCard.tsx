"use client";

import { useState } from "react";
import { Heart, Users, Calendar } from "lucide-react";
import { Card } from "@/components/shadcnOrigin/card";
import { UserCardProps } from "@/types";
import { cn } from "@/lib/utils";
import FallbackImage from "@/components/img/FallbackImage";

export function UserCard({
  title = "제목이 없습니다.",
  type = "유형이 없습니다.",
  date = new Date(),
  imageSrc = "https://avatar.vercel.sh/shadcn1",
  defaultLiked = false,
  participantCount = 0,
  capacity = 20,
  showLikeBtn = true,
  onHeartClick,
  onDetailClick,
}: UserCardProps) {
  const [isLiked, setIsLiked] = useState(defaultLiked);

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const isNextLiked = !isLiked;
    setIsLiked(isNextLiked);
    onHeartClick?.(isNextLiked);
  };

  return (
    <Card
      className={cn(
        "group relative mb-4 flex w-full cursor-pointer flex-col overflow-hidden transition-all duration-300",
        "border border-slate-100 bg-white p-0 shadow-none hover:border-slate-200 hover:bg-slate-50/30",
        "sm:h-[180px] sm:flex-row sm:items-center sm:gap-8 sm:rounded-3xl sm:px-6",
      )}
      onClick={onDetailClick}
    >
      <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-slate-50 sm:h-32 sm:w-32 sm:rounded-2xl">
        <FallbackImage
          src={imageSrc}
          alt={title}
          fill
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {showLikeBtn && (
          <button
            className="absolute top-3 right-3 sm:hidden"
            onClick={handleHeartClick}
          >
            <Heart
              size={20}
              className={cn(
                "transition-all",
                isLiked
                  ? "fill-main-purple text-main-purple"
                  : "text-white drop-shadow-md",
              )}
            />
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-center p-6 sm:p-0">
        <div className="mb-2 flex items-center justify-between min-h-[22px]">
          <span className="text-main-purple text-[11px] font-black tracking-widest uppercase">
            {type}
          </span>
          {showLikeBtn && (
            <button
              className="hidden transition-transform active:scale-90 sm:block"
              onClick={handleHeartClick}
            >
              <Heart
                size={22}
                strokeWidth={2}
                className={cn(
                  "transition-all",
                  isLiked
                    ? "fill-main-purple text-main-purple"
                    : "text-slate-200 hover:text-slate-400",
                )}
              />
            </button>
          )}
        </div>

        <h3 className="mb-4 line-clamp-1 text-lg font-bold tracking-tighter text-slate-950 sm:text-xl">
          {title}
        </h3>

        <div className="flex items-center gap-6 text-[13px] font-bold tracking-tight text-slate-500 uppercase">
          <div className="flex items-center gap-2 ">
            <Calendar size={14} className="text-slate-300" />
            <span className="text-slate-600 min-w-[56px]">
              {date.toLocaleDateString("ko-KR", {
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={14} className="text-slate-300" />
            <p className="text-slate-900">
              {participantCount} <span className="text-slate-200">/</span>{" "}
              {capacity}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
