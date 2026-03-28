import LoungeDetailClient from "./component/LoungeDetailClient";
import { Suspense } from "react";
import PrefetchBoundary from "@/components/boundary/PrefetchBoundary";
import DetailSkeleton from "@/components/skeleton/DetailCardSkeleton";
import CommentSkeleton from "@/components/skeleton/CommentSkeleton";
import { getPostDetail, getPostCommentsServer } from "@/api/index-server";
import CommentSection from "@/components/features/comment/CommentSection";

export default async function LoungeDetailPageServer({
  params,
}: {
  params: Promise<{ id: string }>; // Next.js 15+ 에서는 params가 Promise
}) {
  const { id } = await params;
  const postId = Number(id);

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 pb-20 sm:p-8 lg:pt-12">
      <div className="mx-auto w-full max-w-[860px]">
        <Suspense fallback={<DetailSkeleton />}>
          <PrefetchBoundary
            prefetchFn={async (qc) => {
              await qc.prefetchQuery({
                queryKey: ["post", postId],
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
    </div>
  );
}
