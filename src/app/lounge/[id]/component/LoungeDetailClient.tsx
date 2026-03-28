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

  const handlePostDelete = () => setIsDeleteModalOpen(true);
  const handleConfirmDelete = () => {
    removePost();
    setIsDeleteModalOpen(false);
  };
  const handlePostEdit = () => router.push(`/lounge/edit/${postId}`);
  const handleLikeClick = () => {
    if (post) toggleLike(post.isLiked);
  };

  if (isLoading)
    return (
      <div className="animate-pulse py-20 text-center font-black text-[#260656]">
        FETCHING ARCHIVE...
      </div>
    );
  if (isError || !post)
    return (
      <div className="py-20 text-center font-bold text-slate-400 uppercase">
        Archive Not Found.
      </div>
    );

  return (
    <>
      <section className="mb-12">
        <PostDetailCard
          title={post.title}
          name={post.author.name}
          date={new Date(post.createdAt)}
          content={mainContent}
          linkObjects={linkObjects}
          thumbsUp={post.likeCount}
          comment={post.comments.length || 0}
          isOwner={isPostOwner}
          liked={post.isLiked}
          onEdit={handlePostEdit}
          onDelete={handlePostDelete}
          onLike={handleLikeClick}
        />
      </section>

      <ModalBase
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="DELETE ARCHIVE"
        contentClassName="rounded-[2rem] border-slate-200 shadow-2xl"
      >
        <div className="flex flex-col gap-8 pt-4">
          <p className="text-lg leading-relaxed font-bold text-slate-900">
            기록을 삭제하시겠습니까? <br />
            삭제된 아카이브는 복구할 수 없습니다.
          </p>

          <div className="flex justify-end gap-3">
            <BtnCommon
              variant="teritary"
              onClick={() => setIsDeleteModalOpen(false)}
              className="rounded-xl px-6 py-3 font-bold text-slate-400"
            >
              취소
            </BtnCommon>
            <BtnCommon
              onClick={handleConfirmDelete}
              className="rounded-xl bg-[#260656] px-8 py-3 font-black text-white shadow-[4px_4px_0_rgba(38,6,86,0.2)]"
            >
              삭제
            </BtnCommon>
          </div>
        </div>
      </ModalBase>
    </>
  );
}
