"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import PostCard from "../card/PostCard";
import { getPosts } from "@/api/posts";
import { Post } from "@/types";
import { useRouter } from "next/navigation";
import { SearchX } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { cn } from "@/lib/utils";

interface Props {
  searchValue?: string;
  sortValue?: string;
}

export default function PostList({
  searchValue = "",
  sortValue = "latest",
}: Props) {
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
      className={cn(
        "flex w-full flex-col rounded-[2rem] border border-slate-100 bg-white/60 p-6 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] backdrop-blur-md sm:p-10",
        isFetchingNextPage && "opacity-60",
      )}
    >
      <div className="flex flex-col gap-10 sm:gap-14">
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
          <div className="flex flex-col items-center justify-center py-24">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50">
              <SearchX className="size-10 text-slate-300" />
            </div>
            <p className="text-xl font-black text-slate-900">NOT FOUND.</p>
            <p className="mt-2 text-slate-400">다른 키워드로 검색해 보세요.</p>
          </div>
        )}
      </div>
      <div
        ref={bottomRef}
        className="mt-10 flex h-32 items-center justify-center border-t border-slate-100"
      >
        {isFetchingNextPage && (
          <p className="animate-pulse text-[10px] font-black tracking-[0.4em] text-[#260656] uppercase">
            Fetching Archive...
          </p>
        )}
      </div>
    </div>
  );
}
