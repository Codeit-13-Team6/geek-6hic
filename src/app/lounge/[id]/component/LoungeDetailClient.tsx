"use client";

import { PostDetailCard } from "@/app/lounge/[id]/component/PostDetailCard";
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
import DetailSkeleton from "@/components/skeleton/DetailCardSkeleton";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";

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

  if (isLoading) return <DetailSkeleton />;

  if (isError || !post) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-xl font-black tracking-tighter text-slate-900">
          게시글을 찾을 수 없습니다.
        </h2>
      </div>
    );
  }

  return (
    <>
      <section className="w-full sm:px-6 lg:-mt-7 lg:px-22">
        <PostDetailCard
          title={post.title}
          name={post.author.name}
          date={new Date(post.createdAt)}
          content={mainContent}
          linkObjects={linkObjects}
          thumbsUp={post.likeCount}
          comment={post.comments.length || 0}
          isOwner={isPostOwner}
          isLiked={post.isLiked}
          onEdit={handlePostEdit}
          onDelete={handlePostDelete}
          onLike={handleLikeClick}
        />
      </section>

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="DELETE ARCHIVE"
        description="게시글을 삭제하시겠습니까?"
        subDescription="삭제된 데이터는 복구할 수 없습니다. 신중하게 선택해 주세요."
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
