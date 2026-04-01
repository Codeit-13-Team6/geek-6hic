"use client";

import { useRouter } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getPosts } from "@/api/client/posts";
import PostCard from "@/components/features/card/PostCard";
import { useAuthStore } from "@/store/useAuthStore";
import { Post } from "@/types";
import { SearchX } from "lucide-react";
import { useIntersectionObserver } from "@/hooks";
import { filterThreadPosts } from "@/lib/postUtils";

export default function MyPostList() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["posts", "list", "my", "latest", ""],
      queryFn: ({ pageParam }) =>
        getPosts({
          keyword: "",
          sortBy: "createdAt",
          sortOrder: "desc",
          size: 20,
          ...(pageParam ? { cursor: pageParam } : {}),
        }),
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (lastPage) =>
        lastPage.hasMore ? (lastPage.nextCursor ?? undefined) : undefined,
      select: (data) => ({
        ...data,
        pages: data.pages.map((page) =>
          filterThreadPosts({
            ...page,
            data: page.data.filter((post: Post) => post.author.id === user?.id),
          }),
        ),
      }),
    });

  const bottomRef = useIntersectionObserver(
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  );

  const allPosts = data?.pages.flatMap((page) => page.data) ?? [];

  if (allPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-gray-50">
          <SearchX className="size-8 text-gray-300" />
        </div>
        <p className="text-lg font-semibold text-gray-900">
          작성한 게시물이 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col rounded-[24px] bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
      <div className="flex flex-col sm:gap-8">
        {allPosts.map((post: Post) => (
          <PostCard
            key={post.id}
            {...post}
            authorName={post.author.name}
            commentCount={post._count.comments}
            date={new Date(post.createdAt).toLocaleDateString("ko-KR", {
              month: "long",
              day: "numeric",
            })}
            timeAgo={post.createdAt}
            thumbnailUrl={post.image}
            onDetailClick={() => router.push(`/lounge/${post.id}`)}
          />
        ))}
      </div>
      <div
        ref={bottomRef}
        className="flex h-20 items-center justify-center text-sm text-gray-400"
      >
        {isFetchingNextPage && <p>불러오는 중...</p>}
        {!hasNextPage && allPosts.length > 0 && (
          <p>더 이상 게시물이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
