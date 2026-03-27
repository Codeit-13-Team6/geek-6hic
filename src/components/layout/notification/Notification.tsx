"use client";
import { useState, useEffect } from "react";
import { getNotifications } from "@/api/notifications";
import NotificationCard from "@/components/layout/notification/NotificationCard";
import type { NotificationItem } from "@/types/notification";

interface NotificationProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Notification({ isOpen, onClose }: NotificationProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

  if (!isOpen) return null;

  return (
    <div className="w-[314px] overflow-hidden rounded-3xl bg-white shadow-[0_8px_40px_rgba(0,0,0,0.12)]">
      <div className="flex justify-between gap-2 px-6 pt-6">
        <h2 className="font-pretendard text-lg font-semibold text-gray-900">
          알림 내역
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer text-sm font-medium text-gray-400 transition-opacity hover:text-gray-600"
        >
          모두 읽기
        </button>
      </div>

      <div className="mt-6 max-h-[280px] overflow-x-hidden">
        {isLoading ? (
          <div className="flex min-h-[220px] items-center justify-center px-6 text-center text-sm text-gray-400">
            알림을 불러오는 중이에요.
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
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
