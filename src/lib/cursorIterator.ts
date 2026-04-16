import type { CursorResponse } from "@/types";

export interface CursorIteratorOptions<T> {
  fetchPage: (cursor?: string) => Promise<CursorResponse<T>>;
  onPage: (items: T[]) => "continue" | "stop";
}

export async function iterateCursor<T>({
  fetchPage,
  onPage,
}: CursorIteratorOptions<T>): Promise<void> {
  let cursor: string | undefined;
  const seenCursors = new Set<string>();

  while (true) {
    const response = await fetchPage(cursor);
    const signal = onPage(response.data);

    if (signal === "stop" || !response.hasMore || !response.nextCursor) break;
    if (seenCursors.has(response.nextCursor)) break;

    seenCursors.add(response.nextCursor);
    cursor = response.nextCursor;
  }
}
