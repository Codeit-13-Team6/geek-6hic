"use client";

import { useQuery } from "@tanstack/react-query";
import LoungePostCardCommon from "./LoungePostCardCommon";
import { getPosts } from "@/api/posts";
import { Posts } from "@/types";
import { useRouter } from "next/navigation";

interface Props {
  filterFn?: (post: Posts) => boolean;
  searchValue?: string;
  sortValue?: string;
}

export default function LoungePostListCommon({
  filterFn,
  searchValue = "",
  sortValue = "latest",
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

  const { data: response } = useQuery({
    queryKey: ["posts", searchValue, sortValue],
    queryFn: () =>
      getPosts({
        keyword: searchValue,
        sortBy,
        sortOrder,
        size: filterFn ? 100 : 10,
      }),
  });

  let list = response?.data || [];

  if (filterFn) {
    list = list.filter(filterFn);
  }

  return (
    <div className="flex w-full flex-col rounded-[24px] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] md:p-8">
      <div className="flex flex-col sm:gap-8">
        {list.map((post: Posts) => (
          <LoungePostCardCommon
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
    </div>
  );
}
