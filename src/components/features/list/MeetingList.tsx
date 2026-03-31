"use client";

import Image from "next/image";
import defaultImage from "@/assets/img/fallback/mainFallback.png";
import alram from "@/assets/icon/alarm/alarm-blue.svg";
import { Heart } from "lucide-react";
import person from "@/assets/icon/person/person.svg";
import { Progress } from "@/components/ui/ProgressCommon";
import { JoinedMeeting, MeetingListProps } from "@/types";
import { cn } from "@/lib/utils";
import LoginModal from "@/components/modal/LoginModal";

export default function MeetingList({
  meetingList,
  onItemClick,
  sortValue,
  onHeartClick,
  meetingStatusBadgeVisible = true,
}: MeetingListProps) {
  function getDeadlineLabel(registrationEnd: string) {
    const endDate = new Date(registrationEnd);
    const now = new Date();
    const isToday = endDate.toDateString() === now.toDateString();

    if (!isToday) return null;
    return `오늘 ${String(endDate.getHours()).padStart(2, "0")}시 마감`;
  }

  function formatDate(dateTime: string) {
    const date = new Date(dateTime);
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  }

  function formatTime(dateTime: string) {
    const date = new Date(dateTime);
    return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
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
        const isFull = item.participantCount >= item.capacity;

        const deadLine = getDeadlineLabel(item.registrationEnd);

        const isUserJoined =
          item.isJoined || (!!item.joinedAt && !item.isCompleted);
        const isFinished = isClosed || item.isCompleted;

        let statusLabel = null;
        if (isUserJoined) {
          statusLabel = "참여중";
        } else if (isFinished) {
          statusLabel = "모집 마감";
        }

        return (
          <div
            key={item.id}
            onClick={() => onItemClick(item)}
            className={cn(
              "group relative flex cursor-pointer flex-col overflow-hidden rounded-[24px] bg-white transition-all duration-300 hover:-translate-y-1 sm:flex-row sm:items-stretch sm:gap-0",
              "shadow-[0_10px_25px_-10px_rgba(0,0,0,0.04),_0_15px_35px_-10px_rgba(38,6,86,0.05)]",
              "hover:shadow-[0_20px_45px_-10px_rgba(38,6,86,0.12)]",
              statusLabel ? "opacity-95" : "",
            )}
          >
            <div className="relative h-44 w-full shrink-0 overflow-hidden sm:h-auto sm:w-[200px]">
              <Image
                src={item.image || defaultImage}
                fill
                className={cn(
                  "object-cover transition-transform duration-500 group-hover:scale-105",
                  statusLabel ? "grayscale-[40%]" : "",
                )}
                alt="이미지"
                unoptimized
              />
              {statusLabel && (
                <span
                  className={cn(
                    "absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-bold shadow-sm backdrop-blur-md",
                    isUserJoined
                      ? "bg-slate-900/80 text-slate-100"
                      : "bg-slate-100 text-slate-500",
                    meetingStatusBadgeVisible ? '' : 'hidden',
                  )}
                >
                  {isUserJoined && (
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                  )}
                  {statusLabel}
                </span>
              )}
            </div>

            <div className="flex flex-1 flex-col justify-between p-5 sm:p-7">
              <div className="flex flex-col gap-1">
                <span className="text-main-purple/60 text-[10px] font-bold tracking-[0.15em] uppercase sm:text-[11px]">
                  {item.type}
                </span>
                <h3 className="line-clamp-2 text-lg leading-snug font-extrabold tracking-tight text-slate-900 sm:text-xl">
                  {item.name}
                </h3>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-500">
                  {formatDate(item.dateTime)}
                </span>
                <span className="rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-500">
                  {formatTime(item.dateTime)}
                </span>

                {deadLine && !statusLabel && (
                  <span className="bg-main-purple-light text-main-purple flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold">
                    <span className="relative h-4 w-4">
                      <Image src={alram} fill alt="알림" />
                    </span>
                    {deadLine}
                  </span>
                )}
              </div>

              <div className="mt-5 flex w-full items-center justify-between gap-3 border-t border-slate-50 pt-4">
                <div className="flex w-full items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="relative h-3.5 w-3.5 opacity-30">
                      <Image src={person} fill alt="인원" />
                    </div>
                    <p className="flex items-baseline gap-0.5">
                      <span
                        className={cn(
                          "text-sm font-bold",
                          isFull ? "text-slate-400" : "text-main-purple",
                        )}
                      >
                        {item.participantCount}
                      </span>
                      <span className="text-[11px] font-medium text-slate-400">
                        /{item.capacity}
                      </span>
                    </p>
                  </div>

                  <div className="w-full">
                    <Progress
                      className={cn(
                        "block h-1 w-full shrink-0 overflow-hidden rounded-full bg-slate-100",
                        isFull || isClosed
                          ? "[&_[data-slot=progress-indicator]]:!bg-slate-300"
                          : "[&_[data-slot=progress-indicator]]:!bg-main-purple",
                      )}
                      value={(item.participantCount / item.capacity) * 100}
                    />
                  </div>
                </div>

                <LoginModal
                  fallback={
                    <button
                      type="button"
                      onClick={() => {}}
                      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-slate-50"
                    >
                      <Heart
                        className={cn(
                          "h-5 w-5 transition-all",
                          item.isFavorited
                            ? "fill-main-purple text-main-purple"
                            : "text-slate-300",
                        )}
                      />
                    </button>
                  }
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onHeartClick(item);
                    }}
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-slate-50"
                  >
                    <Heart
                      className={cn(
                        "h-5 w-5 transition-all",
                        item.isFavorited
                          ? "fill-main-purple text-main-purple"
                          : "text-slate-300",
                      )}
                    />
                  </button>
                </LoginModal>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
