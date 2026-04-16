import type { CursorResponse, GetPostsResponse, OffsetResponse, Post, VisiblePostsPageResponse } from "@/types";
import { filterThreadPosts } from "./threadFilter";

// ─── 기본 페이지네이션 헬퍼 ───────────────────────────────────────────

export const getNextPageParam = <
  T extends { hasMore: boolean; nextCursor: string | null },
>(
  lastPage: T,
) => (lastPage.hasMore ? (lastPage.nextCursor ?? undefined) : undefined);

export function safeOffset(raw?: number): number {
  return Number.isFinite(raw) && (raw ?? 0) >= 0 ? (raw ?? 0) : 0;
}

export function safeLimit(raw?: number, defaultVal = 10): number {
  return Number.isFinite(raw) && (raw ?? 0) > 0
    ? (raw ?? defaultVal)
    : defaultVal;
}

// ─── 커서 이터레이터 ──────────────────────────────────────────────────

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

// ─── 커서 전체 수집 ───────────────────────────────────────────────────

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

// ─── 커서 → offset 변환 페이지 ───────────────────────────────────────

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

// ─── offset 기반 게시글 페이지 ────────────────────────────────────────

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

export async function getVisiblePostsPage(
  params: FetchMyPostsPageParams,
  fetchPage: FetchMyPostsPage,
  options: { filter?: (post: Post) => boolean } = {},
): Promise<VisiblePostsPageResponse> {
  const targetOffset = params.offset;
  const targetLimit = params.limit;
  const visiblePosts: Post[] = [];
  let visibleTotalCount = 0;
  let visibleTotalLikeCount = 0;
  let sourceOffset = 0;
  let hasMoreSource = true;
  let expectedSourceTotal = Number.POSITIVE_INFINITY;

  while (hasMoreSource && sourceOffset < expectedSourceTotal) {
    const response = await fetchPage({ offset: sourceOffset, limit: SCAN_PAGE_SIZE });

    const filtered = filterThreadPosts(response);
    const scopedPosts = options.filter
      ? filtered.data.filter(options.filter)
      : filtered.data;

    visibleTotalCount += scopedPosts.length;
    visibleTotalLikeCount += scopedPosts.reduce(
      (sum, post) => sum + post.likeCount,
      0,
    );

    if (visibleTotalCount > targetOffset && visiblePosts.length < targetLimit) {
      const startIndex = Math.max(
        0,
        targetOffset - (visibleTotalCount - scopedPosts.length),
      );
      const remaining = targetLimit - visiblePosts.length;
      visiblePosts.push(...scopedPosts.slice(startIndex, startIndex + remaining));
    }

    const sourcePageSize = response.limit ?? response.data.length ?? SCAN_PAGE_SIZE;
    sourceOffset += sourcePageSize;
    expectedSourceTotal = response.totalCount ?? expectedSourceTotal;
    hasMoreSource = response.hasMore;

    if (!response.hasMore) break;
  }

  return {
    data: visiblePosts,
    totalCount: visibleTotalCount,
    totalLikeCount: visibleTotalLikeCount,
    currentOffset: targetOffset,
    limit: targetLimit,
    hasMore: targetOffset + targetLimit < visibleTotalCount,
    nextCursor: null,
  };
}

export async function getVisibleMyPostsPage(
  params: FetchMyPostsPageParams,
  fetchPage: FetchMyPostsPage,
): Promise<VisiblePostsPageResponse> {
  return getVisiblePostsPage(params, fetchPage);
}
