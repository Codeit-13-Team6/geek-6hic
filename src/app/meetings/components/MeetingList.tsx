"use client";

import Image from "next/image";
import demoImage from "@/assets/img/mock/banner-lg-demo.jpg";
import { Progress } from "@/components/ui/ProgressCommon";
import type { JoinedMeeting } from "@/types";
import { cn } from "@/lib/utils";

interface MeetingListProps {
  meetingList: JoinedMeeting[];
  isLoading: boolean;
  sortValue?: "deadline" | "participants" | null;
  onItemClick: (item: JoinedMeeting) => void;
  onHeartClick: (item: JoinedMeeting) => void;
}

// 하트 아이콘: 보더를 없애고 더 깔끔하게
const HeartIcon = ({ isFavorited }: { isFavorited: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill={isFavorited ? "#260656" : "rgba(226, 232, 240, 0.6)"}
    stroke={isFavorited ? "#260656" : "#94a3b8"}
    strokeWidth="1.5"
    className="transition-all"
  >
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    className="text-slate-400"
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export default function MeetingList({
  meetingList,
  onItemClick,
  sortValue,
  onHeartClick,
}: MeetingListProps) {
  function getDeadlineLabel(registrationEnd: string) {
    const endDate = new Date(registrationEnd);
    const now = new Date();
    const isToday =
      endDate.getFullYear() === now.getFullYear() &&
      endDate.getMonth() === now.getMonth() &&
      endDate.getDate() === now.getDate();
    if (!isToday) return null;
    const hours = String(endDate.getHours()).padStart(2, "0");
    return `오늘 ${hours}시 마감`;
  }

  function formatDate(dateTime: string) {
    const date = new Date(dateTime);
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  }

  function formatTime(dateTime: string) {
    const date = new Date(dateTime);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  function isMeetingClosed(item: JoinedMeeting) {
    const now = new Date();
    return (
      new Date(item.registrationEnd) < now ||
      item.participantCount >= item.capacity
    );
  }

  const visibleMeetingList =
    sortValue === "deadline"
      ? meetingList.filter((item) => !isMeetingClosed(item))
      : meetingList;

  return (
    <>
      {visibleMeetingList.map((item) => {
        const isClosed = isMeetingClosed(item);
        const deadLine = getDeadlineLabel(item.registrationEnd);
        const overlayLabel = item.isCompleted
          ? "참여 완료"
          : isClosed
            ? "모집 마감"
            : null;

        return (
          <div
            key={item.id}
            onClick={() => onItemClick(item)}
            className="group relative cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-300 hover:border-[#260656]/30 hover:shadow-[0_12px_30px_-10px_rgba(38,6,86,0.12)] sm:flex sm:items-center sm:gap-6 sm:p-5"
          >
            {/* 하트 버튼: 보더 없애고 깔끔하게 연한 배경만 */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onHeartClick(item);
              }}
              className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50/80 backdrop-blur-sm transition-all hover:scale-110 active:scale-90"
            >
              <HeartIcon isFavorited={item.isFavorited} />
            </button>

            {/* 이미지 영역: 모서리 부드럽게 라운드 적용 */}
            <div className="relative h-44 w-full overflow-hidden rounded-xl bg-slate-100 sm:h-[140px] sm:w-[140px] sm:shrink-0">
              <Image
                src={item.image || demoImage}
                fill
                alt="이미지"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                unoptimized
              />
              {overlayLabel && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#260656]/70 backdrop-blur-[2px]">
                  <span className="text-sm font-black tracking-widest text-white">
                    {overlayLabel}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col pt-4 sm:pt-0">
              <div className="flex flex-col gap-1">
                <p className="text-[10px] font-bold tracking-widest text-[#260656]/70 uppercase">
                  {item.type}
                </p>
                <h3 className="text-lg leading-tight font-bold text-slate-900 transition-colors group-hover:text-[#260656]">
                  {item.name}
                </h3>
              </div>

              {/* 태그 영역: 보더 연하게 조정 및 라운드 추가 */}
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-md border border-slate-100 bg-slate-50 px-2 py-1 text-[11px] font-bold text-slate-500">
                  {formatDate(item.dateTime)}
                </span>
                <span className="rounded-md border border-slate-100 bg-slate-50 px-2 py-1 text-[11px] font-bold text-slate-500">
                  {formatTime(item.dateTime)}
                </span>
                {deadLine && (
                  <span className="rounded-md bg-[#260656]/10 px-2 py-1 text-[11px] font-extrabold text-[#260656]">
                    {deadLine}
                  </span>
                )}
              </div>

              {/* 하단 정보 레이아웃 */}
              <div className="mt-6 flex w-full items-center gap-3">
                <UserIcon />
                <div className="flex-1">
                  <Progress
                    className="w-full"
                    value={(item.participantCount / item.capacity) * 100}
                  />
                </div>
                <div className="flex shrink-0 items-baseline gap-1">
                  <span className="text-sm font-black text-[#260656]">
                    {item.participantCount}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    / {item.capacity}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
