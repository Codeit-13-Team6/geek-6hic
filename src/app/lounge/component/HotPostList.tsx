"use client";

import { useRouter } from "next/navigation";
import { Post } from "@/types";
import { HotPostCard } from "./HotPostCard";
import { useGetHotPosts } from "@/hooks/queries/usePosts";

export default function HotPostList() {
  const router = useRouter();
  const { data: hotList = [], isLoading } = useGetHotPosts();

  if (isLoading) {
    return (
      <div className="flex h-[150px] w-full items-center justify-center border border-slate-100 bg-white/60 backdrop-blur-sm">
        <p className="animate-pulse text-[10px] font-black tracking-[0.4em] text-[#260656] uppercase">
          Fetching Hot Archive...
        </p>
      </div>
    );
  }

  if (hotList.length === 0) {
    return (
      <div className="flex h-[150px] w-full items-center justify-center border border-slate-100 bg-white text-xs font-bold tracking-widest text-slate-300 uppercase">
        No Hot Archive Found. 🔥
      </div>
    );
  }

  return (
    <div className="scrollbar-hide flex gap-6 overflow-x-auto p-1 pb-6 sm:gap-8">
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
