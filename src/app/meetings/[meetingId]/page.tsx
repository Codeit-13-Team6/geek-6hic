import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { notFound } from "next/navigation";
import type { AxiosResponse } from "axios";
import { MeetingDetailContent } from "@/app/meetings/[meetingId]/components/MeetingDetailContent";
import {
  MeetingAttendanceCommentsResponse,
  MeetingDetailApiData,
  MeetingListResponse,
  MeetingParticipantsResponse,
} from "@/app/meetings/[meetingId]/types";
import { serverAxios, serverFetch } from "@/lib/server-fetcher";
import type { User } from "@/types";

const PARTICIPANTS_PAGE_SIZE = 100;
const RECOMMENDED_MEETINGS_PAGE_SIZE = 100;
const ATTENDANCE_COMMENT_PREFIX = "onlyScore_";

const getMeetingDetailQueryKey = (meetingId: number) =>
  ["meeting-detail", meetingId] as const;

const getMeetingParticipantsQueryKey = (meetingId: number) =>
  ["meeting-participants", meetingId] as const;

const getMeetingRecommendationCandidatesQueryKey = (meetingId: number) =>
  ["meeting-recommendation-candidates", meetingId] as const;

const getAttendancePostId = (region: string) => {
  const postId = Number(region);

  return Number.isFinite(postId) && postId > 0 ? postId : null;
};

const getStartOfToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return today;
};

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

async function fetchCurrentUserOnServer() {
  try {
    const response = await serverAxios.get<User>("/users/me");
    return response.data;
  } catch {
    return null;
  }
}

async function fetchTodayAttendanceStatus({
  postId,
  userId,
}: {
  postId: number | null;
  userId?: number;
}) {
  if (!postId || !userId) {
    return false;
  }

  try {
    const startOfToday = getStartOfToday();
    let cursor: string | undefined = undefined;

    while (true) {
      const response: AxiosResponse<MeetingAttendanceCommentsResponse> =
        await serverFetch<MeetingAttendanceCommentsResponse>({
          url: `/posts/${postId}/comments`,
          method: "GET",
          params: {
            sortOrder: "desc",
            size: 50,
            ...(cursor ? { cursor } : {}),
          },
        });

      for (const comment of response.data.data) {
        if (new Date(comment.createdAt) < startOfToday) {
          return false;
        }

        if (
          comment.authorId === userId &&
          comment.content.startsWith(ATTENDANCE_COMMENT_PREFIX)
        ) {
          return true;
        }
      }

      if (!response.data.hasMore || !response.data.nextCursor) {
        return false;
      }

      cursor = response.data.nextCursor;
    }
  } catch {
    return false;
  }
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
  const initialHasAttended = await fetchTodayAttendanceStatus({
    postId: getAttendancePostId(meetingDetail?.region ?? ""),
    userId: user?.id,
  });

  return (
    <main className="mx-auto flex w-full max-w-[375px] flex-col px-4 py-6 md:max-w-[744px] md:px-6 md:py-8 xl:max-w-[1280px] xl:px-0 xl:py-12">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <MeetingDetailContent
          meetingId={resolvedMeetingId}
          initialHasAttended={initialHasAttended}
        />
      </HydrationBoundary>
    </main>
  );
}
