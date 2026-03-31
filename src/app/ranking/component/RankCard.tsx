"use client";

import { BtnCommon } from "@/components/ui/BtnCommon";
import Image from "next/image";
import mainFallback from "@/assets/img/fallback/mainFallback.png";
import { RankCardProps } from "@/types";

export default function RankCard({
  title = "모임 이름이 없습니다.",
  point = 0,
  rank = 0,
  meetType = "스터디",
  image,
  onDetailClick = () => {},
}: RankCardProps & { image?: string }) {
  return (
    <article className="group flex flex-row items-center justify-between border-b border-slate-100 bg-transparent py-4 transition-all hover:bg-slate-50/50 sm:h-[90px] sm:px-4">
      <div className="flex min-w-0 items-center gap-4 sm:gap-6">
        <div className="w-8 text-center text-xl font-black text-slate-300 italic group-hover:text-slate-600 sm:text-2xl">
          {rank}
        </div>

        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[14px] bg-slate-100 sm:h-[60px] sm:w-[60px]">
          <Image
            src={image || mainFallback}
            alt="thumb"
            fill
            className="object-cover grayscale-[20%] transition-transform duration-500 group-hover:scale-110 group-hover:grayscale-0"
          />
        </div>

        <div className="flex min-w-0 flex-col justify-center gap-0.5">
          <p className="text-main-purple text-[9px] font-black tracking-[0.2em] uppercase sm:text-[10px]">
            {meetType}
          </p>
          <h3 className="truncate text-base font-bold tracking-tight text-slate-900 sm:text-lg">
            {title}
          </h3>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-6 sm:gap-8">
        <div className="text-right">
          <p className="text-lg font-black tracking-tighter text-slate-900 sm:text-xl">
            {point.toLocaleString()}
            <span className="ml-1 text-[9px] font-bold tracking-widest text-slate-400 uppercase">
              pts
            </span>
          </p>
        </div>

        <BtnCommon
          onClick={onDetailClick}
          variant="outline"
          className="hover:border-main-purple hover:bg-main-purple hidden h-9 w-20 rounded-xl border border-slate-200 bg-transparent text-[10px] font-black tracking-widest text-slate-500 uppercase transition-all hover:text-white sm:flex"
        >
          View
        </BtnCommon>
      </div>
    </article>
  );
}
