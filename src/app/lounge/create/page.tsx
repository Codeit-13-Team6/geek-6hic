"use client";

import LoungePostForm from "@/app/lounge/_components/LoungePostForm";
import { useCreatePost } from "@/hooks";

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
