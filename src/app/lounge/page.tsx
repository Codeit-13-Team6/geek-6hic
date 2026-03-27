import Link from "next/link";
import { BtnCommon } from "@/components/ui/BtnCommon";
import HotPostList from "./component/HotPostList";
import LoungeContent from "./component/LoungeSection";
import PrefetchBoundary from "@/components/boundary/PrefetchBoundary";
import { serverFetch } from "@/lib/server-fetcher";
import { Suspense } from "react";
import { GetPostsResponse, Post } from "@/types";
import { EmptyData } from "@/components/features/empty/EmptyData";
import { InfiniteData } from "@tanstack/react-query";
import { filterThreadPosts } from "@/lib/postUtils";
import LoungeSkeleton from "./component/skeleton/LoungeSkeleton";

const getNextPageParam = <
  T extends { hasMore: boolean; nextCursor: string | null },
>(
  lastPage: T,
) => (lastPage.hasMore ? (lastPage.nextCursor ?? undefined) : undefined);

const fetchPosts = async (cursor?: string): Promise<GetPostsResponse> => {
  const { data: res } = await serverFetch({
    method: "GET",
    url: "/posts",
    params: {
      keyword: "",
      sortBy: "createdAt",
      sortOrder: "desc",
      size: 20,
      ...(cursor ? { cursor } : {}),
    },
  });

  return filterThreadPosts(res);
};

export default async function LoungePage() {
  return (
    <div className="w-full bg-gray-50 pt-6 pb-20 sm:pt-10 lg:pt-[48px]">
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* 헤더 구역 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-[36px] shrink-0 items-center justify-center rounded-full sm:mr-2 sm:size-[54px]">
              <span className="text-3xl sm:text-5xl">💬</span>
            </div>
            <div>
              <h1 className="text-[20px] font-bold text-gray-900 sm:text-[24px] lg:text-[32px]">
                스프린트 라운지
              </h1>
              <p className="mt-1 text-base font-medium text-gray-500 sm:text-lg lg:text-xl">
                코드잇 스프린터의 정보 공유 라운지
              </p>
            </div>
          </div>

          <Link href="/lounge/create" className="hidden sm:block">
            <BtnCommon size="fixedSize" className="w-auto px-6">
              + 게시물 등록하기
            </BtnCommon>
          </Link>
        </div>
        <section className="mt-8 sm:mt-12">
          <h2 className="mb-4 text-[18px] font-bold text-gray-900 sm:mb-6 sm:text-[20px]">
            | 이번주 HOT 게시물
          </h2>

          <HotPostList />
        </section>

        <Suspense fallback={<LoungeSkeleton />}>
          <PrefetchBoundary
            prefetchFn={(qc) =>
              qc.prefetchInfiniteQuery<
                GetPostsResponse,
                Error,
                InfiniteData<GetPostsResponse>,
                readonly string[],
                string | undefined
              >({
                queryKey: ["posts", "list", "latest", ""],
                queryFn: ({ pageParam }) => fetchPosts(pageParam),
                initialPageParam: undefined,
                getNextPageParam,
              })
            }
          >
            <LoungeContent />
          </PrefetchBoundary>
        </Suspense>
      </div>

      <Link href="/lounge/create">
        <BtnCommon
          size="icon-md"
          className="fixed right-4 bottom-6 z-50 size-14 pb-1 text-3xl leading-none shadow-lg transition-transform hover:scale-105 sm:hidden"
        >
          +
        </BtnCommon>
      </Link>
    </div>
  );
}
