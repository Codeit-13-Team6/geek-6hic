import { cn } from "@/lib/utils";
import { threadKeyword } from "@/lib/threadKeyword";
import { NotificationItem, NotificationCardProps } from "@/types";
import FallbackImage from "@/components/img/FallbackImage";

const NOTIFICATION_TITLE: Record<string, string> = {
  MEETING_CONFIRMED: "모임 확정",
  MEETING_CANCELED: "모임 취소",
  COMMENT: "새로운 댓글",
  MEETING_DELETED: "모임 삭제",
};

function getNotificationTitle(notification: NotificationItem) {
  if (isThreadComment(notification)) {
    return "새로운 스레드";
  }

  if (notification.type === "COMMENT") {
    return "새로운 댓글";
  }

  return (
    NOTIFICATION_TITLE[notification.type] ??
    notification.data.meetingName ??
    notification.data.postTitle ??
    "알림"
  );
}
function isThreadComment(notification: NotificationItem) {
  return (
    notification.type === "COMMENT" &&
    threadKeyword.is(notification.data.postTitle)
  );
}

function getNotificationMessage(notification: NotificationItem) {
  if (isThreadComment(notification)) {
    const meetingName = notification.data.meetingName;
    if (meetingName) {
      return `"${meetingName}" 모임에 새 댓글이 달렸습니다.`;
    }
    return `모임에 새 댓글이 달렸습니다.`;
  }

  if (notification.type === "COMMENT") {
    const postTitle = notification.data.postTitle;
    if (postTitle) {
      return `"${postTitle}" 게시글에 새 댓글이 달렸습니다.`;
    }
    return "게시글에 새 댓글이 달렸습니다.";
  }

  return notification.message;
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
  const message = getNotificationMessage(notification);

  return (
    <button
      role="button"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.(notification);
        }
      }}
      className={cn(
        "flex w-full gap-4 px-5 py-4 transition-colors",
        notification.isRead ? "bg-white" : "bg-slate-50",
        "focus-visible:ring-black hover:bg-slate-50 focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset",
        className,
      )}
      onClick={() => onClick?.(notification)}
    >
      <div className="shrink-0">
        <FallbackImage
          src={notification.data.image}
          alt="모임 이미지"
          width={40}
          height={40}
          className="size-10 rounded-xl object-cover shadow-sm"
          unoptimized
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3
            className={cn(
              "truncate text-sm tracking-tight",
              notification.isRead
                ? "font-semibold text-slate-500"
                : "font-bold text-slate-900",
            )}
          >
            {title}
          </h3>

          <span className="flex shrink-0 items-center gap-1.5 text-[11px] font-medium text-slate-300">
            {!notification.isRead && (
              <span
                aria-label="읽지 않은 알림"
                className="size-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(52,211,153,0.5)]"
              />
            )}
            {relativeTime}
          </span>
        </div>

        <p
          className={cn(
            "mt-1 text-left text-[13px] leading-snug break-words",
            notification.isRead ? "text-slate-400" : "text-slate-600",
          )}
        >
          {message}
        </p>
      </div>
    </button>
  );
}
