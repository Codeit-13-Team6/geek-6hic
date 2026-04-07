"use client";

import { useRouter } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getPosts } from "@/api/client/posts";
import PostCard from "@/components/features/card/PostCard";
import { useAuthStore } from "@/store/useAuthStore";
import { Post } from "@/types";
import { Loader2, FileText } from "lucide-react";
import { useIntersectionObserver } from "@/hooks";
import { filterThreadPosts } from "@/lib/postUtils";
import { QUERY_KEYS } from "@/constans/queryKey";

export default function MyPostList() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: QUERY_KEYS.posts.my,
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
      staleTime: 1000 * 60 * 5,
    });

  const bottomRef = useIntersectionObserver(
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  );

  const allPosts = data?.pages.flatMap((page) => page.data) ?? [];

  if (allPosts.length === 0 && !isFetchingNextPage) {
    return (
      <div className="flex flex-col items-center justify-center border-t border-slate-100 py-32">
        <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-slate-50">
          <FileText className="size-10 text-slate-200" strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-black tracking-tighter text-slate-900 uppercase">
          Your Lounge is Empty.
        </h3>
        <p className="mt-2 text-sm font-medium text-slate-400">
          라운지에 소중한 첫 기록을 남겨보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col">
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {allPosts.map((post: Post) => (
          <div
            key={post.id}
            className="group overflow-hidden rounded-[24px] border border-slate-100/50 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 sm:hover:-translate-y-1 sm:hover:shadow-[0_20px_40px_rgba(38,6,86,0.08)]"
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
      <div ref={bottomRef} className="flex h-32 items-center justify-center">
        {isFetchingNextPage ? (
          <div className="flex items-center gap-3">
            <Loader2 className="text-main-purple animate-spin" size={20} />
            <span className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase">
              Updating Lounge...
            </span>
          </div>
        ) : (
          !hasNextPage &&
          allPosts.length > 0 && (
            <span className="text-[10px] font-black tracking-[0.3em] text-slate-200 uppercase">
              End of Posts.
            </span>
          )
        )}
      </div>
    </div>
  );
}
