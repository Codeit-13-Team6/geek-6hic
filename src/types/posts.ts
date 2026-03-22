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

interface Author {
  id: number;
  name: string;
  image: string;
}

interface Comment {
  id: number;
  content: string;
  postId: number;
  authorId: number;
  author: Author;
  createdAt: string;
  updatedAt: string;
}
