"use client";

import { useQuery } from "@tanstack/react-query";
import PostCard from "../card/PostCard";
import { getPosts } from "@/api/posts";
import { Posts } from "@/types";
import { useRouter } from "next/navigation";
import { SearchX } from "lucide-react";

interface Props {
  filterFn?: (post: Posts) => boolean;
  searchValue?: string;
  sortValue?: string;
  refetchType?: boolean;
}

export default function PostList({
  filterFn,
  searchValue = "",
  sortValue = "latest",
  refetchType = true
}: Props) {
  const router = useRouter();

  const getSortParams = () => {
    switch (sortValue) {
      case "popular":
        return { sortBy: "likeCount" as const, sortOrder: "desc" as const };
      case "oldest":
        return { sortBy: "createdAt" as const, sortOrder: "asc" as const };
      default: // latest
        return { sortBy: "createdAt" as const, sortOrder: "desc" as const };
    }
  };

  const { sortBy, sortOrder } = getSortParams();

  const { data: response, isLoading } = useQuery({
    queryKey: ["posts", searchValue, sortValue],
    queryFn: () =>
      getPosts({
        keyword: searchValue,
        sortBy,
        sortOrder,
        size: filterFn ? 100 : 10,
      }),
    refetchOnWindowFocus: refetchType,
  });

  let list = response?.data || [];

  if (filterFn) {
    list = list.filter(filterFn);
  }

  if (isLoading)
    // 로딩 스피너 적용 예정
    return (
      <div className="p-20 text-center text-gray-400">
        데이터를 불러오고 있습니다...
      </div>
    );

  return (
    <div className="flex w-full flex-col rounded-[24px] bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] sm:p-6 md:p-8">
      <div className="flex flex-col sm:gap-8">
        {list.length > 0 ? (
          list.map((post: Posts) => (
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
    </div>
  );
}
