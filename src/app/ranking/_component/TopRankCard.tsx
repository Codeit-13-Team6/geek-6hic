"use client";

import Image from "next/image";
import mainFallback from "@/assets/img/fallback/mainFallback.png";
import { Card, CardAction, CardContent } from "@/components/shadcnOrigin/card";
import { BtnCommon } from "@/components/ui/BtnCommon";
import { RankedItem } from "@/types";
import { cn } from "@/lib/utils";
import FallbackImage from "@/components/img/FallbackImage";

export default function TopRankCard({
  rank,
  item,
  onDetailClick,
}: {
  rank: number;
  item: RankedItem;
  onDetailClick: () => void;
}) {
  const isFirst = rank === 1;
  const suffix = ["ST", "ND", "RD"][rank - 1] || "TH";

  return (
    <Card
      className={cn(
        "group relative w-full overflow-hidden !border-none transition-all duration-700",
        isFirst
          ? "aspect-[3/4.2] shadow-[0_40px_80px_-20px_rgba(255,185,0,0.3)] ring-1 ring-[#FFB900]/30"
          : "aspect-[3/4.2] shadow-2xl shadow-black/10 grayscale-[40%] hover:-translate-y-2 hover:grayscale-0",
      )}
    >
      <FallbackImage
        src={item?.image || mainFallback}
        alt="rank-bg"
        fill
        className="object-cover transition-transform duration-1000 select-none group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

      <div className="absolute top-7 right-0 z-20">
        <div
          className={cn(
            "px-4 py-1.5 text-[10px] font-black tracking-[0.3em] shadow-2xl",
            isFirst ? "bg-[#FFB900] text-slate-950" : "bg-white text-slate-950",
          )}
        >
          {rank}
          {suffix}
        </div>
      </div>

      <div className="relative z-10 flex h-full flex-col justify-end p-7 pb-4 lg:p-10">
        <div className="space-y-3">
          <div className="mb-1 flex items-center gap-2">
            <span
              className={cn(
                "text-xs font-black tracking-[0.3em] uppercase drop-shadow-md",
                isFirst ? "text-[#FFB900]" : "text-white",
              )}
            >
              {item?.meetType || "Category"}
            </span>
            {isFirst && (
              <span className="text-[9px] font-bold tracking-widest text-white/50 uppercase">
                🏆 Champion
              </span>
            )}
          </div>

          <h3
            className={cn(
              "line-clamp-2 leading-none font-black text-white text-shadow-2xs",
              isFirst ? "text-3xl lg:text-4xl" : "text-2xl lg:text-3xl",
            )}
          >
            {item?.meetName || "No Name"}
          </h3>

          <div className="flex items-end gap-1 font-black">
            <span
              className={cn(
                "text-3xl lg:text-4xl",
                isFirst ? "text-[#FFB900]" : "text-white",
              )}
            >
              {item?.rankScore?.toLocaleString()}
            </span>
            <span className="mb-1 text-[10px] tracking-widest text-white/50 uppercase">
              Points
            </span>
          </div>

          <BtnCommon
            onClick={onDetailClick}
            className={cn(
              "h-12 w-full rounded-2xl border-none font-black shadow-lg transition-all active:scale-95",
              isFirst
                ? "bg-[#FFB900] text-slate-950 hover:bg-[#e5a700]"
                : "bg-slate-950/30 text-white hover:bg-slate-800",
            )}
          >
            <span className="text-[11px] tracking-[0.2em] uppercase">
              View Details
            </span>
          </BtnCommon>
        </div>
      </div>
    </Card>
  );
}
