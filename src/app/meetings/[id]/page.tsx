import { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  type InfiniteData,
  QueryClient,
} from "@tanstack/react-query";
import { MeetingDetailContent } from "@/app/meetings/[id]/components/MeetingDetailContent";

import {
  getCurrentUserOnServer,
  getMeetingDetail,
  getMeetingParticipants,
  getMeetingRecommendationCandidates,
  getTodayAttendanceStatus,
} from "@/api/server/meetingDetail";
import {
  type GetPostsResponse,
  MeetingDetailApiData,
  MeetingDetailPageProps,
} from "@/types";
import DetailSkeleton from "@/components/skeleton/DetailCardSkeleton";
import { Suspense } from "react";
import { getLoungePosts } from "@/api/server";
import { getNextPageParam } from "@/lib/pagination";
import PrefetchBoundary from "@/components/boundary/PrefetchBoundary";
import { QUERY_KEYS } from "@/constans/queryKey";

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

  const queryClient = new QueryClient();

  const meetingDetail = queryClient.getQueryData<MeetingDetailApiData>([
    "meeting-detail",
    resolvedMeetingId,
  ]);

  const user = await getCurrentUserOnServer();

  const getAttendancePostId = (region: string) => {
    const postId = Number(region);
    return Number.isFinite(postId) && postId > 0 ? postId : null;
  };

  const hasAttendedInitially = await getTodayAttendanceStatus({
    postId: getAttendancePostId(meetingDetail?.region ?? ""),
    userId: user?.id,
  });

  return (
    <main className="mx-auto flex w-full flex-col">
      <Suspense fallback={<DetailSkeleton />}>
        <PrefetchBoundary
          prefetchFn={async (qc) => {
            await Promise.all([
              qc.prefetchQuery({
                queryKey: QUERY_KEYS.meetings.detail(resolvedMeetingId),
                queryFn: () => getMeetingDetail(resolvedMeetingId),
              }),
              qc.prefetchQuery({
                queryKey: QUERY_KEYS.meetings.participants(resolvedMeetingId),
                queryFn: () => getMeetingParticipants(resolvedMeetingId),
              }),
              qc.prefetchQuery({
                queryKey: QUERY_KEYS.meetings.detail(resolvedMeetingId),
                queryFn: () => getMeetingRecommendationCandidates(),
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
          }}
        >
          <MeetingDetailContent
            meetingId={resolvedMeetingId}
            hasAttendedInitially={hasAttendedInitially}
          />
        </PrefetchBoundary>
      </Suspense>
    </main>
  );
}
