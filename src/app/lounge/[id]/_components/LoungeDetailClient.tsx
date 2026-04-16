"use client";

import { PostDetailCard } from "@/app/lounge/[id]/_components/PostDetailCard";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { parsePostData } from "@/lib/contentLinkUtils";
import {
  useDeletePost,
  useGetPostDetail,
  useToggleLike,
} from "@/hooks/queries/usePosts";
import { useState } from "react";
import { DeleteModal } from "@/components/modal/DeleteModal";
import { useLoginModalStore } from "@/store/useLoginModalStore";
import DetailSkeleton from "@/components/skeleton/DetailCardSkeleton";

export default function LoungeDetailClient({ postId }: { postId: number }) {
  const router = useRouter();
  const userId = useAuthStore((state) => state.user?.id);
  const loginGuardAction = useLoginModalStore((s) => s.loginGuardAction);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { data: post, isError, isLoading } = useGetPostDetail(postId);
  const { mutate: removePost } = useDeletePost(postId);
  const { mutate: toggleLike } = useToggleLike(postId);
  const isPostOwner = userId !== null && userId === post?.author?.id;
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
    return <DetailSkeleton />;
  }

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
      <section>
        <PostDetailCard
          title={post.title}
          name={post.author.name}
          authorId={post.author.id}
          date={new Date(post.createdAt)}
          content={mainContent}
          linkObjects={linkObjects}
          avatar={post.author.image ?? undefined}
          thumbsUp={post.likeCount}
          comment={post.comments.length || 0}
          isOwner={isPostOwner}
          isLiked={post.isLiked}
          onEdit={handlePostEdit}
          onDelete={handlePostDelete}
          onLike={() => {
            loginGuardAction(handleLikeClick);
          }}
          onAuthorClick={() => router.push(`/users/${post.author.id}`)}
        />
      </section>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        description="게시글을 삭제하시겠습니까?"
        subDescription="삭제된 데이터는 복구할 수 없습니다."
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
