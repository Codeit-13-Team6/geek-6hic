import { Metadata } from "next";
import LoungeDetailClient from "./component/LoungeDetailClient";
import { Suspense } from "react";
import PrefetchBoundary from "@/components/boundary/PrefetchBoundary";
import DetailSkeleton from "@/components/skeleton/DetailCardSkeleton";
import CommentSkeleton from "@/components/skeleton/CommentSkeleton";
import { getPostDetail, getPostCommentsServer } from "@/api/server";
import CommentSection from "@/components/features/comment/CommentSection";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const postId = Number(id);
  const post = await getPostDetail(postId);

  return {
    title: post.title,
    description: post.content.slice(0, 100), // 간단한 설명으로 게시글 내용의 앞부분 사용
    openGraph: {
      title: `${post.title} | co-git`,
      description: post.content.slice(0, 100),
      images: post.image ? [post.image] : undefined,
    },
  };
}

export default async function LoungeDetailPageServer({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const postId = Number(id);

  return (
    <div className="flex flex-col gap-10 py-0 sm:gap-12 lg:gap-16 lg:px-24">
      <Suspense fallback={<DetailSkeleton />}>
        <PrefetchBoundary
          prefetchFn={async (qc) => {
            await qc.prefetchQuery({
              queryKey: ["post", "edit-og", postId],
              queryFn: () => getPostDetail(postId),
            });
          }}
        >
          <LoungeDetailClient postId={postId} />
        </PrefetchBoundary>
      </Suspense>

      <Suspense fallback={<CommentSkeleton />}>
        <PrefetchBoundary
          prefetchFn={async (qc) => {
            await qc.prefetchQuery({
              queryKey: ["comments", postId],
              queryFn: () => getPostCommentsServer(postId),
            });
          }}
        >
          <CommentSection postId={postId} />
        </PrefetchBoundary>
      </Suspense>
    </div>
  );
}
