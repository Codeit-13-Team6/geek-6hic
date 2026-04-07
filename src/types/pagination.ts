
export interface CursorResponse<T> {
  data: T[];
  hasMore: boolean;
  nextCursor: string | null;
  totalCount?: number;
  currentOffset?: number;
  limit?: number;
}
