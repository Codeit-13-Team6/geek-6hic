import {
  dehydrate,
  HydrationBoundary,
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
import { MeetingDetailApiData, MeetingDetailPageProps } from "@/types";

export default async function MeetingDetailPage({
  params,
}: MeetingDetailPageProps) {
  const { id } = await params;
  const resolvedMeetingId = Number(id);

  const queryClient = new QueryClient();

  queryClient.fetchQuery({
    queryKey: ["meeting-detail", resolvedMeetingId],
    queryFn: () => getMeetingDetail(resolvedMeetingId),
  });

  const meetingDetail = queryClient.getQueryData<MeetingDetailApiData>([
    "meeting-detail",
    resolvedMeetingId,
  ]);

  queryClient.prefetchQuery({
    queryKey: ["meeting-participants", resolvedMeetingId],
    queryFn: () => getMeetingParticipants(resolvedMeetingId),
  });

  queryClient.prefetchQuery({
    queryKey: ["meeting-recommendation-candidates", resolvedMeetingId],
    queryFn: () => getMeetingRecommendationCandidates(),
  });

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
    <main className="mx-auto flex w-full max-w-[375px] flex-col px-4 py-6 md:max-w-[744px] md:px-6 md:py-8 xl:max-w-[1280px] xl:px-0 xl:py-12">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <MeetingDetailContent
          meetingId={resolvedMeetingId}
          hasAttendedInitially={hasAttendedInitially}
        />
      </HydrationBoundary>
    </main>
  );
}
