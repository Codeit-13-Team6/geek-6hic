"use client";

import Image from "next/image";
import profileImg from "@/assets/img/profile/female1-sm.jpg";
import thumbsUpIcon from "@/assets/icon/thumbsUp/state-false.svg";
import messageIcon from "@/assets/icon/message/message.svg";
import defaultImg from "@/assets/img/empty/img-default.png";
import { getPlainText } from "@/lib/contentLinkUtils";
import { PostCardProps } from "@/types";
import FallbackImage from "@/components/img/FallbackImage";

export default function PostCard({
  title,
  content,
  authorName,
  date,
  likeCount,
  commentCount,
  thumbnailUrl,
  onDetailClick,
}: PostCardProps) {
  const pureContent = getPlainText(content);

  return (
    <article
      onClick={onDetailClick}
      className="group flex cursor-pointer flex-col gap-6 rounded-2xl border-b border-slate-100 bg-transparent py-8 transition-all hover:bg-slate-100/50 sm:flex-row sm:gap-10 sm:px-4"
    >
      <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-2xl bg-slate-100 sm:aspect-square sm:h-40 sm:w-40 lg:h-48 lg:w-48">
        <FallbackImage
          src={thumbnailUrl || defaultImg.src}
          alt="thumb"
          fill
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = defaultImg.src;
          }}
        />
        <div className="absolute inset-0 bg-slate-950/5" />
      </div>

      <div className="flex flex-1 flex-col justify-between py-1">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              {date}
            </span>
          </div>

          <h3 className="group-hover:text-main-purple line-clamp-2 text-xl font-bold tracking-tighter text-slate-950 transition-colors sm:text-2xl lg:text-3xl">
            {title}
          </h3>

          <p className="line-clamp-2 text-sm leading-relaxed font-medium text-slate-500 sm:text-base">
            {pureContent || "내용이 없는 게시글입니다."}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative size-8 overflow-hidden rounded-full shadow-sm ring-2 ring-white">
              <Image
                src={profileImg}
                alt="author"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <span className="text-xs font-semibold tracking-tight text-slate-900 sm:text-sm">
              {authorName}
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <div className="flex items-center gap-1.5 transition-colors group-hover:text-slate-600">
              <Image
                src={thumbsUpIcon}
                alt="like"
                width={14}
                height={14}
                className="opacity-60"
                unoptimized
              />
              <span className="text-[11px] font-black tracking-tighter sm:text-sm">
                {likeCount}
              </span>
            </div>
            <div className="flex items-center gap-1.5 transition-colors group-hover:text-slate-600">
              <Image
                src={messageIcon}
                alt="comment"
                width={14}
                height={14}
                className="opacity-60"
                unoptimized
              />
              <span className="text-[11px] font-black tracking-tighter sm:text-sm">
                {commentCount}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
