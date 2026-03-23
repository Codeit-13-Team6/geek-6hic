export interface Posts {
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
