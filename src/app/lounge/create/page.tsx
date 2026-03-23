"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { ToastCommon } from "@/components/ui/ToastCommon";
import LoungePostForm, { PostPayload } from "../component/LoungePostForm";

export default function LoungeCreatePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // POST API 통신 로직
  const handleCreate = async (payload: PostPayload) => {
    setIsSubmitting(true);
    try {
      await axiosInstance.post("/posts", payload);
      ToastCommon({ message: "게시글이 등록되었습니다.", size: "sm" });
      router.push("/lounge"); // 성공 시 목록으로 이동
    } catch (error) {
      console.error("게시글 등록 실패:", error);
      ToastCommon({ message: "게시글 등록에 실패했습니다.", size: "sm" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LoungePostForm
      onSubmit={handleCreate}
      isSubmitting={isSubmitting}
      submitButtonText="등록"
    />
  );
}
