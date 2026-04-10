import type { CursorResponse } from "@/types";

interface FetchAllCursorOptions<T> {
  fetchPage: (cursor?: string) => Promise<CursorResponse<T>>;
  maxItems?: number;
  earlyExit?: (item: T) => boolean;
  filter?: (item: T) => boolean;
}

export async function fetchAllCursor<T>({
  fetchPage,
  maxItems,
  earlyExit,
  filter,
}: FetchAllCursorOptions<T>): Promise<T[]> {
  const items: T[] = [];
  let cursor: string | undefined;

  while (true) {
    if (maxItems !== undefined && items.length >= maxItems) break;

    const response = await fetchPage(cursor);
    let stopped = false;

    for (const item of response.data) {
      if (earlyExit?.(item)) {
        stopped = true;
        break;
      }

      if (!filter || filter(item)) {
        items.push(item);
      }

      if (maxItems !== undefined && items.length >= maxItems) {
        stopped = true;
        break;
      }
    }

    if (stopped || !response.hasMore || !response.nextCursor) break;

    cursor = response.nextCursor;
  }

  return items;
}
