"use client";

import { RankedItem } from "@/types";
import { cn } from "@/lib";
import FallbackImage from "@/components/ui/FallbackImage";
import { Lock } from "lucide-react";

export default function TopRankMobileCard({
  rank,
  item,
  isSecret = false,
  onDetailClick,
}: {
  rank: number;
  item: RankedItem;
  isSecret?: boolean;
  onDetailClick: () => void;
}) {
  const isFirst = rank === 1;
  const isThird = rank === 3;

  const suffix = ["st", "nd", "rd"][rank - 1] || "th";

  return (
    <li
      onClick={onDetailClick}
      className={cn(
        "relative flex w-full cursor-pointer flex-col justify-end overflow-hidden rounded-[24px] border-none shadow-none transition-all active:scale-[0.98]",
        isFirst
          ? "h-[200px] shadow-[0_20px_40px_-10px_rgba(255,185,0,0.3)] ring-1 ring-[#FFB900]/30"
          : "h-[180px] w-[97%]",
        isThird && "w-[94%]",
      )}
    >
      <FallbackImage
        src={item?.image}
        alt={item?.meetName ? `${item.meetName} 모임 이미지` : "모임 이미지"}
        fill
        className="object-cover"
      />
      {isSecret && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/60 backdrop-blur-[2px]">
          <div className="absolute top-4 right-3 flex flex-col items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-full bg-slate-800/80 shadow-lg ring-1 ring-slate-700/50">
              <Lock className="size-4 text-slate-300" />
            </div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-slate-300">
              SECRET
            </span>
          </div>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

      <span className="absolute right-5 -bottom-1 text-[110px] leading-none font-black text-white/[0.08] italic select-none">
        {rank}
      </span>

      <div className="absolute top-5 left-5 z-20">
        <div
          className={cn(
            "flex items-center justify-center rounded-full px-3 py-1 text-[10px] font-black tracking-widest shadow-lg",
            isFirst ? "bg-[#FFB900] text-slate-950" : "bg-white text-slate-950",
          )}
        >
          {rank}
          {suffix.toUpperCase()}
        </div>
      </div>

      <div className="relative z-10 flex w-full flex-col justify-end p-6">
        <div className="mb-2 flex items-center gap-1.5">
          <span
            className={cn(
              "rounded-md px-2 py-0.5 text-[9px] font-black tracking-[0.2em] uppercase backdrop-blur-md",
              isFirst
                ? "bg-[#FFB900]/20 text-[#FFD700] ring-1 ring-[#FFB900]/50"
                : "bg-white/20 text-white ring-1 ring-white/50",
            )}
          >
            {item?.meetType || "Category"}
          </span>
          {isFirst && (
            <span className="flex items-center gap-1 text-[9px] font-black tracking-widest text-[#FFD700] uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              <span className="text-xs">🏆</span>
            </span>
          )}
        </div>

        <h3
          className={cn(
            "mb-2 line-clamp-2 truncate leading-tight font-black tracking-tighter text-white drop-shadow-md",
            isFirst ? "text-2xl" : "text-lg",
          )}
        >
          {item?.meetName || "No Name"}
        </h3>

        <div className="flex items-baseline gap-1 font-black">
          <span
            className={cn(
              "text-xl leading-none",
              isFirst ? "text-[#FFB900]" : "text-white",
            )}
          >
            {item?.rankScore?.toLocaleString()}
          </span>
          <span
            className={cn(
              "text-[9px] tracking-widest uppercase",
              isFirst ? "text-[#FFB900]/80" : "text-white/70",
            )}
          >
            포인트
          </span>
        </div>
      </div>
    </li>
  );
}
