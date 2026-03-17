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

  // 원래는 백엔드측에서 필터걸어서 주는 형식이어야 하지만 프론트쪽에서 제한적으로 적용하는것이기 떄문에 최근 게시물 100개중에서만 나의 게시물 찾아오는 형식으로 제한적 구현
  const size = filterFn ? 100 : 10;

  const { data: loungeList } = useQuery({
    queryKey: ["posts", size],
    queryFn: () => getPosts({ size }),
  });

  let list = loungeList || [];

  if (filterFn) {
    list = list.filter(filterFn);
  }

  // 검색 기능 최적화 논의 (서버 사이드 필터링으로 바꾸는 게 좋을지?)
  if (searchValue.trim() !== "") {
    list = list.filter(
      (post) =>
        post.title.includes(searchValue) || post.content.includes(searchValue),
    );
  }

  // 추후 viewCount 추가 가능
  list = [...list].sort((a, b) => {
    if (sortValue === "popular") {
      return b.likeCount - a.likeCount;
    }
    if (sortValue === "oldest") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // 해당 컴포넌트가 라운지쪽과 마이페이지에서 사용하는데 필터링 하는 기준이 각각 달라서 외부에서 필터링 기준만 주입하는 형식으로 진행
  return (
    <div className="flex w-full flex-col rounded-[24px] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] md:p-8">
      <div className="flex flex-col sm:gap-8">
        {list?.map((post: Posts) => (
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
