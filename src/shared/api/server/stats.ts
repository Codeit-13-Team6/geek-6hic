import { serverFetch } from "@/infra/auth/fetcher.server";
import type { GetMeetingsResponse } from "@/shared/types";

export async function getMeetingsCursorPageForStats(
  cursor?: string,
  size = 100,
): Promise<GetMeetingsResponse> {
  const { data } = await serverFetch<GetMeetingsResponse>({
    method: "GET",
    url: "/meetings",
    params: {
      sortBy: "dateTime",
      sortOrder: "desc",
      size,
      ...(cursor ? { cursor } : {}),
    },
  });

  return data;
}
