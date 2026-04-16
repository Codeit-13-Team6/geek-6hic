import {
  redirectToAuthSyncIfNeeded,
  serverFetch,
} from "@/lib/auth/serverFetcher";
import type { GetMeetingsResponse } from "@/types";

export async function getMeetingsCursorPageForStats(
  cursor?: string,
  size = 100,
): Promise<GetMeetingsResponse> {
  try {
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
  } catch (error) {
    redirectToAuthSyncIfNeeded(error);
    throw error;
  }
}
