import { serverFetch } from "@/infra/auth/fetcher.server";
import type { JoinedMeetingsResponse, MeetingSortBy, SortOrder } from "@/shared/types";

export async function getJoinedMeetingsServer(params: {
  cursor?: string;
  size?: number;
  sortOrder?: SortOrder;
  sortBy?: '"dateTime" | "registrationEnd" | "joinedAt"';
  completed?: boolean;
}): Promise<JoinedMeetingsResponse> {
  const { data } = await serverFetch<JoinedMeetingsResponse>({
    method: "GET",
    url: "/meetings/joined",
    params: { ...params, sortBy: "joinedAt" },
  });

  return data;
}

export async function getMeetingList(params: {
  type: string;
  keyword: string;
  sortBy: MeetingSortBy;
  sortOrder: SortOrder;
  size: number;
}): Promise<JoinedMeetingsResponse> {
  const { data } = await serverFetch<JoinedMeetingsResponse>({
    method: "GET",
    url: "/meetings",
    params,
  });

  return data;
}
