import Link from "next/link";
import { BtnCommon } from "@/components/ui/BtnCommon";
import HotPostList from "./component/HotPostList";
import LoungeContent from "./component/LoungeSection";
import PrefetchBoundary from "@/components/boundary/PrefetchBoundary";
import { serverFetch } from "@/lib/server-fetcher";
import { Suspense } from "react";
import { GetPostsResponse } from "@/types";
import { InfiniteData } from "@tanstack/react-query";
import { filterThreadPosts } from "@/lib/postUtils";
import LoungeSkeleton from "./component/skeleton/LoungeSkeleton";
import { GitCommit } from "lucide-react";

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
    <div className="relative min-h-screen w-full bg-[#FAF9F6] pt-12 pb-24 font-sans tracking-tight text-slate-950 sm:pt-16 lg:pt-20">
      {/* 종이 질감 패턴 */}
      <div className="pointer-events-none fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/felt.png')] opacity-[0.02]"></div>

      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-6">
        {/* 매거진 스타일 헤더 */}
        <header className="mb-16 flex flex-col gap-10 border-b-2 border-slate-950 pb-12 sm:flex-row sm:items-end sm:justify-between lg:mb-20">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center bg-[#260656] text-xl shadow-[4px_4px_0_rgba(38,6,86,0.15)]">
                <GitCommit className="text-white" />
              </div>
              <span className="text-[10px] font-black tracking-[0.4em] text-[#260656] uppercase">
                Archive / Lounge
              </span>
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl leading-none font-black tracking-tighter text-slate-950 sm:text-5xl lg:text-6xl">
                SPRINT <span className="text-[#260656]">LOUNGE.</span>
              </h1>
              <p className="text-sm font-bold text-slate-400 sm:text-base">
                코드잇 스프린터의 모든 정보가 기록되는 공간입니다.
              </p>
            </div>
          </div>

          <Link href="/lounge/create" className="hidden sm:block">
            <BtnCommon className="rounded-xl bg-[#260656] px-8 py-3 text-xs font-black tracking-widest text-white shadow-[6px_6px_0_rgba(38,6,86,0.2)] transition-all hover:bg-[#1a043d] active:scale-95">
              + NEW ARCHIVE
            </BtnCommon>
          </Link>
        </header>

        {/* 이번주 HOT 섹션 */}
        <section className="mt-8 sm:mt-12">
          <div className="mb-8 flex items-center gap-3">
            <div className="h-1.5 w-8 bg-[#260656]" />
            <h2 className="text-xs font-black tracking-[0.2em] text-slate-950 uppercase">
              WEEKLY HOT INDEX
            </h2>
          </div>
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

      {/* 모바일 FAB */}
      <Link href="/lounge/create">
        <button className="fixed right-6 bottom-8 z-50 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#260656] text-2xl font-bold text-white shadow-[0_12px_24px_-8px_rgba(38,6,86,0.5)] transition-all active:scale-90 sm:hidden">
          +
        </button>
      </Link>
    </div>
  );
}
