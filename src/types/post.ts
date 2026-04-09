import { SortOrder } from "./meeting";
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

export type LoungeSortBy =
  | "createdAt"
  | "viewCount"
  | "likeCount"
  | "commentCount";

export interface GetPostsParams {
  type?: "all" | "best";
  keyword?: string;
  sortBy?: LoungeSortBy;
  sortOrder?: SortOrder;
  cursor?: string;
  size?: number;
}

export type GetPostsResponse = CursorResponse<Post>;
export type MyPostsPageResponse = OffsetResponse<Post>;

// 이건 BFF가 계산한 추가 정보가 붙은 응답
export interface VisiblePostsPageResponse extends MyPostsPageResponse {
  totalLikeCount: number;
}

export interface PostListProps {
  keyword?: string;
  sortBy?: LoungeSortBy;
  sortOrder?: SortOrder;
}

export interface PostCardProps {
  id: number;
  title: string;
  content: string;
  authorImage?: string | null;
  authorName: string;
  authorId?: number;
  date: string;
  timeAgo: string;
  likeCount: number;
  commentCount: number;
  thumbnailUrl?: string | null;
  onDetailClick?: () => void;
}

export interface PostDetailCardProps {
  title?: string;
  date?: Date;
  name?: string;
  avatar?: string;
  authorId?: number;
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
