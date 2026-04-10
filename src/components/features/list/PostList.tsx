"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import PostCard from "../card/PostCard";
import { getLoungePostsBFF } from "@/api/client/posts";
import { GetPostsResponse, LoungeSortBy, Post, SortOrder } from "@/types";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { cn } from "@/lib/utils";
import { QUERY_KEYS } from "@/constans/queryKey";
import { getNextPageParam } from "@/lib/pagination";
import { useUrlQuery } from "@/hooks/useUrlQuery";
import { NoResultFound } from "@/components/ui/NoResultFound";
import InfiniteScrollTrigger from "@/components/ui/InfiniteScrollTrigger";

export default function PostList() {
  const router = useRouter();

  const { getParam } = useUrlQuery();
  const keyword = getParam("keyword") || "";
  const sortBy = (getParam("sortBy") || "createdAt") as LoungeSortBy;
  const sortOrder = (getParam("sortOrder") || "desc") as SortOrder;

  const currentParams = { keyword, sortBy, sortOrder };
  const listQueryKey = QUERY_KEYS.posts.listParams(currentParams);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery<GetPostsResponse>({
      queryKey: listQueryKey,
      queryFn: ({ pageParam }) => {
        const cursor = typeof pageParam === "string" ? pageParam : undefined;
        return getLoungePostsBFF({
          ...currentParams,
          size: 10,
          ...(cursor ? { cursor } : {}),
        });
      },
      initialPageParam: undefined,
      getNextPageParam,
      staleTime: 1000 * 60,
    });

  const postList = data?.pages.flatMap((page) => page.data) || [];

  const bottomRef = useIntersectionObserver(
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  );

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
              <article
                key={post.id}
                role="button"
                tabIndex={0}
                onClick={() => router.push(`/lounge/${post.id}`)}
                onKeyDown={(e) => {
                  // 엔터 키 입력시 이동
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    router.push(`/lounge/${post.id}`);
                  }
                }}
                className={cn(
                  "animate-fade-up group cursor-pointer overflow-hidden rounded-[24px] bg-white transition-all duration-300",
                  "border border-slate-100/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)]",
                  "sm:hover:-translate-y-1 sm:hover:shadow-[0_20px_40px_rgba(38,6,86,0.08)]",
                  "focus-visible:ring-2 focus-visible:ring-black focus-visible:outline-none",
                )}
              >
                <PostCard
                  {...post}
                  authorImage={post.author.image}
                  authorName={post.author.name}
                  authorId={post.author.id}
                  commentCount={post._count.comments}
                  date={new Date(post.createdAt).toLocaleDateString("ko-KR", {
                    month: "long",
                    day: "numeric",
                  })}
                  timeAgo={post.createdAt}
                  thumbnailUrl={post.image}
                />
              </article>
            ))}
          </div>
        ) : (
          <NoResultFound />
        )}
      </div>

      <InfiniteScrollTrigger
        ref={bottomRef}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        hasData={postList.length > 0}
      />
    </div>
  );
}
