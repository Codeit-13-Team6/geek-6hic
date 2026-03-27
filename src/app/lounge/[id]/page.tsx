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
