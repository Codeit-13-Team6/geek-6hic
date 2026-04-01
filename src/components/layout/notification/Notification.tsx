"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  deleteAllNotification,
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/api/client/notifications";
import NotificationCard from "@/components/layout/notification/NotificationCard";
import type { NotificationItem } from "@/types";
import { NotificationProps } from "@/types";
import { Trash2, CheckCheck } from "lucide-react";

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
    <div className="absolute top-10 right-[-70px] z-[100] flex w-[320px] flex-col overflow-hidden rounded-[24px] border border-slate-100 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] sm:w-[360px]">
      <div className="flex items-center justify-between border-b border-slate-50 px-6 py-5">
        <h2 className="text-base font-bold text-slate-900">알림 내역</h2>
        <button
          type="button"
          onClick={isAllRead ? handleDeleteAll : handleMarkAllAsRead}
          className="flex items-center gap-1 text-[11px] font-bold tracking-wider text-slate-400 uppercase hover:text-slate-600"
        >
          {isAllRead ? <Trash2 size={12} /> : <CheckCheck size={12} />}
          {isAllRead ? "전체 삭제" : "모두 읽기"}
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain sm:max-h-[420px]">
        {isLoading ? (
          <div className="flex min-h-[220px] items-center justify-center px-6 text-center text-sm font-medium text-slate-300">
            알림을 불러오는 중...
          </div>
        ) : notifications.length > 0 ? (
          <div className="flex flex-col divide-y divide-slate-50">
            {notifications.map((notification) =>
              notification?.message?.split("_")[0] !== '"isThread' ? (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onClick={() => handleNotificationClick(notification)}
                />
              ) : (
                <></>
              ),
            )}
          </div>
        ) : (
          <div className="flex min-h-[220px] items-center justify-center px-6 text-center text-sm font-medium text-slate-300">
            아직 도착한 알림이 없어요.
          </div>
        )}
      </div>
    </div>
  );
}
