import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { notFound } from "next/navigation";

import { MeetingDetailContent } from "@/app/meetings/[meetingId]/components/MeetingDetailContent";
import {
  MeetingDetailApiData,
  MeetingListResponse,
  MeetingParticipantsResponse,
} from "@/app/meetings/[meetingId]/types";
import { serverFetch } from "@/lib/server-fetcher";

const PARTICIPANTS_PAGE_SIZE = 100;
const RECOMMENDED_MEETINGS_PAGE_SIZE = 100;

const getMeetingDetailQueryKey = (meetingId: number) =>
  ["meeting-detail", meetingId] as const;

const getMeetingParticipantsQueryKey = (meetingId: number) =>
  ["meeting-participants", meetingId] as const;

const getMeetingRecommendationCandidatesQueryKey = (meetingId: number) =>
  ["meeting-recommendation-candidates", meetingId] as const;

async function fetchMeetingDetailOnServer(meetingId: number) {
  const response = await serverFetch<MeetingDetailApiData>({
    url: `/meetings/${meetingId}`,
    method: "GET",
  });

  return response.data;
}

async function fetchMeetingParticipantsOnServer(meetingId: number) {
  const response = await serverFetch<MeetingParticipantsResponse>({
    url: `/meetings/${meetingId}/participants`,
    method: "GET",
    params: {
      size: PARTICIPANTS_PAGE_SIZE,
    },
  });

  return response.data;
}

async function fetchMeetingRecommendationCandidatesOnServer() {
  const response = await serverFetch<MeetingListResponse>({
    url: "/meetings",
    method: "GET",
    params: {
      sortBy: "dateTime",
      sortOrder: "asc",
      size: RECOMMENDED_MEETINGS_PAGE_SIZE,
    },
  });

  return response.data;
}

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

  await queryClient.prefetchQuery({
    queryKey: getMeetingParticipantsQueryKey(resolvedMeetingId),
    queryFn: () => fetchMeetingParticipantsOnServer(resolvedMeetingId),
  });

  await queryClient.prefetchQuery({
    queryKey: getMeetingRecommendationCandidatesQueryKey(resolvedMeetingId),
    queryFn: () => fetchMeetingRecommendationCandidatesOnServer(),
  });

  return (
    <main className="mx-auto flex w-full max-w-[375px] flex-col px-4 py-6 md:max-w-[744px] md:px-6 md:py-8 xl:max-w-[1280px] xl:px-0 xl:py-12">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <MeetingDetailContent meetingId={resolvedMeetingId} />
      </HydrationBoundary>
    </main>
  );
}
