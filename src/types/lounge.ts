import { ReactNode } from "react";
import { QueryClient } from "@tanstack/react-query";

export interface HotPostCardCommonProps {
  title?: string;
  date?: string | Date;
  imageSrc?: string | null;
  thumbsUp?: number;
  comment?: number;
  onDetailClick?: () => void;
}

export interface PostPayload {
  title: string;
  content: string; // (본문 + 링크) HTML 콘텐츠
  image?: string;
}

export interface LoungePostFormProps {
  id?: number;
  initialData?: {
    title: string;
    content: string; // 링크 없는 본문 콘텐츠
    links: LinkItem[];
    image?: string; // 기존 썸네일
  };
  onSubmit: (payload: PostPayload) => void;
  isSubmitting: boolean;
  submitButtonText?: string;
}

export interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export type EmptyStateVariant =
  | "meeting"
  | "lank"
  | "lounge"
  | "myMeeting"
  | "myCreatMeeting";

export interface EmptyStateProps {
  variant?: EmptyStateVariant;
}

export interface CommentProps {
  id: number;
  name?: string;
  img?: string;
  date?: Date;
  content?: string;
  isOwner: boolean;
  onDelete: (id: number) => void;
  onEdit: (id: number, newContent: string) => void;
}

export interface CommentSectionProps {
  postId: number;
  isThread?: boolean;
}

export interface LinkCardProps {
  link: LinkItem;
  index: number;
  isThumbnail: boolean;
  isDragging: boolean;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
  onSelect: (imageUrl: string) => void;
  onRemove: (id: string) => void;
}

export interface PrefetchBoundaryProps {
  children: ReactNode;
  prefetchFn: (qc: QueryClient) => Promise<void>;
}

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  image?: string;
}
