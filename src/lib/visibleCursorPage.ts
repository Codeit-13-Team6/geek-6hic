import type { CursorResponse, OffsetResponse } from "@/types";

interface CursorPageParams {
  cursor?: string;
  size: number;
}

interface VisibleCursorPageParams<T> {
  offset: number;
  limit: number;
  scanPageSize?: number;
  fetchPage: (params: CursorPageParams) => Promise<CursorResponse<T>>;
  filter: (item: T) => boolean;
}

const DEFAULT_SCAN_PAGE_SIZE = 100;

export async function getVisibleCursorPage<T>({
  offset,
  limit,
  scanPageSize = DEFAULT_SCAN_PAGE_SIZE,
  fetchPage,
  filter,
}: VisibleCursorPageParams<T>): Promise<OffsetResponse<T>> {
  const visibleItems: T[] = [];
  const seenCursors = new Set<string>();
  let visibleTotalCount = 0;
  let nextCursor: string | undefined;
  let hasMore = true;

  while (hasMore) {
    const response = await fetchPage({
      size: scanPageSize,
      ...(nextCursor ? { cursor: nextCursor } : {}),
    });

    const filteredItems = response.data.filter(filter);
    const pageVisibleStart = visibleTotalCount;
    visibleTotalCount += filteredItems.length;

    if (visibleTotalCount > offset && visibleItems.length < limit) {
      const startIndex = Math.max(0, offset - pageVisibleStart);
      const remaining = limit - visibleItems.length;
      visibleItems.push(...filteredItems.slice(startIndex, startIndex + remaining));
    }

    if (!response.hasMore || !response.nextCursor) {
      hasMore = false;
      break;
    }

    if (seenCursors.has(response.nextCursor)) {
      hasMore = false;
      break;
    }

    seenCursors.add(response.nextCursor);
    nextCursor = response.nextCursor;
  }

  return {
    data: visibleItems,
    totalCount: visibleTotalCount,
    currentOffset: offset,
    limit,
    hasMore: offset + limit < visibleTotalCount,
    nextCursor: null,
  };
}
