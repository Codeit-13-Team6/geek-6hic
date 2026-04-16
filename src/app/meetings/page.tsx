import { Metadata } from "next";
import PrefetchBoundary from "@/shared/components/boundary/PrefetchBoundary";
import { getMeetingList } from "@/shared/api/server";
import type { JoinedMeetingsResponse, MeetingSortBy, SortOrder } from "@/shared/types";
import type { InfiniteData } from "@tanstack/react-query";
import { getNextPageParam } from "@/shared/lib/pagination";
import { Suspense } from "react";
import { QUERY_KEYS } from "@/shared/constants/queryKey";
import MeetingList from "@/shared/components/features/list/MeetingList";
import { CreateMeetingModal } from "./_components/modal/CreateMeetingModal";
import { MeetingsControlSkeleton } from "@/shared/components/skeleton/MeetingsControlSkeleton";
import { MeetingsHeroSection } from "./_components/MeetingsHeroSection";
import SearchFilterBar from "@/shared/components/features/composite/SearchFilterBar";
import MeetingTypeTabs from "./_components/MettingTypeTabs";
import MeetingsSkeleton from "@/shared/components/skeleton/MeetingsSkeleton";

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

const MEETING_SORT_OPTIONS = [
  { value: "createdAt_desc", label: "최신순" },
  { value: "participantCount_desc", label: "참여인원순" },
  { value: "createdAt_asc", label: "오래된순" },
];

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    type?: string;
    keyword?: string;
    sortBy?: MeetingSortBy;
    sortOrder?: SortOrder;
  }>;
}) {
  const params = await searchParams;
  const type = params.type || "";
  const keyword = params.keyword || "";
  const sortBy = params.sortBy || ("createdAt" as MeetingSortBy);
  const sortOrder = params.sortOrder || ("desc" as SortOrder);

  const currentParams = { type, keyword, sortBy, sortOrder };

  return (
    <div className="relative mx-auto w-full max-w-[1280px] px-6 py-10 sm:py-15 lg:py-20 2xl:px-0">
      <MeetingsHeroSection />

      <Suspense fallback={<MeetingsControlSkeleton />}>
        <div className="animate-fade-up">
          <MeetingTypeTabs />

          <SearchFilterBar
            sortOptions={MEETING_SORT_OPTIONS}
            searchPlaceholder={"어떤 모임을 찾으시나요?"}
          />
        </div>
      </Suspense>

      <Suspense
        key={`${type}-${sortBy}-${sortOrder}-${keyword}`}
        fallback={
          <div className="mx-auto max-w-[1280px]">
            <MeetingsSkeleton />
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
              queryKey: QUERY_KEYS.meetings.listParams(currentParams),
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
