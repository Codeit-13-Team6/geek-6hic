"use client";

import { ThumbsUp, MessageSquare } from "lucide-react";
import { getPlainText } from "@/lib/contentLinkUtils";
import { PostCardProps } from "@/types";
import FallbackImage from "@/components/img/FallbackImage";

export default function PostCard({
  title,
  content,
  authorImage,
  authorName,
  date,
  likeCount,
  commentCount,
  thumbnailUrl,
  onDetailClick,
}: PostCardProps) {
  "use memo";

  const pureContent = getPlainText(content);

  return (
    <article
      tabIndex={0}
      role="button"
      onClick={onDetailClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onDetailClick?.();
        }
      }}
      className="group flex cursor-pointer flex-col items-stretch rounded-2xl bg-transparent transition-all focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-inset sm:flex-row sm:items-start sm:gap-8 sm:px-6 sm:py-6 sm:hover:bg-slate-50"
    >
      {/* 모바일에서 좌우/상단 여백 없이 꽉 차게 보이도록 설정 */}
      <div className="relative aspect-video w-full shrink-0 overflow-hidden sm:aspect-square sm:h-28 sm:w-28 sm:rounded-xl lg:h-32 lg:w-32">
        <FallbackImage
          src={thumbnailUrl}
          type="post"
          alt="게시물 이미지"
          fill
          className="h-full w-full object-cover transition-transform duration-700 sm:group-hover:scale-105"
        />
      </div>

      {/* 텍스트 영역 패딩: 모바일에서만 좌우 px-5 적용하여 카드 안쪽으로 정렬 */}
      <div className="flex flex-1 flex-col justify-between px-5 py-5 sm:px-0 sm:py-0">
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">
              {date}
            </span>
          </div>

          <h3 className="sm:group-hover:text-main-purple line-clamp-2 text-lg font-extrabold tracking-tighter text-slate-950 transition-colors sm:text-xl lg:text-2xl">
            {title}
          </h3>

          <p className="line-clamp-2 text-sm leading-relaxed font-medium break-all text-slate-500">
            {pureContent || "내용이 없는 게시글입니다."}
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-4 text-xs font-medium text-slate-400">
          <button
            type="button"
            className="flex items-center gap-2.5 rounded-full transition-opacity"
          >
            <div className="relative size-5 overflow-hidden rounded-full ring-2 ring-slate-50">
              <FallbackImage
                src={authorImage}
                type="user"
                alt="주최자 이미지"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <span className="text-slate-700">{authorName}</span>
          </button>

          <div className="flex items-center gap-3.5 opacity-80 transition-opacity sm:group-hover:opacity-100">
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <ThumbsUp
                size={13}
                strokeWidth={2.5}
                className="text-slate-300"
              />
              <span className="text-[13px] font-bold tracking-tight">
                {likeCount}
              </span>
            </div>
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <MessageSquare
                size={13}
                strokeWidth={2.5}
                className="text-slate-300"
              />
              <span className="text-[13px] font-bold tracking-tight">
                {commentCount}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
