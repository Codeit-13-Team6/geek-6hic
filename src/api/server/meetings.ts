import { serverFetch } from "@/lib/serverFetcher";
import type { JoinedMeetingsResponse } from "@/types";

export async function getJoinedMeetingsServer(params: {
  cursor?: string;
  size?: number;
  sortOrder?: "asc" | "desc";
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
  sortBy: "dateTime" | "registrationEnd" | "participantCount" | "createdAt";
  sortOrder: "asc" | "desc";
  size: number;
}): Promise<JoinedMeetingsResponse> {
  const { data } = await serverFetch<JoinedMeetingsResponse>({
    method: "GET",
    url: "/meetings",
    params,
  });

  return data;
}
