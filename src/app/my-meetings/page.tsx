import { Metadata } from "next";
import { InfiniteData } from "@tanstack/react-query";
import type { JoinedMeetingsResponse } from "@/types";
import PrefetchBoundary from "@/components/boundary/PrefetchBoundary";
import { Suspense } from "react";
import { getNextPageParam } from "@/lib/pagination";
import { QUERY_KEYS } from "@/constans/queryKey";
import MeetingList from "@/components/features/list/MeetingList";
import { MyMeetingsHeroSection } from "./_components/MyMeetingsHeroSection";
import MeetingsSkeleton from "@/components/skeleton/MeetingsSkeleton";
import { getJoinedMeetingsServer } from "@/api/server";

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
    <div className="relative mx-auto w-full max-w-[1280px] px-6 py-10 sm:py-15 lg:py-20 2xl:px-0">
      <MyMeetingsHeroSection />

      <div className="animate-fade-up mb-8 flex items-center gap-3 sm:mb-10">
        <div className="bg-main-purple h-[6px] w-8 rounded-full shadow-sm" />
        <span className="text-[11px] font-black tracking-[0.3em] text-slate-950 uppercase sm:text-xs">
          Joined List
        </span>
      </div>

      <Suspense fallback={<MeetingsSkeleton />}>
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
