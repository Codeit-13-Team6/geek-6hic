"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/client-fetcher";
import { ToastCommon } from "@/components/ui/ToastCommon";
import LoungePostForm from "@/app/lounge/component/LoungePostForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "@/api/posts";

interface PostPayload {
  title: string;
  content: string;
  image?: string;
}

export default function LoungeCreatePage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: handleCreate, isPending } = useMutation({
    mutationFn: (payload: PostPayload) => createPost(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });

      ToastCommon({ message: "게시글이 등록되었습니다.", size: "sm" });
      router.push("/lounge");
    },
    onError: (error) => {
      console.error("게시글 등록 실패:", error);
      ToastCommon({ message: "게시글 등록에 실패했습니다.", size: "sm" });
    },
  });

  return (
    <LoungePostForm
      onSubmit={handleCreate}
      isSubmitting={isPending}
      submitButtonText="등록"
    />
  );
}
