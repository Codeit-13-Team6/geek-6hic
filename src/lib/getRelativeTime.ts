import {
  differenceInDays,
  differenceInSeconds,
  formatDistanceToNowStrict,
} from "date-fns";
import { ko } from "date-fns/locale";

export const getRelativeTime = (date: string | Date): string => {
  const targetDate = typeof date === "string" ? new Date(date) : date;

  if (differenceInSeconds(new Date(), targetDate) < 60) return "방금 전";

  if (differenceInDays(new Date(), targetDate) >= 7) {
    return targetDate.toLocaleDateString("ko-KR");
  }

  return formatDistanceToNowStrict(targetDate, {
    addSuffix: true,
    locale: ko,
  });
};
