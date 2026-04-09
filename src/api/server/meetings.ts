import { serverFetch } from "@/lib/serverFetcher";
import type { JoinedMeetingsResponse, SortOrder, SortBy } from "@/types";

export async function getJoinedMeetingsServer(params: {
  cursor?: string;
  size?: number;
  sortOrder?: SortOrder;
  sortBy?: "dateTime" | "registrationEnd" | "joinedAt";
  completed?: boolean;
}): Promise<JoinedMeetingsResponse> {
  const { data } = await serverFetch<JoinedMeetingsResponse>({
    method: "GET",
    url: "/meetings/joined",
    params,
  });

  return data;
}

export async function getMeetingList(params: {
  type: string;
  keyword: string;
  sortBy: SortBy;
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
