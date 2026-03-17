"use client";

import { useQuery } from "@tanstack/react-query";
import LoungePostCardCommon from "./LoungePostCardCommon";
import { getPosts } from "@/api/posts";
import { Posts } from "@/types";
import { useRouter } from "next/navigation";

export default function LoungePostListCommon() {
  const router = useRouter();

  const { data: loungeList } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  return (
    <div className="flex w-full flex-col rounded-[24px] bg-white px-6 py-2 shadow-[0_2px_12px_rgba(0,0,0,0.04)] sm:p-8">
      <div className="flex flex-col sm:gap-12">
        {loungeList?.map((post: Posts) => (
          <LoungePostCardCommon
            key={post.id}
            id={post.id}
            title={post.title}
            content={post.content}
            authorName={post.author.name}
            date={new Date(post.createdAt).toLocaleDateString("ko-KR", {
              month: "long",
              day: "numeric",
            })}
            timeAgo={post.createdAt}
            likeCount={post.likeCount}
            commentCount={post._count.comments}
            thumbnailUrl={post.image}
            onDetailClick={() => router.push(`/lounge/${post.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
