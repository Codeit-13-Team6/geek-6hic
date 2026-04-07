import { Metadata } from "next";
import { type InfiniteData } from "@tanstack/react-query";
import { MeetingDetailContent } from "@/app/meetings/[id]/components/MeetingDetailContent";

import {
  getCurrentUserOnServer,
  getMeetingDetail,
  getMeetingParticipants,
  getTodayAttendanceStatus,
} from "@/api/server/meetingDetail";
import { type GetPostsResponse, MeetingDetailPageProps } from "@/types";
import DetailSkeleton from "@/components/skeleton/DetailCardSkeleton";
import { Suspense } from "react";
import { getLoungePosts } from "@/api/server";
import { getNextPageParam } from "@/lib/pagination";
import PrefetchBoundary from "@/components/boundary/PrefetchBoundary";
import { QUERY_KEYS } from "@/constans/queryKey";
import { BtnBack } from "@/components/features/btn/BtnBack";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const meetingId = Number(id);
  const meetingDetail = await getMeetingDetail(meetingId);

  return {
    title: meetingDetail.name,
    description: meetingDetail.description,
    openGraph: {
      title: `${meetingDetail.name} | co-git`,
      description: meetingDetail.description.slice(0, 100),
      images: meetingDetail.image ? [meetingDetail.image] : undefined,
    },
  };
}

export default async function MeetingDetailPage({
  params,
}: MeetingDetailPageProps) {
  const { id } = await params;
  const resolvedMeetingId = Number(id);
  const user = await getCurrentUserOnServer();

  return (
    <div className="relative mx-auto w-full max-w-[1280px] px-6 py-10 2xl:px-0">
      <BtnBack fallbackHref="/meetings" />
      <Suspense fallback={<DetailSkeleton />}>
        <PrefetchBoundary
          prefetchFn={async (qc) => {
            const [detail] = await Promise.all([
              qc.fetchQuery({
                queryKey: QUERY_KEYS.meetings.detail(resolvedMeetingId),
                queryFn: () => getMeetingDetail(resolvedMeetingId),
              }),
              qc.prefetchQuery({
                queryKey: QUERY_KEYS.meetings.participants(resolvedMeetingId),
                queryFn: () => getMeetingParticipants(resolvedMeetingId),
              }),
              qc.prefetchInfiniteQuery<
                GetPostsResponse,
                Error,
                InfiniteData<GetPostsResponse>,
                readonly string[],
                string | undefined
              >({
                queryKey: QUERY_KEYS.posts.root,
                queryFn: ({ pageParam }) => getLoungePosts(pageParam),
                initialPageParam: undefined,
                getNextPageParam,
              }),
            ]);

            const postId =
              Number(detail.region) > 0 ? Number(detail.region) : null;
            await qc.prefetchQuery({
              queryKey: QUERY_KEYS.meetings.attendance(resolvedMeetingId),
              queryFn: () =>
                getTodayAttendanceStatus({ postId, userId: user?.id }),
            });
          }}
        >
          <MeetingDetailContent meetingId={resolvedMeetingId} />
        </PrefetchBoundary>
      </Suspense>
    </div>
  );
}
