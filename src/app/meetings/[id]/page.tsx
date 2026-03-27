import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { MeetingDetailContent } from "@/app/meetings/[id]/components/MeetingDetailContent";
import {
  fetchCurrentUserOnServer,
  fetchMeetingDetailOnServer,
  fetchMeetingParticipantsOnServer,
  fetchMeetingRecommendationCandidatesOnServer,
  fetchTodayAttendanceStatus,
} from "@/app/meetings/[id]/api/meeting-detail.server";
import { getAttendancePostId } from "@/app/meetings/[id]/api/meeting-detail.api";
import { MeetingDetailApiData } from "@/app/meetings/[id]/types";
import {
  getMeetingDetailQueryKey,
  getMeetingParticipantsQueryKey,
  getMeetingRecommendationCandidatesQueryKey,
} from "@/app/meetings/[id]/model/meeting-detail.query-keys";

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
    <main className="mx-auto flex w-full flex-col px-4 py-6 sm:px-6 sm:py-8 lg:max-w-[1280px] lg:px-8 lg:py-12">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <MeetingDetailContent
          meetingId={resolvedMeetingId}
          hasAttendedInitially={hasAttendedInitially}
        />
      </HydrationBoundary>
    </main>
  );
}
