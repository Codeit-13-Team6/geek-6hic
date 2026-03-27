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
