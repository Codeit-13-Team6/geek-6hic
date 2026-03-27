import axiosInstance from "@/lib/client-fetcher";
import type {
  NotificationItem,
  NotificationListResponse,
} from "@/types/notification";

export async function getNotifications(): Promise<NotificationItem[]> {
  const { data } =
    await axiosInstance.get<NotificationListResponse>("/notifications");

  return data.data;
}

export async function deleteAllNotification(): Promise<void> {
  await axiosInstance.delete(`/notifications`);
}

export async function markAllNotificationsAsRead(): Promise<void> {
  await axiosInstance.put("/notifications/read-all");
}

export async function markNotificationAsRead(
  notificationId: number,
): Promise<void> {
  await axiosInstance.put(`/notifications/${notificationId}/read`);
}
