import type { CursorResponse } from "./pagination";

export type NotificationType =
  | "MEETING_CONFIRMED"
  | "MEETING_CANCELED"
  | "MEETING_DELETED"
  | "COMMENT";

export interface NotificationPayloadData {
  meetingId?: number;
  meetingName?: string;
  postId?: number;
  postTitle?: string;
  commentId?: number;
  commentContent?: string;
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

export interface ThreadMeetingDisplayInfo {
  meetingName?: string;
  image?: string;
}
