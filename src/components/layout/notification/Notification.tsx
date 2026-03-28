"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  deleteAllNotification,
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/api/notifications";
import NotificationCard from "@/components/layout/notification/NotificationCard";
import type { NotificationItem } from "@/types/notification";
import { NotificationProps } from "@/types";

export default function Notification({
  isOpen,
  onClose,
  onUnreadChange,
}: NotificationProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // 모든 알림이 읽음 처리됐는지 여부
  const isAllRead =
    notifications.length > 0 && notifications.every((item) => item.isRead);

  // 카드 누르면 해당 모임이나 게시글로 이동 및 개별 카드 읽음 처리
  const router = useRouter();
  const handleNotificationClick = async (notification: NotificationItem) => {
    if (!notification.isRead) {
      try {
        await markNotificationAsRead(notification.id);
        setNotifications((prev) =>
          prev.map((item) =>
            item.id === notification.id ? { ...item, isRead: true } : item,
          ),
        );
      } catch (error) {
        console.error("알림 읽음 처리 실패:", error);
      }
    }

    if (notification.type === "COMMENT") {
      router.push(`/lounge/${notification.data.postId}`);
    } else {
      router.push(`/meetings/${notification.data.meetingId}`);
    }
    onClose();
  };

  // 모두 읽기 버튼
  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) =>
        prev.map((item) => ({ ...item, isRead: true })),
      );
    } catch (error) {
      console.error("모든 알림 읽음 처리 실패:", error);
    }
  };
  // 전체 삭제 버튼(모두 읽음 처리된 경우에만 보이도록)
  const handleDeleteAll = async () => {
    try {
      await deleteAllNotification();
      setNotifications([]);
    } catch (error) {
      console.error("모든 알림 삭제 실패:", error);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const data = await getNotifications();
        setNotifications(data);
      } catch (error) {
        console.error("알림 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotifications();
  }, [isOpen]);

  useEffect(() => {
    onUnreadChange(notifications.some((item) => !item.isRead));
  }, [notifications, onUnreadChange]);

  if (!isOpen) return null;

  return (
    <div className="flex h-[100dvh] w-[314px] flex-col overflow-hidden rounded-l-3xl bg-white shadow-none sm:h-auto sm:rounded-3xl sm:shadow-[0_8px_40px_rgba(0,0,0,0.12)]">
      <div className="flex justify-between gap-2 px-6 pt-6">
        <h2 className="font-pretendard text-lg font-semibold text-gray-900">
          알림 내역
        </h2>
        <button
          type="button"
          onClick={isAllRead ? handleDeleteAll : handleMarkAllAsRead}
          className="cursor-pointer text-sm font-medium text-gray-400 transition-opacity hover:text-gray-600"
        >
          {isAllRead ? "전체 삭제" : "모두 읽기"}
        </button>
      </div>

      <div className="mt-6 min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain sm:max-h-[280px] sm:flex-none">
        {isLoading ? (
          <div className="flex min-h-[220px] items-center justify-center px-6 text-center text-sm text-gray-400">
            알림을 불러오는 중이에요...
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onClick={() => handleNotificationClick(notification)}
            />
          ))
        ) : (
          <div className="flex min-h-[220px] items-center justify-center px-6 text-center text-sm text-gray-400">
            아직 알림이 없어요.
          </div>
        )}
      </div>
    </div>
  );
}
