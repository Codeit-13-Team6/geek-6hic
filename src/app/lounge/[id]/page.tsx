import LoungeDetailClient from "./component/LoungeDetailClient";
import { serverFetch } from "@/lib/server-fetcher";
import { Suspense } from "react";
import PrefetchBoundary from "@/components/boundary/PrefetchBoundary";
import CommentSection from "./component/comment/CommentSection";
import DetailSkeleton from "../component/skeleton/DetailCardSkeleton";
import CommentSkeleton from "../component/skeleton/CommentSkeleton";

const fetchPostDetail = async (postId: number) => {
  const { data } = await serverFetch({
    method: "GET",
    url: `/posts/${postId}`,
  });
  return data;
};

const fetchPostComments = async (postId: number) => {
  const { data } = await serverFetch({
    method: "GET",
    url: `/posts/${postId}/comments`,
    params: {
      sortOrder: "desc",
      size: 100,
    },
  });
  return data;
};

export default async function LoungeDetailPageServer({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const postId = Number(id);

  return (
    <div className="relative min-h-screen w-full bg-[#FAF9F6] p-4 pb-24 sm:p-12 lg:pt-16">
      {/* 종이 질감 패턴 */}
      <div className="pointer-events-none fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/felt.png')] opacity-[0.02]" />

      <div className="relative z-10 mx-auto w-full max-w-[860px]">
        <Suspense fallback={<DetailSkeleton />}>
          <PrefetchBoundary
            prefetchFn={async (qc) => {
              await qc.prefetchQuery({
                queryKey: ["post", postId],
                queryFn: () => fetchPostDetail(postId),
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
                queryFn: () => fetchPostComments(postId),
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
