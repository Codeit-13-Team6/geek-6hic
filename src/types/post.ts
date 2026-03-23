export interface Post {
  id: number;
  teamId: string;
  title: string;
  content: string;
  image: string | null;
  authorId: number;
  viewCount: number;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: number;
    name: string;
    image: string | null;
  };
  _count: {
    comments: number;
  };
  comments: Comment[];
  isLiked: boolean;
}

export interface GetPostsParams {
  type?: "all" | "best";
  keyword?: string;
  sortBy?: "createdAt" | "viewCount" | "likeCount";
  sortOrder?: "asc" | "desc";
  cursor?: string;
  size?: number;
}

export interface GetPostsResponse {
  data: Post[];
  nextCursor: string | null;
  hasMore: boolean;
}
