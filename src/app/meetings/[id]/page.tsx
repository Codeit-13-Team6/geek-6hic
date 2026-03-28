import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { MeetingDetailContent } from "@/app/meetings/[id]/components/MeetingDetailContent";
import { getAttendancePostId } from "@/api/meeting-detail.api";

import {
  fetchCurrentUserOnServer,
  fetchMeetingDetailOnServer,
  fetchMeetingParticipantsOnServer,
  fetchMeetingRecommendationCandidatesOnServer,
  fetchTodayAttendanceStatus,
} from "@/api/meeting-detail.server";
import {
  getMeetingDetailQueryKey,
  getMeetingParticipantsQueryKey,
  getMeetingRecommendationCandidatesQueryKey,
} from "@/hooks/meetings/meeting-detail.query-keys";
import {
  MeetingDetailApiData,
  MeetingDetailPageProps,
} from "@/types/meeting/meetingTypes";

export default async function MeetingDetailPage({
  params,
}: MeetingDetailPageProps) {
  const { id } = await params;
  const resolvedMeetingId = Number(id);

  console.log("lllllllllresolvedMeetingId", resolvedMeetingId);

  const queryClient = new QueryClient();

  queryClient.fetchQuery({
    queryKey: getMeetingDetailQueryKey(resolvedMeetingId),
    queryFn: () => fetchMeetingDetailOnServer(resolvedMeetingId),
  });

  const meetingDetail = queryClient.getQueryData<MeetingDetailApiData>(
    getMeetingDetailQueryKey(resolvedMeetingId),
  );

  queryClient.prefetchQuery({
    queryKey: getMeetingParticipantsQueryKey(resolvedMeetingId),
    queryFn: () => fetchMeetingParticipantsOnServer(resolvedMeetingId),
  });

  queryClient.prefetchQuery({
    queryKey: getMeetingRecommendationCandidatesQueryKey(resolvedMeetingId),
    queryFn: () => fetchMeetingRecommendationCandidatesOnServer(),
  });

  const user = await fetchCurrentUserOnServer();
  const hasAttendedInitially = await fetchTodayAttendanceStatus({
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
