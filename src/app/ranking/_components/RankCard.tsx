"use client";

import { RankCardProps } from "@/types";
import FallbackImage from "@/components/ui/FallbackImage";
import { ArrowUpRight, Lock } from "lucide-react";

export default function RankCard({
  title = "모임 이름이 없습니다.",
  point = 0,
  rank = 0,
  meetType = "스터디",
  image,
  isSecret = false,
  onDetailClick = () => {},
}: RankCardProps) {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onDetailClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onDetailClick();
        }
      }}
      aria-label={`랭킹 ${rank}위 ${title} 상세 보기`}
      className="group focus-visible:ring-main-purple flex cursor-pointer flex-row items-center justify-between gap-4 border-b border-slate-100 bg-transparent py-4 transition-all hover:bg-white focus-visible:ring-2 focus-visible:outline-none sm:h-[90px] sm:px-4 sm:hover:scale-[1.01] sm:hover:rounded-2xl sm:hover:border-transparent sm:hover:shadow-[0_8px_30px_-12px_rgba(38,6,86,0.12)]"
    >
      <div className="flex min-w-0 items-center gap-4 sm:gap-6">
        <div className="group-hover:text-main-purple min-w-6 text-center text-xl font-black text-slate-300 italic transition-colors duration-300 sm:min-w-8 sm:text-2xl">
          {rank}
        </div>

        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[14px] bg-slate-100 shadow-sm sm:h-[60px] sm:w-[60px]">
          <FallbackImage
            src={image}
            alt={`${title} 썸네일`}
            fill
            className="object-cover grayscale-[20%] transition-transform duration-500 group-hover:scale-105 group-hover:grayscale-0"
          />
          {isSecret && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/60 backdrop-blur-[2px]">
              <div className="flex flex-col items-center gap-2">
                <div className="flex size-10 items-center justify-center rounded-full bg-slate-800/80 shadow-lg ring-1 ring-slate-700/50">
                  <Lock className="size-4 text-slate-300" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-col justify-center gap-1">
          <span className="bg-main-purple/5 text-main-purple ring-main-purple/10 w-fit rounded-md px-2 py-0.5 text-[9px] font-black tracking-[0.2em] uppercase ring-1 sm:text-[10px]">
            {meetType}
          </span>
          <h3 className="group-hover:text-main-purple truncate text-base font-bold tracking-tight text-slate-900 transition-colors sm:text-lg">
            {title}
          </h3>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-5 sm:gap-8">
        <div className="text-right">
          <p className="text-lg font-black tracking-tighter text-slate-900 sm:text-xl">
            {point.toLocaleString()}
            <span className="ml-1.5 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              포인트
            </span>
          </p>
        </div>

        <button
          tabIndex={-1}
          className="group/btn group-hover:bg-main-purple hidden size-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition-all group-hover:text-white group-hover:shadow-md sm:flex"
          aria-hidden="true"
        >
          <ArrowUpRight className="size-5 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
        </button>
      </div>
    </article>
  );
}
