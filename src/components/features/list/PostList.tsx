"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import PostCard from "../card/PostCard";
import { getPosts } from "@/api/client/posts";
import { Post } from "@/types";
import { useRouter } from "next/navigation";
import { SearchX, Loader2 } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { PostListProps } from "@/types";
import { cn } from "@/lib/utils";
import PostCardListSkeleton from "@/components/skeleton/PostCardListSkeleton";
import { QUERY_KEYS } from "@/constans/queryKey";
import { getNextPageParam } from "@/lib/pagination";

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

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: QUERY_KEYS.posts.listParams({
        keyword: searchValue,
        sortBy: sortBy,
        sortOrder: sortOrder,
      }),
      queryFn: ({ pageParam }) =>
        getPosts({
          keyword: searchValue,
          sortBy: sortBy,
          sortOrder: sortOrder,
          size: 20,
          ...(pageParam ? { cursor: pageParam } : {}),
        }),
      initialPageParam: undefined as string | undefined,
      getNextPageParam,
      staleTime: 1000 * 60,
    });

  const bottomRef = useIntersectionObserver(
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  );

  const postList = data?.pages.flatMap((page) => page.data) || [];

  if (isLoading) return <PostCardListSkeleton />;

  return (
    <div
      className={cn(
        "w-full transition-opacity duration-500",
        isFetchingNextPage && "opacity-70",
      )}
    >
      <div className="flex flex-col">
        {postList.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            {postList.map((post: Post) => (
              <div
                key={post.id}
                className={cn(
                  "animate-fade-up group overflow-hidden rounded-[24px] bg-white transition-all duration-300",
                  "border border-slate-100/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)]",
                  "sm:hover:-translate-y-1 sm:hover:shadow-[0_20px_40px_rgba(38,6,86,0.08)]",
                )}
              >
                <PostCard
                  {...post}
                  authorName={post.author.name}
                  authorId={post.author.id}
                  commentCount={post._count.comments}
                  date={new Date(post.createdAt).toLocaleDateString("ko-KR", {
                    month: "long",
                    day: "numeric",
                  })}
                  timeAgo={post.createdAt}
                  thumbnailUrl={post.image}
                  onDetailClick={() => router.push(`/lounge/${post.id}`)}
                  onAuthorClick={() => router.push(`/users/${post.author.id}`)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center border-t border-slate-100 py-32">
            <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-slate-50">
              <SearchX className="size-10 text-slate-200" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-black tracking-tighter text-slate-900 uppercase">
              No Results found.
            </h3>
            <p className="mt-2 text-sm font-medium text-slate-400">
              다른 키워드로 아카이브를 탐색해보세요.
            </p>
          </div>
        )}
      </div>

      <div ref={bottomRef} className="flex h-32 items-center justify-center">
        {isFetchingNextPage && (
          <div className="flex items-center gap-3">
            <Loader2 className="text-main-purple animate-spin" size={20} />
            <span className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase">
              Updating Archive...
            </span>
          </div>
        )}
        {!hasNextPage && postList.length > 0 && (
          <span className="text-[10px] font-black tracking-[0.3em] text-slate-200 uppercase">
            End of Archive.
          </span>
        )}
      </div>
    </div>
  );
}
