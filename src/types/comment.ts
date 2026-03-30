import type { CursorResponse } from "./pagination";

export interface Author {
  id: number;
  name: string;
  image: string;
}

export interface Comment {
  id: number;
  teamId: string;
  postId: number;
  authorId: number;
  author: Author;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export type GetCommentsResponse = CursorResponse<Comment>;
