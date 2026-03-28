import Image from "next/image";

import bannerLg from "@/assets/img/banner/banner-lg.png";
import bannerSm from "@/assets/img/banner/banner-sm.png";
import MeetingsClient from "./components/MeetingsClient";
import PrefetchBoundary from "@/components/boundary/PrefetchBoundary";
import { getMeetingList } from "@/api/meetings";
import type { JoinedMeetingsResponse } from "@/types";
import type { InfiniteData } from "@tanstack/react-query";
import { getNextPageParam } from "@/lib/pagination";

export default async function Page() {
  return (
    <div className="w-full bg-gray-50 pb-20 sm:pt-6 lg:pt-[48px]">
      <div className="relative mx-auto flex min-h-48 w-full items-center overflow-hidden bg-[#9debcd] bg-[url('/img/banner/banner-lg-demo.jpg')] bg-cover bg-center bg-no-repeat pl-4 sm:min-h-61 sm:max-w-[calc(100%-48px)] sm:rounded-3xl sm:bg-none sm:pl-10 lg:max-w-[1280px] lg:pl-14">
        <div>
          <h4 className="text-sm text-green-700 sm:text-xl">
            함께할 사람을 찾고 계신가요?
          </h4>
          <h3 className="mt-[10px] text-lg font-semibold sm:text-3xl">
            지금 모임에 참여해보세요
          </h3>

          <div className="absolute top-7 left-[323px] hidden h-[273px] w-117 sm:block lg:hidden">
            <Image src={bannerLg} fill alt="" />
          </div>

          <div className="absolute top-2 right-21 hidden h-[313px] w-134 lg:block">
            <Image src={bannerSm} fill alt="" />
          </div>
        </div>
      </div>

      <PrefetchBoundary
        prefetchFn={(qc) =>
          qc.prefetchInfiniteQuery<
            JoinedMeetingsResponse,
            Error,
            InfiniteData<JoinedMeetingsResponse>,
            readonly [string, string, null],
            string | undefined
          >({
            queryKey: ["meetings", "all", null],
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
          })
        }
      >
        <MeetingsClient />
      </PrefetchBoundary>
    </div>
  );
}
