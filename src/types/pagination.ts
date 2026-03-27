
export interface CursorResponse<T> {
  data: T[];
  hasMore: boolean;
  nextCursor: string;
}
