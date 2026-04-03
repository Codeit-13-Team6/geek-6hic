import { Metadata } from "next";
import { InfiniteData } from "@tanstack/react-query";
import { getJoinedMeetingsServer } from "@/api/server/meetings";
import type { JoinedMeetingsResponse } from "@/types";
import PrefetchBoundary from "@/components/boundary/PrefetchBoundary";
import { Suspense } from "react";
import MeetingCardSkeleton from "@/components/skeleton/MeetingCardSkeleton";
import { GitCommitIcon } from "lucide-react";
import { getNextPageParam } from "@/lib/pagination";
import { QUERY_KEYS } from "@/constans/queryKey";
import MeetingList from "@/components/features/list/MeetingList";

export const metadata: Metadata = {
  title: "나의 모임",
  description: "참여한 모임의 상세 정보를 다시 확인할 수 있습니다.",
  openGraph: {
    title: "나의 모임 | co-Git",
    description: "참여한 모임의 상세 정보를 다시 확인할 수 있습니다.",
    images: ["/img/logo/cogit.png"],
  },
};


export default async function Page() {
  return (
    <div className="relative w-full mx-auto max-w-[1280px] px-6 2xl:px-0 py-10 sm:py-20">
      <div className="animate-fade-up">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between lg:items-center">
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="bg-main-purple shadow-mag flex h-12 min-h-12 w-12 min-w-12 items-center justify-center sm:h-16 sm:w-16">
                <GitCommitIcon className="text-white" />
              </div>
              <span className="text-main-purple text-[10px] font-black tracking-[0.3em] uppercase sm:text-xs">
                Meetings / Joined
              </span>
            </div>
            <h1 className="text-4xl leading-none font-black tracking-tighter whitespace-nowrap text-slate-950 sm:text-5xl lg:text-6xl">
              MY <span className="text-main-purple">MEETINGS.</span>
            </h1>
          </div>

          <div className="flex flex-col lg:items-end lg:self-end lg:text-right">
            <div className="max-w-[420px]">
              <div className="bg-main-purple hidden h-1.5 w-16 sm:ml-auto lg:block" />
              <p className="lg:mt-4 text-sm font-light tracking-tight text-slate-400 sm:text-base">
                참여한 모임의 상세 정보를 다시 확인할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
        <div className="line-spread w-full flex justify-center mb-10 mt-8 sm:mb-15 sm:mt-10 lg:mb-24 lg:mt-15">
          <div className="h-[2px] bg-gray-950 w-full origin-center" />
        </div>
      </div>
      <div className="mb-12 flex items-center gap-3">
        <div className="bg-main-purple h-[6px] w-8 rounded-full" />
        <span className="text-[11px] font-black tracking-[0.3em] text-slate-950 uppercase">
          Joined List
        </span>
      </div>
      <Suspense fallback={<MeetingCardSkeleton />}>
        <PrefetchBoundary
          prefetchFn={(queryClient) =>
            queryClient.prefetchInfiniteQuery<
              JoinedMeetingsResponse,
              Error,
              InfiniteData<JoinedMeetingsResponse>,
              readonly string[],
              string | undefined
            >({
              queryKey: QUERY_KEYS.meetings.joined,
              queryFn: ({ pageParam }) =>
                getJoinedMeetingsServer(
                  pageParam
                    ? {
                      cursor: pageParam as string,
                      size: 10,
                      sortOrder: "desc",
                    }
                    : { size: 10, sortOrder: "desc" },
                ),
              initialPageParam: undefined,
              getNextPageParam: getNextPageParam<JoinedMeetingsResponse>,

            })
          }
        >
          <MeetingList variant="joined" meetingStatusBadgeVisible={false} />
        </PrefetchBoundary>
      </Suspense>
    </div>
  );
}
