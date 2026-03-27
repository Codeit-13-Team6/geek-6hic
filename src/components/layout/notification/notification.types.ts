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

export interface NotificationListResponse {
  data: NotificationItem[];
  nextCursor: string | null;
  hasMore: boolean;
}
