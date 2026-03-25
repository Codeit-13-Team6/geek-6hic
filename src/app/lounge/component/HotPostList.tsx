"use client";

import { useRouter } from "next/navigation";
import { Post } from "@/types";
import { HotPostCard } from "./HotPostCard";
import { useGetHotPosts } from "@/hooks/queries/usePosts";

export default function HotPostList() {
  const router = useRouter();

  // hydration
  // api 호출 X -> 즉시 데이터를 꺼내서 hotList에 넣어줌 (로딩 시간 0초)
  const { data: hotList = [] } = useGetHotPosts();

  if (hotList.length === 0) {
    return (
      <div className="flex h-[150px] w-full items-center justify-center rounded-[16px] bg-white text-sm text-gray-500 shadow-sm sm:text-base">
        이번 주 핫 게시물이 없습니다. 🔥
      </div>
    );
  }

  return (
    <div className="scrollbar-hide flex gap-4 overflow-x-auto p-0.5 pt-1 pb-4 sm:gap-6">
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
