"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetPostForEdit, useUpdatePost } from "@/hooks";
import LoungePostForm from "@/app/lounge/_component/LoungePostForm";
import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export default function LoungeEditPage() {
  const { id } = useParams();
  const postId = Number(id);
  const router = useRouter();
  const userId = useAuthStore((state) => state.user?.id);

  const { initialData, post, isLoading } = useGetPostForEdit(postId);
  const { mutate: handleUpdate, isPending } = useUpdatePost(postId);

  useEffect(() => {
    if (post && userId && post.author.id !== userId) {
      alert("수정 권한이 없습니다.");
      router.replace(`/lounge/${postId}`);
    }
  }, [post, userId, router, postId]);


  if (isLoading || !initialData) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-500">
        데이터를 불러오는 중입니다...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-500">
        게시글을 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <LoungePostForm
      initialData={initialData}
      onSubmit={handleUpdate}
      isSubmitting={isPending}
      submitButtonText="수정"
    />
  );
}
