import { getPosts } from "@/api/server";
import type { GetPostsParams, GetPostsResponse, Post } from "@/types";

/**
 * isThread 필터링 후에도 정확히 size개를 채울 때까지
 * 백엔드를 연속 호출하는 BFF 전용 fetcher
 */
export async function getLoungePostsPageBFF(
  params: GetPostsParams & { size: number },
): Promise<GetPostsResponse> {
  const { size, cursor: initialCursor, ...rest } = params;
  const collected: Post[] = [];
  let currentCursor = initialCursor;
  let lastHasMore = false;
  let lastNextCursor: string | null = null;

  while (collected.length < size) {
    const response = await getPosts({
      ...rest,
      cursor: currentCursor,
      size,
    });

    collected.push(...response.data);

    lastHasMore = response.hasMore;
    lastNextCursor = response.nextCursor;

    if (!response.hasMore || !response.nextCursor) break;

    currentCursor = response.nextCursor;
  }

  return {
    data: collected,
    hasMore: lastHasMore,
    nextCursor: lastNextCursor,
  };
}
