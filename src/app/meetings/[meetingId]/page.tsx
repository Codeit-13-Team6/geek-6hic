import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { MeetingDetailContent } from "@/app/meetings/[meetingId]/components/MeetingDetailContent";
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
import { MeetingDetailApiData } from "@/types/meeting/meetingTypes";

interface MeetingDetailPageProps {
  params: Promise<{
    meetingId: string;
  }>;
}

export default async function MeetingDetailPage({
  params,
}: MeetingDetailPageProps) {
  const { meetingId } = await params;
  const resolvedMeetingId = Number(meetingId);

  if (!Number.isFinite(resolvedMeetingId)) {
    notFound();
  }

  const queryClient = new QueryClient();

  await queryClient.fetchQuery({
    queryKey: getMeetingDetailQueryKey(resolvedMeetingId),
    queryFn: () => fetchMeetingDetailOnServer(resolvedMeetingId),
  });

  const meetingDetail = queryClient.getQueryData<MeetingDetailApiData>(
    getMeetingDetailQueryKey(resolvedMeetingId),
  );

  await queryClient.prefetchQuery({
    queryKey: getMeetingParticipantsQueryKey(resolvedMeetingId),
    queryFn: () => fetchMeetingParticipantsOnServer(resolvedMeetingId),
  });

  await queryClient.prefetchQuery({
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
