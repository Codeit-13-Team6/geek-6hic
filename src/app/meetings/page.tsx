import { Metadata } from "next";
import MeetingsClient from "@/app/meetings/_components/MeetingsClient";
import PrefetchBoundary from "@/components/boundary/PrefetchBoundary";
import { getMeetingList } from "@/api/server";
import type { JoinedMeetingsResponse } from "@/types";
import type { InfiniteData } from "@tanstack/react-query";
import { getNextPageParam } from "@/lib/pagination";
import MeetingCardSkeleton from "@/components/skeleton/MeetingCardSkeleton";
import { Suspense } from "react";
import { GitBranchIcon } from "@/components/icon/GitBranchIcon";
import { QUERY_KEYS } from "@/constans/queryKey";

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

export default async function Page() {
  return (
    <div className="relative w-full">
      <div className="mb-10 border-b-2 border-slate-950 pb-8 sm:mb-15 sm:pb-10 lg:mb-24 lg:pb-15 animate-fade-up">
        <div className="grid grid-cols-1 gap-10 sm:items-end md:grid-cols-2 md:items-center">
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

          <div className="flex flex-col items-end gap-4 text-right">
            <div className="flex max-w-[470px] md:block">
              <div className="space-y-1">
                <div className="bg-main-purple mb-2 hidden h-1.5 w-20 md:ml-auto md:block"></div>
                <p className="text-lg font-medium tracking-tight text-slate-900 sm:text-xl lg:text-2xl">
                  스프린터 파트너들과 <br className="sm:hidden md:block" />
                  공유하고, 협업하고, 성장하는 공간
                </p>
                <p className="text-sm font-light tracking-tight text-slate-400 md:text-base">
                  모임을 생성하여 아지트를 만들어보세요.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Suspense
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
              queryKey: QUERY_KEYS.meetings.list,
              queryFn: ({ pageParam }) => {
                const cursor =
                  typeof pageParam === "string" ? pageParam : undefined;
                return getMeetingList({
                  size: 10,
                  ...(cursor ? { cursor } : {}),
                });
              },
              initialPageParam: undefined,
              getNextPageParam,
              staleTime: 1000 * 60
            })
          }
        >
          <MeetingsClient />
        </PrefetchBoundary>
      </Suspense>
    </div>
  );
}
