import { serverFetch } from "@/lib/server-fetcher";
import type { JoinedMeetingsResponse } from "@/types";

export async function getJoinedMeetingsServer(params: {
  cursor?: string;
  size?: number;
}): Promise<JoinedMeetingsResponse> {
  const { data } = await serverFetch<JoinedMeetingsResponse>({
    method: "GET",
    url: "/meetings/joined",
    params,
  });

  return data;
}
