import { Metadata } from "next";
import HotPostList from "@/app/lounge/_components/HotPostList";
import PrefetchBoundary from "@/components/boundary/PrefetchBoundary";
import { Suspense } from "react";
import LoungeSkeleton from "@/components/skeleton/LoungeSkeleton";
import HotPostListSkeleton from "@/components/skeleton/HotPostListSkeleton";
import { getLoungePostsPageBFF } from "@/bff/lounge";
import { getHotPostsBFF } from "@/bff/hot";
import { getNextPageParam } from "@/lib/pagination";
import { QUERY_KEYS } from "@/constants/queryKey";
import LoungeSearchSection from "./_components/LoungeSearchSection";
import PostList from "@/components/features/list/PostList";
import { GetPostsResponse, LoungeSortBy } from "@/types/post";
import { SortOrder } from "@/types";
import { InfiniteData } from "@tanstack/react-query";
import { LoungeHeroSection } from "./_components/LoungeHeroSection";
import { BtnCreate } from "@/components/ui/BtnCreate";

export const metadata: Metadata = {
  title: "스프린트 라운지",
  description: "스프린터 파트너들이 모여 정보를 공유하고 소통하는 공간입니다.",
  openGraph: {
    title: "스프린트 라운지 | co-Git",
    description:
      "스프린터 파트너들이 모여 정보를 공유하고 소통하는 공간입니다.",
    images: ["/img/logo/cogit.png"],
  },
};

export default async function LoungePage({
  searchParams,
}: {
  searchParams: Promise<{
    keyword?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}) {
  const params = await searchParams;
  const keyword = params.keyword || "";
  const sortBy = (params.sortBy || "createdAt") as LoungeSortBy;
  const sortOrder = (params.sortOrder || "desc") as SortOrder;

  const currentParams = { keyword, sortBy, sortOrder };

  return (
    <div className="relative mx-auto w-full max-w-[1280px] px-6 py-10 sm:py-15 lg:py-20 2xl:px-0">
      <LoungeHeroSection />
      <section className="mb-1 sm:mb-12" aria-labelledby="hot-posts-heading">
        <div className="animate-fade-up mt-10 mb-8 flex items-center gap-3">
          <div
            className="bg-main-purple h-[6px] w-8 rounded-full"
            aria-hidden="true"
          />
          <h2
            id="hot-posts-heading"
            className="text-[11px] font-black tracking-[0.3em] text-slate-950 uppercase"
          >
            Weekly HOT Posts
          </h2>
        </div>
        <div className="animate-fade-up">
          <Suspense fallback={<HotPostListSkeleton />}>
            <PrefetchBoundary
              prefetchFn={(qc) =>
                qc.prefetchQuery({
                  queryKey: QUERY_KEYS.posts.hot,
                  queryFn: () => getHotPostsBFF(),
                  staleTime: 1000 * 60 * 10,
                })
              }
            >
              <HotPostList />
            </PrefetchBoundary>
          </Suspense>
        </div>
      </section>
      <LoungeSearchSection />
      <Suspense
        key={`${sortBy}-${sortOrder}-${keyword}`}
        fallback={<LoungeSkeleton />}
      >
        <PrefetchBoundary
          prefetchFn={(qc) =>
            qc.prefetchInfiniteQuery<
              GetPostsResponse,
              Error,
              InfiniteData<GetPostsResponse>,
              readonly unknown[],
              string | undefined
            >({
              queryKey: QUERY_KEYS.posts.listParams(currentParams),
              queryFn: ({ pageParam }) => {
                const cursor =
                  typeof pageParam === "string" ? pageParam : undefined;
                return getLoungePostsPageBFF({
                  ...currentParams,
                  size: 10,
                  ...(cursor ? { cursor } : {}),
                });
              },
              initialPageParam: undefined,
              getNextPageParam,
              staleTime: 1000 * 60,
            })
          }
        >
          <section className="mt-10 sm:mt-12">
            <PostList />
          </section>
        </PrefetchBoundary>
      </Suspense>

      <BtnCreate path="/lounge/create" title="게시글 작성" />
    </div>
  );
}
