"use client";

import { Card } from "@/components/ui/Card";

import { TopRankCardProps } from "@/types";

import { cn } from "@/lib";
import FallbackImage from "@/components/ui/FallbackImage";
import { ArrowUpRight, Lock } from "lucide-react";

export default function TopRankCard({
  rank,
  item,
  isSecret = false,
  onDetailClick,
}: TopRankCardProps) {
  const isFirst = rank === 1;
  const suffix = ["ST", "ND", "RD"][rank - 1] || "TH";

  return (
    <Card
      onClick={onDetailClick}
      className={cn(
        "group relative w-full cursor-pointer overflow-hidden !border-none transition-all duration-500",
        isFirst
          ? "aspect-[3/4.2] shadow-[0_30px_60px_-15px_rgba(255,185,0,0.3)] ring-1 ring-[#FFB900]/40 hover:-translate-y-3 hover:shadow-[0_40px_80px_-10px_rgba(255,185,0,0.6)]"
          : "aspect-[3/4.2] shadow-2xl shadow-black/10 grayscale-[40%] hover:-translate-y-3 hover:shadow-black/30 hover:grayscale-0",
      )}
    >
      <FallbackImage
        src={item?.image}
        alt={item?.meetName ? `${item.meetName} 모임 이미지` : "모임 이미지"}
        fill
        className="object-cover transition-transform duration-700 select-none group-hover:scale-105"
      />
      {isSecret && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/60 backdrop-blur-[2px]">
          <div className="absolute top-5 left-5 flex flex-col items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-full bg-slate-800/80 shadow-lg ring-1 ring-slate-700/50">
              <Lock className="size-5 text-slate-300" />
            </div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-slate-300 lg:text-xs">
              SECRET
            </span>
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

      <div className="absolute top-7 right-0 z-20">
        <div
          className={cn(
            "px-4 py-1.5 text-xs font-black tracking-[0.3em] shadow-2xl",
            isFirst ? "bg-[#FFB900] text-slate-950" : "bg-white text-slate-950",
          )}
          aria-label={`${rank}위`}
        >
          {rank}
          {suffix}
        </div>
      </div>

      <div className="relative z-10 flex h-full flex-col justify-end p-7 lg:p-10">
        <div className="mb-3 flex items-center gap-2">
          <span
            className={cn(
              "rounded-md px-2.5 py-1 text-[10px] font-black tracking-[0.2em] uppercase backdrop-blur-md",
              isFirst
                ? "bg-[#FFB900]/20 text-[#FFD700] ring-1 ring-[#FFB900]/50"
                : "bg-white/20 text-white ring-1 ring-white/50",
            )}
          >
            {item?.meetType || "Category"}
          </span>
          {isFirst && (
            <span className="flex items-center gap-1 text-[10px] font-black tracking-widest text-[#FFD700] uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              <span className="text-xs">🏆</span>
            </span>
          )}
        </div>

        <h3
          className={cn(
            "line-clamp-2 leading-none font-black break-all text-white drop-shadow-lg",
            isFirst ? "text-3xl lg:text-4xl" : "text-2xl lg:text-3xl",
          )}
        >
          {item?.meetName || "No Name"}
        </h3>

        <div className="mt-6 flex items-end justify-between border-t border-white/20 pt-5">
          <div className="flex items-baseline gap-1.5 font-black">
            <span
              className={cn(
                "text-3xl leading-none lg:text-4xl",
                isFirst ? "text-[#FFB900]" : "text-white",
              )}
            >
              {item?.rankScore?.toLocaleString()}
            </span>

            <span
              className={cn(
                "text-xs font-normal tracking-tight uppercase",
                isFirst ? "text-[#FFB900]/80" : "text-white/70",
              )}
            >
              포인트
            </span>
          </div>

          <div
            aria-label={`${rank}위 ${item?.meetName || "모임"} 상세 보기`}
            className={cn(
              "group/btn flex size-12 shrink-0 items-center justify-center rounded-full shadow-lg transition-all active:scale-95",
              isFirst
                ? "bg-[#FFB900] text-slate-950 hover:bg-[#e5a700] hover:shadow-[0_0_20px_rgba(255,185,0,0.5)]"
                : "bg-white/10 text-white backdrop-blur-md hover:bg-white/30 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]",
            )}
          >
            <ArrowUpRight className="size-6 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 group-hover/btn:scale-110" />
          </div>
        </div>
      </div>
    </Card>
  );
}
