"use client";

import { useParams, useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePost } from "@/api/posts";
import { ToastCommon } from "@/components/ui/ToastCommon";
import LoungePostForm, { PostPayload } from "../../component/LoungePostForm";
import { useGetPostForEdit } from "@/hooks/usePosts";

export default function LoungeEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const postId = Number(id);

  const { initialData, post, isLoading } = useGetPostForEdit(postId);

  // 게시글 수정
  const { mutate: handleUpdate, isPending } = useMutation({
    mutationFn: (payload: PostPayload) => updatePost(postId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", id] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });

      ToastCommon({ message: "게시글이 수정되었습니다.", size: "sm" });
      router.push(`/lounge/${postId}`);
    },
    onError: (error) => {
      console.error("게시글 수정 실패:", error);
      ToastCommon({ message: "수정에 실패했습니다.", size: "sm" });
    },
  });

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
