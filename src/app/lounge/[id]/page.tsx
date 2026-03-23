"use client";

import { PostDetailCard } from "@/components/features/card/PostDetailCard";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getPostsDetail } from "@/api/posts";
import { useAuthStore } from "@/store/useAuthStore";
import CommentSection from "./component/comment/CommentSection";
import { parsePostContent } from "@/lib/parsePostContent";

export default function LoungeDetailPage() {
  const { id } = useParams();
  const postId = Number(id);
  const userId = useAuthStore((state) => state.user?.id);

  const {
    data: post,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["post", id],
    queryFn: () => getPostsDetail(postId),
    enabled: !!id, // id가 있을 때만 실행
  });

  const isPostOwner = userId !== null && userId === post?.author.id;
  const { mainContent, linkObjects } = parsePostContent(post?.content || "");

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (isError || !post) {
    return <div>게시글을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 pb-20 sm:p-8 lg:pt-12">
      <div className="mx-auto w-full max-w-[860px]">
        <section className="mb-10">
          <PostDetailCard
            title={post.title}
            name={post.author.name}
            date={new Date(post.createdAt)}
            content={mainContent} // 링크를 제외한 원래 본문 내용만
            linkObjects={linkObjects}
            img={post.image || ""} // 대표 썸네일 (일단 쓰지는 않음)
            thumbsUp={post.likeCount}
            comment={post.comments.length || 0}
            isOwner={isPostOwner}
            liked={post.isLiked}
          />
        </section>

        <CommentSection postId={postId} />
      </div>
    </div>
  );
}
