"use client";

import Image from "next/image";
import thumbsUpIcon from "@/assets/icon/thumbsUp/state-false.svg";
import messageIcon from "@/assets/icon/message/message.svg";
import fallbackImg from "@/assets/img/fallback/fallback-post-01.webp";
import { getRelativeTime } from "@/lib/getRelativeTime";
import { HotPostCardCommonProps } from "@/types";
import FallbackImage from "@/components/ui/FallbackImage";

export function HotPostCard({
  title = "제목이 없습니다.",
  date = new Date(),
  imageSrc,
  onDetailClick,
  thumbsUp = 0,
  comment = 0,
}: HotPostCardCommonProps & { rank?: number }) {
  const finalImageSrc = imageSrc || fallbackImg.src;
  return (
    <button
      type="button"
      aria-label={`${title} 게시물 상세 보기`}
      onClick={onDetailClick}
      className="group relative flex w-[180px] shrink-0 cursor-pointer flex-col gap-4 transition-all duration-500 sm:w-[280px] lg:w-[320px]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[24px] bg-slate-100 shadow-xl shadow-slate-200/40">
        <FallbackImage
          src={finalImageSrc}
          type="post"
          alt={`${title} 썸네일`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-slate-950/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>

      <div className="flex flex-col px-1">
        <div className="px-1">
          <div className="mb-2 flex items-center justify-between">
            <span
              className="text-main-purple text-[10px] font-black tracking-[0.2em] uppercase"
              aria-hidden="true"
            >
              Trending Now
            </span>
            <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">
              {getRelativeTime(date)}
            </span>
          </div>

          <h3 className="group-hover:text-main-purple truncate text-left text-base font-bold tracking-tighter text-slate-900 transition-colors sm:text-lg lg:text-xl">
            {title}
          </h3>
        </div>

        <div className="mt-4 flex items-center gap-4 border-t border-slate-100 pt-4 text-slate-400">
          <div className="flex items-center gap-1.5">
            <Image
              src={thumbsUpIcon}
              alt="좋아요 아이콘"
              width={14}
              height={14}
              className="opacity-40"
              aria-hidden="true"
            />
            <span
              className="text-[11px] font-black tracking-tighter sm:text-xs"
              aria-label={`좋아요 ${thumbsUp}개`}
            >
              {thumbsUp}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Image
              src={messageIcon}
              alt="댓글 아이콘"
              width={14}
              height={14}
              className="opacity-40"
              aria-hidden="true"
            />
            <span
              className="text-[11px] font-black tracking-tighter sm:text-xs"
              aria-label={`댓글 ${comment}개`}
            >
              {comment}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
