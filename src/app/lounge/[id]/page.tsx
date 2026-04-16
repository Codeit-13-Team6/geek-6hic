import { Metadata } from "next";
import LoungeDetailClient from "./_components/LoungeDetailClient";
import { Suspense } from "react";
import PrefetchBoundary from "@/components/boundary/PrefetchBoundary";
import DetailSkeleton from "@/components/skeleton/DetailCardSkeleton";
import { getPostCommentsServer, getPostDetail } from "@/api/server";
import CommentSection from "@/components/features/comment/CommentSection";
import { QUERY_KEYS } from "@/constants/queryKey";
import { BtnBack } from "@/components/ui/BtnBack";

const COMMENTS_PAGE_LIMIT = 10;

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

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
    <div className="relative mx-auto w-full max-w-[900px] px-6 py-10 2xl:px-0">
      <BtnBack fallbackHref="/lounge" />

      <Suspense fallback={<DetailSkeleton />}>
        <PrefetchBoundary
          prefetchFn={async (qc) => {
            await Promise.all([
              qc.prefetchQuery({
                queryKey: QUERY_KEYS.posts.detail(postId),
                queryFn: () => getPostDetail(postId),
              }),
              qc.prefetchQuery({
                queryKey: QUERY_KEYS.comments.page(postId, 1, COMMENTS_PAGE_LIMIT),
                queryFn: () =>
                  getPostCommentsServer(postId, {
                    offset: 0,
                    limit: COMMENTS_PAGE_LIMIT,
                  }),
              }),
            ]);
          }}
        >
          <LoungeDetailClient postId={postId} />
        </PrefetchBoundary>
      </Suspense>

      <CommentSection postId={postId} />
    </div>
  );
}
