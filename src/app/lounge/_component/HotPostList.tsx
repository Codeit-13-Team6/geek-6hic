"use client";

import { useRouter } from "next/navigation";
import { Post } from "@/types";
import { HotPostCard } from "./HotPostCard";
import { useGetHotPosts } from "@/hooks/queries/usePosts";
import { Loader2, Flame } from "lucide-react";
import { useDragScroll } from "@/hooks/useDragScroll";

export default function HotPostList() {
  const router = useRouter();
  const { data: hotList = [], isLoading } = useGetHotPosts();
  const { dragProps } = useDragScroll();

  if (isLoading) {
    return (
      <div
        className="flex h-[200px] w-full flex-col items-center justify-center gap-3 rounded-[32px] border border-slate-100 bg-slate-50/50"
        role="status"
        aria-live="polite"
      >
        <Loader2 className="text-main-purple animate-spin" size={24} />
        <span className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase">
          인기글을 불러오는 중...
        </span>
      </div>
    );
  }

  if (hotList.length === 0) {
    return (
      <div
        className="flex h-[200px] w-full flex-col items-center justify-center gap-2 rounded-[32px] border border-dashed border-slate-200 text-slate-400"
        role="status"
        aria-label="인기 게시물 없음"
      >
        <Flame size={24} className="opacity-20" />
        <p className="text-xs font-bold tracking-widest uppercase opacity-50">
          이번주의 HOT 게시물이 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div
      {...dragProps}
      className="custom-scrollbar flex gap-5 overflow-x-auto pb-8 sm:gap-8"
      role="region"
      aria-label="인기 게시물 목록"
    >
      {hotList.map((post: Post) => (
        <HotPostCard
          key={post.id}
          title={post.title}
          date={post.createdAt}
          imageSrc={post.image}
          thumbsUp={post.likeCount}
          comment={post._count?.comments || post.comments?.length || 0}
          onDetailClick={() => router.push(`/lounge/${post.id}`)}
        />
      ))}
    </div>
  );
}
