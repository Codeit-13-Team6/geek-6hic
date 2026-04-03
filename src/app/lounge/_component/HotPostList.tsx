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
      <div className="flex h-[200px] w-full flex-col items-center justify-center gap-3 rounded-[32px] border border-slate-100 bg-slate-50/50">
        <Loader2 className="text-main-purple animate-spin" size={24} />
        <span className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase">
          Loading Trends...
        </span>
      </div>
    );
  }

  if (hotList.length === 0) {
    return (
      <div className="flex h-[200px] w-full flex-col items-center justify-center gap-2 rounded-[32px] border border-dashed border-slate-200 text-slate-400">
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
      className="custom-scrollbar -mx-4 flex gap-5 overflow-x-auto px-4 pb-8 sm:-mx-6 sm:gap-8 sm:px-6 lg:-mx-8 lg:px-8"
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
