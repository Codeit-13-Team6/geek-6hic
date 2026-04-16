import type { AxiosResponse } from "axios";
import {
  redirectToAuthSyncIfNeeded,
  serverFetch,
} from "@/lib/auth/serverFetcher";
import type { User } from "@/types";
import {
  MeetingAttendanceCommentsResponse,
  MeetingDetailApiData,
  MeetingParticipantsResponse,
} from "@/types";

const PARTICIPANTS_PAGE_SIZE = 100;
const ATTENDANCE_COMMENT_PREFIX = "onlyScore_";

export async function getMeetingDetail(meetingId: number) {
  try {
    const response = await serverFetch<MeetingDetailApiData>({
      url: `/meetings/${meetingId}`,
      method: "GET",
    });

    return response.data;
  } catch (error) {
    redirectToAuthSyncIfNeeded(error);
    throw error;
  }
}

export async function getMeetingParticipants(meetingId: number) {
  try {
    const response = await serverFetch<MeetingParticipantsResponse>({
      url: `/meetings/${meetingId}/participants`,
      method: "GET",
      params: {
        size: PARTICIPANTS_PAGE_SIZE,
      },
    });

    return response.data;
  } catch (error) {
    redirectToAuthSyncIfNeeded(error);
    throw error;
  }
}


export async function getCurrentUserOnServer() {
  try {
    const response = await serverFetch<User>({
      method: "GET",
      url: "/users/me",
    });
    return response.data;
  } catch (error) {
    redirectToAuthSyncIfNeeded(error);
    return null;
  }
}

export async function getTodayAttendanceStatus({
  postId,
  userId,
}: {
  postId: number | null;
  userId?: number;
}) {
  if (!postId || !userId) {
    return false;
  }

  const getStartOfToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return today;
  };

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
  } catch (error) {
    redirectToAuthSyncIfNeeded(error);
    return false;
  }
}
