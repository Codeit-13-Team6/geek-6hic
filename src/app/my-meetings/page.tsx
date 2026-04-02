import { Metadata } from "next";
import { InfiniteData } from "@tanstack/react-query";
import { getJoinedMeetingsServer } from "@/api/server/meetings";
import type { JoinedMeetingsResponse } from "@/types";
import MyMeetingsClient from "@/app/my-meetings/_components/MyMeetingsClient";
import PrefetchBoundary from "@/components/boundary/PrefetchBoundary";
import { Suspense } from "react";
import MeetingCardSkeleton from "@/components/skeleton/MeetingCardSkeleton";
import { GitCommitIcon } from "lucide-react";
import { getNextPageParam } from "@/lib/pagination";

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
    <div className="relative w-full">
      <header className="mb-10 border-b-2 border-slate-950 pb-8 sm:mb-20 sm:pb-12 lg:pb-12">
        <div className="grid grid-cols-1 gap-10 sm:items-end md:grid-cols-2 md:items-center">
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="bg-main-purple shadow-mag flex h-12 min-h-12 w-12 min-w-12 items-center justify-center sm:h-16 sm:w-16">
                <GitCommitIcon className="text-white" />
              </div>
              <span className="text-main-purple text-[10px] font-black tracking-[0.3em] uppercase sm:text-xs">
                Meetings / Joined
              </span>
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl leading-none font-black tracking-tighter whitespace-nowrap text-slate-950 sm:text-5xl lg:text-6xl">
                MY <span className="text-main-purple">MEETINGS.</span>
              </h1>
            </div>
          </div>

          <div className="flex flex-col items-end self-end text-right">
            <div className="max-w-[420px]">
              <div className="bg-main-purple mb-2 hidden h-1.5 w-16 md:ml-auto md:block" />
              <p className="text-sm font-medium tracking-tight text-slate-400 sm:text-base">
                참여한 모임의 상세 정보를 다시 확인할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </header>

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
              queryKey: ["meetings", "joined"],
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
          <MyMeetingsClient />
        </PrefetchBoundary>
      </Suspense>
    </div>
  );
}
