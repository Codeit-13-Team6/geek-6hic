import { iterateCursor } from "./cursorIterator";
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
  let visibleTotalCount = 0;

  await iterateCursor({
    fetchPage: (cursor) => fetchPage({ cursor, size: scanPageSize }),
    onPage: (pageItems) => {
      const filtered = pageItems.filter(filter);
      const pageStart = visibleTotalCount;
      visibleTotalCount += filtered.length;

      if (visibleTotalCount > offset && visibleItems.length < limit) {
        const startIndex = Math.max(0, offset - pageStart);
        const remaining = limit - visibleItems.length;
        visibleItems.push(...filtered.slice(startIndex, startIndex + remaining));
      }
      return "continue";
    },
  });

  return {
    data: visibleItems,
    totalCount: visibleTotalCount,
    currentOffset: offset,
    limit,
    hasMore: offset + limit < visibleTotalCount,
    nextCursor: null,
  };
}
