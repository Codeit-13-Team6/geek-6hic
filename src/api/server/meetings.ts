import {
  redirectToAuthSyncIfNeeded,
  serverFetch,
} from "@/lib/auth/serverFetcher";
import type { JoinedMeetingsResponse, MeetingSortBy, SortOrder } from "@/types";

export async function getJoinedMeetingsServer(params: {
  cursor?: string;
  size?: number;
  sortOrder?: SortOrder;
  sortBy?: '"dateTime" | "registrationEnd" | "joinedAt"';
  completed?: boolean;
}): Promise<JoinedMeetingsResponse> {
  try {
    const { data } = await serverFetch<JoinedMeetingsResponse>({
      method: "GET",
      url: "/meetings/joined",
      params: { ...params, sortBy: "joinedAt" },
    });

    return data;
  } catch (error) {
    redirectToAuthSyncIfNeeded(error);
    throw error;
  }
}

export async function getMeetingList(params: {
  type: string;
  keyword: string;
  sortBy: MeetingSortBy;
  sortOrder: SortOrder;
  size: number;
}): Promise<JoinedMeetingsResponse> {
  try {
    const { data } = await serverFetch<JoinedMeetingsResponse>({
      method: "GET",
      url: "/meetings",
      params,
    });

    return data;
  } catch (error) {
    redirectToAuthSyncIfNeeded(error);
    throw error;
  }
}
