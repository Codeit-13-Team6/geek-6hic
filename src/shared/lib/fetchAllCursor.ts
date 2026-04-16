import { iterateCursor } from "./cursorIterator";
import type { CursorResponse } from "@/shared/types";

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

  await iterateCursor({
    fetchPage,
    onPage: (pageItems) => {
      for (const item of pageItems) {
        if (earlyExit?.(item)) return "stop";
        if (!filter || filter(item)) items.push(item);
        if (maxItems !== undefined && items.length >= maxItems) return "stop";
      }
      return "continue";
    },
  });

  return items;
}
