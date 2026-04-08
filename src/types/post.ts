import type { CursorResponse, OffsetResponse } from "./pagination";

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
  sortBy?: "createdAt" | "viewCount" | "likeCount" | "commentCount";
  sortOrder?: "asc" | "desc";
  cursor?: string;
  size?: number;
}

export type GetPostsResponse = CursorResponse<Post>;
export type MyPostsPageResponse = OffsetResponse<Post>;

export interface PostListProps {
  searchValue?: string;
  sortValue?: string;
}

export interface PostCardProps {
  id: number;
  title: string;
  content: string;
  authorImage: string | null;
  authorName: string;
  authorId?: number;
  date: string;
  timeAgo: string;
  likeCount: number;
  commentCount: number;
  thumbnailUrl?: string | null;
  onDetailClick?: () => void;
  onAuthorClick?: () => void;
}

export interface PostDetailCardProps {
  title?: string;
  date?: Date;
  name?: string;
  authorId?: number;
  authorImg?: string;
  linkObjects?: {
    id: string;
    title: string;
    url: string;
  }[];
  content?: string;
  thumbsUp?: number;
  comment?: number;
  isLiked?: boolean;
  isOwner?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onLike?: () => void;
  onAuthorClick?: () => void;
}
