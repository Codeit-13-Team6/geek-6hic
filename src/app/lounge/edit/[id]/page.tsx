"use client";

import { useParams } from "next/navigation";
import { useGetPostForEdit, useUpdatePost } from "@/hooks/queries/usePosts";
import LoungePostForm from "../../component/LoungePostForm";

export default function LoungeEditPage() {
  const { id } = useParams();
  const postId = Number(id);

  const { initialData, post, isLoading } = useGetPostForEdit(postId);
  const { mutate: handleUpdate, isPending } = useUpdatePost(postId);

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
