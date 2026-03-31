"use client";

import Image from "next/image";
import mainFallback from "@/assets/img/fallback/mainFallback.png";
import { RankedItem } from "@/types";
import { cn } from "@/lib/utils";

export default function TopRankMobileCard({
  rank,
  item,
  onDetailClick,
}: {
  rank: number;
  item: RankedItem;
  onDetailClick: () => void;
}) {
  const isFirst = rank === 1;
  const isThird = rank === 3;

  const suffix = ["st", "nd", "rd"][rank - 1] || "th";

  return (
    <div
      onClick={onDetailClick}
      className={cn(
        "relative flex w-full cursor-pointer flex-col justify-end overflow-hidden rounded-[24px] border-none shadow-none transition-all active:scale-[0.98]",
        isFirst
          ? "h-[200px] shadow-[0_20px_40px_-10px_rgba(255,185,0,0.3)]"
          : "h-[150px] w-[97%]",
        isThird && "w-[94%]",
      )}
    >
      <Image
        src={item?.image || mainFallback}
        alt="mob"
        fill
        className="object-cover opacity-40 grayscale-[20%]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-700 via-slate-950/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

      <span className="absolute right-4 -bottom-1 text-[110px] leading-none font-black text-white/[0.04] italic select-none">
        {rank}
      </span>

      <div className="absolute top-5 left-5 z-20">
        <div
          className={cn(
            "flex items-center justify-center rounded-full px-3 text-[10px] font-black tracking-widest shadow-lg",
            isFirst ? "bg-[#FFB900] text-slate-950" : "bg-white text-slate-950",
          )}
        >
          {rank}
          {suffix.toUpperCase()}
        </div>
      </div>

      <div className="relative z-10 flex w-full flex-col justify-end p-6">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-[10px] font-black tracking-[0.3em] text-slate-300 uppercase drop-shadow-md">
            {item?.meetType}
          </span>
          {isFirst && (
            <span className="pb-px text-[9px] font-bold tracking-widest text-white/50 uppercase">
              🏆
            </span>
          )}
        </div>

        <h3
          className={cn(
            "mb-2 line-clamp-2 leading-tight font-black tracking-tighter text-white",
            isFirst ? "text-2xl" : "text-lg",
          )}
        >
          {item?.meetName}
        </h3>
        <p
          className={cn(
            "text-xl leading-none font-black",
            isFirst ? "text-[#FFB900]" : "text-slate-100/80",
          )}
        >
          {item?.rankScore?.toLocaleString()}{" "}
          <span className="ml-1 text-[9px] tracking-widest uppercase opacity-40">
            pts
          </span>
        </p>
      </div>
    </div>
  );
}
