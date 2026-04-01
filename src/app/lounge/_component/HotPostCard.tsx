"use client";

import Image from "next/image";
import thumbsUpIcon from "@/assets/icon/thumbsUp/state-false.svg";
import messageIcon from "@/assets/icon/message/message.svg";
import defaultImg from "@/assets/img/empty/img-default.png";
import { getRelativeTime } from "@/lib/getRelativeTime";
import { HotPostCardCommonProps } from "@/types";

export function HotPostCard({
  title = "제목이 없습니다.",
  date = new Date(),
  imageSrc,
  onDetailClick,
  thumbsUp = 0,
  comment = 0,
}: HotPostCardCommonProps & { rank?: number }) {
  return (
    <div
      onClick={onDetailClick}
      className="group relative flex w-[180px] shrink-0 cursor-pointer flex-col gap-4 transition-all duration-500 sm:w-[280px] lg:w-[320px]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[24px] bg-slate-100 shadow-xl shadow-slate-200/40">
        <img
          src={imageSrc || defaultImg.src}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = defaultImg.src;
          }}
        />

        <div className="absolute inset-0 bg-slate-950/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>

      <div className="flex flex-col px-1">
        <div className="px-1">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-main-purple text-[10px] font-black tracking-[0.2em] uppercase">
              Trending Now
            </span>
            <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">
              {getRelativeTime(date)}
            </span>
          </div>

          <h3 className="group-hover:text-main-purple truncate text-base font-bold tracking-tighter text-slate-900 transition-colors sm:text-lg lg:text-xl">
            {title}
          </h3>
        </div>

        <div className="mt-4 flex items-center gap-4 border-t border-slate-100 pt-4 text-slate-400">
          <div className="flex items-center gap-1.5">
            <Image
              src={thumbsUpIcon}
              alt="like"
              width={14}
              height={14}
              className="opacity-40"
            />
            <span className="text-[11px] font-black tracking-tighter sm:text-xs">
              {thumbsUp}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Image
              src={messageIcon}
              alt="comment"
              width={14}
              height={14}
              className="opacity-40"
            />
            <span className="text-[11px] font-black tracking-tighter sm:text-xs">
              {comment}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
