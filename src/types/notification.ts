import type { CursorResponse } from "./pagination";

export type NotificationType =
  | "MEETING_CONFIRMED"
  | "MEETING_CANCELED"
  | "COMMENT";

export interface NotificationPayloadData {
  meetingId?: number;
  meetingName?: string;
  postId?: number;
  postTitle?: string;
  commentId?: number;
  image?: string;
}

export interface NotificationItem {
  id: number;
  teamId: string;
  userId: number;
  type: NotificationType;
  message: string;
  data: NotificationPayloadData;
  isRead: boolean;
  createdAt: string;
}

export type NotificationListResponse = CursorResponse<NotificationItem>;

export interface NotificationProps {
  isOpen: boolean;
  onClose: () => void;
  onUnreadChange: (hasUnread: boolean) => void;
}

export interface NotificationCardProps {
  notification: NotificationItem;
  onClick?: (notification: NotificationItem) => void;
  className?: string;
}
