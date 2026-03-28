import Image from "next/image";
import { cn } from "@/lib/utils";
import profileSm from "@/assets/img/profile/female1-sm.jpg";

import { NotificationItem, NotificationCardProps } from "@/types";

const NOTIFICATION_TITLE: Record<string, string> = {
  MEETING_CONFIRMED: "모임 확정",
  MEETING_CANCELED: "모임 취소",
  COMMENT: "새로운 댓글",
};

function getNotificationTitle(notification: NotificationItem) {
  return (
    NOTIFICATION_TITLE[notification.type] ??
    notification.data.meetingName ??
    notification.data.postTitle ??
    "알림"
  );
}

function formatRelativeTime(createdAt: string) {
  const createdTime = new Date(createdAt).getTime();

  if (Number.isNaN(createdTime)) {
    return "";
  }

  const diffMs = Date.now() - createdTime;
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) return "방금 전";
  if (diffMinutes < 60) return `${diffMinutes}분 전`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}시간 전`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}일 전`;

  return new Intl.DateTimeFormat("ko-KR", {
    month: "numeric",
    day: "numeric",
  }).format(new Date(createdAt));
}

export default function NotificationCard({
  notification,
  onClick,
  className,
}: NotificationCardProps) {
  const title = getNotificationTitle(notification);
  const relativeTime = formatRelativeTime(notification.createdAt);

  return (
    <article
      className={cn(
        "flex w-full gap-4 px-4 py-3 transition-colors",
        notification.isRead ? "bg-white" : "bg-gray-50",
        "cursor-pointer",
        className,
      )}
      onClick={() => onClick?.(notification)}
    >
      <div className="shrink-0">
        {notification.data.image ? (
          <Image
            src={notification.data.image}
            alt={title}
            width={40}
            height={40}
            className="size-10 rounded-lg object-cover"
            unoptimized
          />
        ) : (
          <Image
            src={profileSm}
            alt="프로필"
            width={40}
            height={40}
            className="size-10 rounded-full object-cover"
            unoptimized
          />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <h3 className="truncate text-base font-semibold text-gray-900">
              {title}
            </h3>
          </div>

          <span className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-gray-300">
            {!notification.isRead && (
              <span
                aria-label="읽지 않은 알림"
                className="size-1.5 rounded-full bg-emerald-400"
              />
            )}
            {relativeTime}
          </span>
        </div>

        <p className="mt-2 text-sm break-words text-gray-500">
          {notification.message}
        </p>
      </div>
    </article>
  );
}
