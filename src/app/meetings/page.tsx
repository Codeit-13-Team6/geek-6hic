import { Metadata } from "next";
import PrefetchBoundary from "@/components/boundary/PrefetchBoundary";
import { getMeetingList } from "@/api/server";
import type { JoinedMeetingsResponse, SortBy, SortOrder } from "@/types";
import type { InfiniteData } from "@tanstack/react-query";
import { getNextPageParam } from "@/lib/pagination";
import MeetingCardSkeleton from "@/components/skeleton/MeetingCardSkeleton";
import { Suspense } from "react";
import { GitBranchIcon } from "@/components/icon/GitBranchIcon";
import { QUERY_KEYS } from "@/constans/queryKey";
import MeetingList from "@/components/features/list/MeetingList";
import { CreateMeetingModal } from "./_components/modal/CreateMeetingModal";
import MeetingSearchSection from "./_components/MeetingSearchSection";

export const metadata: Metadata = {
  title: "모임 찾기",
  description:
    "스프린터 파트너들과 공유하고, 협업하고, 성장하는 공간 - 모임을 생성하여 아지트를 만들어보세요.",
  openGraph: {
    title: "모임 찾기 | co-Git",
    description:
      "스프린터 파트너들과 공유하고, 협업하고, 성장하는 공간 - 모임을 생성하여 아지트를 만들어보세요.",
    images: ["/img/logo/cogit.png"],
  },
};

function MeetingFilterSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[1280px] px-6 lg:px-0">
      <div className="mt-6 mb-4 flex flex-col">
        <div className="flex gap-2">
          {["전체", "팀미팅", "스터디", "프로젝트", "취준생", "기타"].map(
            (label) => (
              <div
                key={label}
                className="rounded-[14px] bg-gray-100 px-4 py-2 text-transparent"
              >
                {label}
              </div>
            ),
          )}
        </div>
        <div className="mt-2 flex items-center justify-end gap-2">
          <div className="h-[38px] w-[70px] rounded-md bg-gray-100" />
          <div className="h-[50px] w-[140px] rounded-[12px] bg-gray-100" />
        </div>
      </div>
    </div>
  );
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    type?: string;
    keyword?: string;
    sortBy?: SortBy;
    sortOrder?: SortOrder;
  }>;
}) {
  const params = await searchParams;
  const type = params.type || "";
  const keyword = params.keyword || "";
  const sortBy = params.sortBy || "createdAt";
  const sortOrder = params.sortOrder || "desc";

  const currentParams = { type, keyword, sortBy, sortOrder };

  return (
    <div className="relative mx-auto w-full max-w-[1280px] px-6 py-10 sm:py-20 2xl:px-0">
      <div className="animate-fade-up">
        <div className="flex flex-col gap-10 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col gap-6 sm:gap-8">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="bg-main-purple shadow-mag flex h-12 min-h-12 w-12 min-w-12 items-center justify-center sm:h-16 sm:w-16">
                <GitBranchIcon />
              </div>
              <span className="text-main-purple text-[10px] font-black tracking-[0.3em] uppercase sm:text-xs">
                Connection / Archive
              </span>
            </div>

            <h1 className="text-5xl leading-[1.1] font-black tracking-tighter text-slate-950 sm:text-7xl lg:text-8xl">
              CO-GIT
              <br />
              <span className="text-main-purple">CONNECTION.</span>
            </h1>
          </div>

          <div className="flex shrink-0 flex-col items-start gap-4 text-left xl:items-end xl:text-right">
            <div className="w-full">
              <div className="bg-main-purple hidden h-1.5 w-20 lg:block xl:ml-auto"></div>
              <p className="text-lg font-medium tracking-tight text-slate-900 sm:text-xl lg:mt-4 lg:text-2xl">
                스프린터 파트너들과 <br className="sm:block xl:hidden" />
                공유하고, 협업하고, 성장하는 공간
              </p>
              <p className="mt-2 text-sm font-light tracking-tight text-slate-400 sm:text-base">
                모임을 생성하여 아지트를 만들어보세요.
              </p>
            </div>
          </div>
        </div>
        <div className="line-spread mt-8 mb-10 flex w-full justify-center sm:mt-10 sm:mb-15 lg:mt-15 lg:mb-24">
          <div className="h-[2px] w-full origin-center bg-gray-950" />
        </div>
      </div>

      <MeetingSearchSection />

      <Suspense
        key={`${type}-${sortBy}-${sortOrder}-${keyword}`}
        fallback={
          <div className="mx-auto max-w-[1280px]">
            <MeetingFilterSkeleton />
            <MeetingCardSkeleton />
          </div>
        }
      >
        <PrefetchBoundary
          prefetchFn={(qc) =>
            qc.prefetchInfiniteQuery<
              JoinedMeetingsResponse,
              Error,
              InfiniteData<JoinedMeetingsResponse>,
              readonly unknown[],
              string | undefined
            >({
              queryKey: QUERY_KEYS.meetings.listParams({
                type,
                keyword,
                sortBy,
                sortOrder,
              }),
              queryFn: ({ pageParam }) => {
                const cursor =
                  typeof pageParam === "string" ? pageParam : undefined;
                return getMeetingList({
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
          <MeetingList variant="all" />
        </PrefetchBoundary>
      </Suspense>
      <CreateMeetingModal />
    </div>
  );
}
