"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import PostCard from "../card/PostCard";
import { getPosts } from "@/api/posts";
import { Post } from "@/types";
import { useRouter } from "next/navigation";
import { SearchX } from "lucide-react";
import { useGetPostsList } from "@/hooks/queries/usePosts";
import { useAuthStore } from "@/store/useAuthStore";

interface Props {
  searchValue?: string;
  sortValue?: string;
  refetchType?: boolean;
  filterType?: "my" | "all";
}

export default function PostList({
  filterType = "all",
  searchValue = "",
  sortValue = "latest",
  refetchType = true,
}: Props) {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);

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

  // useQuery의 Key가 서버에서 prefetch한 ["posts", "list", sortValue, searchValue]와
  // 일치하면, 첫 로딩 시 API 호출 없이 서버 데이터를 바로 녹여서(Hydrate) 사용
  const { data, isFetching } = useGetPostsList(
    sortValue,
    searchValue,
    {
      keyword: searchValue,
      sortBy,
      sortOrder,
      size: filterType === "all" ? 100 : 20,
    },
    refetchType,
  );
  let postList = data?.data || [];

  if (filterType === "my") {
    postList = postList.filter((post: Post) => post.author.id === user?.id);
  }

  return (
    <div
      className={`${isFetching ? "opacity-50" : ""} flex w-full flex-col rounded-[24px] bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] sm:p-6 md:p-8`}
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
              {filterType === "my"
                ? "작성한 게시물이 없습니다."
                : "검색 결과가 없습니다."}
            </p>
            <p className="mt-2 text-gray-500">
              {filterType === "all" && (
                <p className="mt-2 text-gray-500">
                  다른 검색어로 다시 시도해보세요.
                </p>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
