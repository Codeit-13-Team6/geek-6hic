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

export interface GetCommentsResponse {
  data: Comment[];
  nextCursor: string | null;
  hasMore: boolean;
}
