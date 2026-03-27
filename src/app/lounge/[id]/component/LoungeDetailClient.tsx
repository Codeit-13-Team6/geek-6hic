"use client";

import { PostDetailCard } from "@/components/features/card/PostDetailCard";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { parsePostData } from "@/lib/contentLinkUtils";
import {
  useDeletePost,
  useGetPostDetail,
  useToggleLike,
} from "@/hooks/queries/usePosts";
import { useState } from "react";
import ModalBase from "@/components/ui/ModalBase";
import { BtnCommon } from "@/components/ui/BtnCommon";
import CommentSection from "./comment/CommentSection";

export default function LoungeDetailClient({ postId }: { postId: number }) {
  const router = useRouter();
  const userId = useAuthStore((state) => state.user?.id);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: post, isLoading, isError } = useGetPostDetail(postId);
  const { mutate: removePost } = useDeletePost(postId);
  const { mutate: toggleLike } = useToggleLike(postId);

  const isPostOwner = userId !== null && userId === post?.author.id;
  const { content: mainContent, links: linkObjects } = parsePostData(
    post?.content || "",
  );

  const handlePostDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    removePost();
    setIsDeleteModalOpen(false);
  };
  const handlePostEdit = () => {
    router.push(`/lounge/edit/${postId}`);
  };

  const handleLikeClick = () => {
    if (post) {
      toggleLike(post.isLiked);
    }
  };

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
            thumbsUp={post.likeCount}
            comment={post.comments.length || 0}
            isOwner={isPostOwner}
            liked={post.isLiked}
            onEdit={handlePostEdit}
            onDelete={handlePostDelete}
            onLike={handleLikeClick}
            // img={post.image || ""} 대표 썸네일 (일단 쓰지는 않음)
          />
        </section>

        <CommentSection postId={postId} />
      </div>

      <ModalBase
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="게시글 삭제"
      >
        <div className="flex flex-col gap-6 pt-4">
          <p className="leading-relaxed text-gray-700">
            게시글을 삭제하시겠습니까? <br />
            삭제된 게시글은 복구할 수 없습니다.
          </p>

          <div className="flex justify-end gap-2">
            <BtnCommon
              variant="teritary"
              onClick={() => setIsDeleteModalOpen(false)}
              size="sm"
              className="w-[60px]"
            >
              취소
            </BtnCommon>
            <BtnCommon
              onClick={handleConfirmDelete}
              size="sm"
              className="w-[60px]"
            >
              삭제
            </BtnCommon>
          </div>
        </div>
      </ModalBase>
    </div>
  );
}
