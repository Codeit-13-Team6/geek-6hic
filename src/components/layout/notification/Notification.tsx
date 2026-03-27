"use client";

import NotificationCard from "@/components/layout/notification/NotificationCard";
import type { NotificationItem } from "@/types/notification";

type NotificationProps = {
  isOpen: boolean;
  onClose: () => void;
};

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    teamId: "geek-6hic",
    userId: 1,
    type: "MEETING_CONFIRMED",
    message: "‘힐링 오피스 스트레칭’ 모임 개설이 확정되었어요!",
    data: {
      meetingId: 101,
      meetingName: "힐링 오피스 스트레칭",
      image:
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=200&q=80",
    },
    isRead: false,
    createdAt: "2026-03-27T00:48:53.506Z",
  },
  {
    id: 2,
    teamId: "geek-6hic",
    userId: 1,
    type: "MEETING_CANCELED",
    message: "‘힐링 오피스 스트레칭’ 모임이 취소되었어요.",
    data: {
      meetingId: 102,
      meetingName: "힐링 오피스 스트레칭",
      image:
        "https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=200&q=80",
    },
    isRead: false,
    createdAt: "2026-03-26T23:10:00.000Z",
  },
  {
    id: 3,
    teamId: "geek-6hic",
    userId: 1,
    type: "COMMENT",
    message: "딸기님이 댓글을 작성했어요. “정말 재밌어요 :)”",
    data: {
      postId: 31,
      postTitle: "정말 재밌었어요",
      commentId: 7,
    },
    isRead: true,
    createdAt: "2026-03-23T14:00:00.000Z",
  },
];

export default function Notification({ isOpen, onClose }: NotificationProps) {
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

      <div className="mt-6 max-h-[280px] overflow-x-hidden pb-4">
        {MOCK_NOTIFICATIONS.length > 0 ? (
          MOCK_NOTIFICATIONS.map((notification) => (
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
