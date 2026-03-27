import axiosInstance from "@/lib/client-fetcher";
import type {
  NotificationItem,
  NotificationListResponse,
} from "@/types/notification";

//전체 알람 조회
export async function getNotifications(): Promise<NotificationItem[]> {
  const { data } =
    await axiosInstance.get<NotificationListResponse>("/notifications");

  return data.data;
}
//알람 모두 삭제
export async function deleteAllNotification(): Promise<void> {
  await axiosInstance.delete(`/notifications`);
}
//모두 읽음
export async function markAllNotificationsAsRead(): Promise<void> {
  await axiosInstance.put("/notifications/read-all");
}
//개별 읽음
export async function markNotificationAsRead(
  notificationId: number,
): Promise<void> {
  await axiosInstance.put(`/notifications/${notificationId}/read`);
}
