"use client";

import LoungePostForm from "@/app/lounge/_component/LoungePostForm";
import { useCreatePost } from "@/shared/hooks";

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
