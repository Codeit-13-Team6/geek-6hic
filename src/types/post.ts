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

export interface GetPostsResponse {
  data: Post[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface PostListProps {
  searchValue?: string;
  sortValue?: string;
}

export interface PostCardProps {
  id: number;
  title: string;
  content: string;
  authorName: string;
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
  img?: string;
  linkObjects?: {
    id: string;
    title: string;
    url: string;
  }[];
  content?: string;
  avatar?: string;
  thumbsUp?: number;
  comment?: number;
  liked?: boolean;
  isOwner?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onLike?: () => void;
}

export interface UserCardProps {
  title?: string;
  type?: string;
  date?: Date;
  imageSrc?: string;
  participantCount?: number;
  capacity?: number;
  defaultLiked?: boolean;
  showLikeBtn?: boolean;
  onHeartClick?: (liked: boolean) => void;
  onDetailClick?: () => void;
}
