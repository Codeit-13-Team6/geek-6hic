import { Metadata } from "next";
import PrefetchBoundary from "@/components/boundary/PrefetchBoundary";
import { getMeetingList } from "@/api/server";
import type { JoinedMeetingsResponse } from "@/types";
import type { InfiniteData } from "@tanstack/react-query";
import { getNextPageParam } from "@/lib/pagination";
import MeetingCardSkeleton from "@/components/skeleton/MeetingCardSkeleton";
import { Suspense } from "react";
import { GitBranchIcon } from "@/components/icon/GitBranchIcon";
import { QUERY_KEYS } from "@/constans/queryKey";
import MeetingFilters from "@/app/meetings/_components/MeetingsFilters";
import MeetingList from "@/components/features/list/MeetingList";


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
    sortBy?: string;
    sortOrder?: string;
  }>;
}) {
  const params = await searchParams;
  return (
    <div className="relative w-full mx-auto max-w-[1280px] px-6 2xl:px-0 py-10 sm:py-20">
      <div className="animate-fade-up">
        <div className="flex flex-col gap-10 xl:flex-row xl:justify-between xl:items-center">
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

          <div className="flex flex-col items-start xl:items-end gap-4 text-left xl:text-right shrink-0">
            <div className="w-full">
              <div className="bg-main-purple hidden h-1.5 w-20 xl:ml-auto lg:block"></div>
              <p className="lg:mt-4 text-lg font-medium tracking-tight text-slate-900 sm:text-xl lg:text-2xl">
                스프린터 파트너들과 <br className="xl:hidden sm:block" />
                공유하고, 협업하고, 성장하는 공간
              </p>
              <p className="mt-2 text-sm font-light tracking-tight text-slate-400 sm:text-base">
                모임을 생성하여 아지트를 만들어보세요.
              </p>
            </div>
          </div>

        </div>
        <div className="line-spread w-full flex justify-center mb-10 mt-8 sm:mb-15 sm:mt-10 lg:mb-24 lg:mt-15">
          <div className="h-[2px] bg-gray-950 w-full origin-center" />
        </div>
      </div>

      <div className="mb-10 sm:mb-14">
        <MeetingFilters />
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
              queryKey: QUERY_KEYS.meetings.listParams({
                type: params.type ?? "",
                sortBy: params.sortBy ?? "dateTime",
                sortOrder: params.sortOrder ?? "desc",
              }),
              queryFn: ({ pageParam }) => {
                const cursor =
                  typeof pageParam === "string" ? pageParam : undefined;
                return getMeetingList({
                  type: params.type ?? "",
                  sortBy: (params.sortBy ?? "dateTime") as
                    | "dateTime"
                    | "registrationEnd"
                    | "participantCount",
                  sortOrder: (params.sortOrder ?? "desc") as "asc" | "desc",
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
    </div>
  );
}
