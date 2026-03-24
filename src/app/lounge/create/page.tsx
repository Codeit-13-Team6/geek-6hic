"use client";

import LoungePostForm from "@/app/lounge/component/LoungePostForm";
import { useCreatePost } from "@/hooks/queries/usePosts";

export default function LoungeCreatePage() {
  const { mutate: handleCreate, isPending } = useCreatePost();

  return (
    <LoungePostForm
      onSubmit={handleCreate}
      isSubmitting={isPending}
      submitButtonText="등록"
    />
  );
}
