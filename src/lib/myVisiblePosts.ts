import type { GetPostsResponse, MyPostsPageResponse, Post } from "@/types";
import { filterThreadPosts } from "@/lib/postUtils";

interface FetchMyPostsPageParams {
  offset: number;
  limit: number;
}

interface RawMyPostsResponse extends GetPostsResponse {
  totalCount?: number;
  currentOffset?: number;
  limit?: number;
}

type FetchMyPostsPage = (
  params: FetchMyPostsPageParams,
) => Promise<RawMyPostsResponse>;

const SCAN_PAGE_SIZE = 100;

export async function getVisibleMyPostsPage(
  params: FetchMyPostsPageParams,
  fetchPage: FetchMyPostsPage,
): Promise<MyPostsPageResponse> {
  const targetOffset = params.offset;
  const targetLimit = params.limit;
  const visiblePosts: Post[] = [];
  let visibleTotalCount = 0;
  let sourceOffset = 0;
  let hasMoreSource = true;
  let expectedSourceTotal = Number.POSITIVE_INFINITY;

  while (hasMoreSource && sourceOffset < expectedSourceTotal) {
    const response = await fetchPage({
      offset: sourceOffset,
      limit: SCAN_PAGE_SIZE,
    });

    const filtered = filterThreadPosts(response);
    visibleTotalCount += filtered.data.length;

    if (visibleTotalCount > targetOffset && visiblePosts.length < targetLimit) {
      const startIndex = Math.max(
        0,
        targetOffset - (visibleTotalCount - filtered.data.length),
      );
      const remaining = targetLimit - visiblePosts.length;

      visiblePosts.push(
        ...filtered.data.slice(startIndex, startIndex + remaining),
      );
    }

    const sourcePageSize =
      response.limit ?? response.data.length ?? SCAN_PAGE_SIZE;
    sourceOffset += sourcePageSize;
    expectedSourceTotal = response.totalCount ?? expectedSourceTotal;
    hasMoreSource = response.hasMore;

    if (!response.hasMore) {
      break;
    }
  }

  const currentPageEnd = targetOffset + targetLimit;

  return {
    data: visiblePosts,
    totalCount: visibleTotalCount,
    currentOffset: targetOffset,
    limit: targetLimit,
    hasMore: currentPageEnd < visibleTotalCount,
    nextCursor: null,
  };
}
