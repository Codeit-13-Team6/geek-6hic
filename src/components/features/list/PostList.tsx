"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import PostCard from "../card/PostCard";
import { getPosts } from "@/api/posts";
import { Post } from "@/types";
import { useRouter } from "next/navigation";
import { SearchX } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { PostListProps } from "@/types";

export default function PostList({
  searchValue = "",
  sortValue = "latest",
}: PostListProps) {
  const router = useRouter();

  const getSortParams = () => {
    switch (sortValue) {
      case "popular":
        return { sortBy: "likeCount" as const, sortOrder: "desc" as const };
      case "comment":
        return { sortBy: "commentCount" as const, sortOrder: "desc" as const };
      case "oldest":
        return { sortBy: "createdAt" as const, sortOrder: "asc" as const };
      default: // latest
        return { sortBy: "createdAt" as const, sortOrder: "desc" as const };
    }
  };

  const { sortBy, sortOrder } = getSortParams();

  // 게시글 리스트 key ["posts", "list", sortValue, searchValue]
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["posts", "list", sortValue, searchValue],
      queryFn: ({ pageParam }) =>
        getPosts({
          keyword: searchValue,
          sortBy: sortBy,
          sortOrder: sortOrder,
          size: 20,
          ...(pageParam ? { cursor: pageParam } : {}),
        }),
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (lastPage) =>
        lastPage.hasMore ? (lastPage.nextCursor ?? undefined) : undefined,
    });

  const bottomRef = useIntersectionObserver(
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  );

  const postList = data?.pages.flatMap((page) => page.data) || [];

  return (
    <div
      className={`${isFetchingNextPage ? "opacity-50" : ""} flex w-full flex-col rounded-[24px] bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] sm:p-6 md:p-8`}
    >
      <div className="flex flex-col sm:gap-8">
        {postList.length > 0 ? (
          postList.map((post: Post) => (
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
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-gray-50">
              <SearchX className="size-8 text-gray-300" />
            </div>
            <p className="text-lg font-semibold text-gray-900">
              검색 결과가 없습니다.
            </p>
            <p className="mt-2 text-gray-500">
              다른 검색어로 다시 시도해보세요.
            </p>
          </div>
        )}
      </div>
      <div ref={bottomRef} className="flex h-20 items-center justify-center">
        {isFetchingNextPage && <p>불러오는 중...</p>}
      </div>
    </div>
  );
}
