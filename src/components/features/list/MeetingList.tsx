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
}: MeetingListProps) {
  function getDeadlineLabel(registrationEnd: string) {
    const endDate = new Date(registrationEnd);
    const now = new Date();
    const isSameYear = endDate.getFullYear() === now.getFullYear();
    const isSameMonth = endDate.getMonth() === now.getMonth();
    const isSameDate = endDate.getDate() === now.getDate();
    const isToday = isSameYear && isSameMonth && isSameDate;

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
    const isRegistrationClosed = new Date(item.registrationEnd) < now;
    const isFull = item.participantCount >= item.capacity;
    return isRegistrationClosed || isFull;
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
        const statusLabel = item.isJoined
          ? "참여 완료"
          : isClosed
            ? "모집 마감"
            : null;
        return (
          <div
            key={item.id}
            onClick={() => onItemClick(item)}
            className={cn(
              "group focus:ring-main-purple/20 relative flex cursor-pointer flex-col overflow-hidden rounded-[28px] bg-white transition-all duration-300 hover:-translate-y-1.5 focus:ring-4 sm:flex-row sm:items-stretch sm:gap-0 sm:p-0",
              "shadow-[0_15px_30px_-10px_rgba(0,0,0,0.05),_0_20px_40px_-10px_rgba(38,6,86,0.05)]",
              "hover:shadow-[0_25px_50px_-10px_rgba(38,6,86,0.1)]",
              statusLabel ? "opacity-95" : "",
            )}
          >
            <div className="relative h-48 w-full shrink-0 overflow-hidden sm:h-auto sm:w-[220px]">
              <Image
                src={item.image || defaultImage}
                fill
                className={cn(
                  "object-cover transition-transform duration-500 group-hover:scale-105",
                  statusLabel ? "grayscale-[40%]" : "",
                )}
                alt="게시물 이미지"
                unoptimized
              />
              {statusLabel && (
                <span
                  className={cn(
                    "absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold shadow-sm",
                    item.isCompleted
                      ? "bg-slate-900/80 text-slate-100"
                      : "bg-slate-200 text-slate-500",
                  )}
                >
                  {item.isCompleted && (
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                  )}
                  {statusLabel}
                </span>
              )}
            </div>

            <div className="flex flex-1 flex-col justify-between p-6 sm:p-8">
              <div className="flex flex-col gap-1.5">
                <span className="text-light-purple text-sm font-black tracking-[0.2em] uppercase">
                  {item.type}
                </span>
                <h3 className="line-clamp-2 text-xl leading-tight font-black tracking-tight text-slate-950 sm:text-2xl">
                  {item.name}
                </h3>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="rounded-xl bg-slate-100 px-3.5 py-1.5 text-xs font-bold text-slate-600">
                  {formatDate(item.dateTime)}
                </span>
                <span className="rounded-xl bg-slate-100 px-3.5 py-1.5 text-xs font-bold text-slate-600">
                  {formatTime(item.dateTime)}
                </span>

                {deadLine && !statusLabel ? (
                  <span className="bg-main-purple/10 flex items-center gap-1.5 rounded-xl px-3.5 py-1.5">
                    <span className="relative h-4.5 w-4.5 opacity-70">
                      <Image src={alram} fill alt="알람 아이콘" />
                    </span>
                    <span className="text-main-purple text-xs font-black">
                      {deadLine}
                    </span>
                  </span>
                ) : null}
              </div>

              <div className="mt-6 flex w-full items-center justify-between border-t border-slate-100 pt-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="relative h-4 w-4 opacity-40">
                      <Image src={person} fill alt="인원" />
                    </div>
                    <p>
                      <span
                        className={cn(
                          "text-sm font-black",
                          isFull ? "text-slate-400" : "text-main-purple",
                        )}
                      >
                        {item.participantCount}
                      </span>
                      <span className="text-xs font-bold text-slate-400">
                        /{item.capacity}
                      </span>
                    </p>
                  </div>
                  <Progress
                    className={cn(
                      // 고치기 - 프로그레스 게이지 안 나타남, w값 조절 안됨
                      "mt-1 block h-1.5 w-[80px] overflow-hidden rounded-full bg-slate-100",

                      isFull || isClosed
                        ? "[&_[data-slot=progress-indicator]]:bg-slate-300"
                        : "[&_[data-slot=progress-indicator]]:bg-main-purple",
                    )}
                    value={(item.participantCount / item.capacity) * 100}
                  />
                </div>

                <LoginModal
                  fallback={
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onHeartClick(item);
                      }}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white transition-all hover:scale-110 hover:bg-slate-100"
                    >
                      <Heart
                        className={cn(
                          "h-5 w-5 transition-all",
                          item.isFavorited
                            ? "fill-indigo-400 text-indigo-400"
                            : "fill-slate-200 text-slate-200",
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
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white transition-all hover:scale-110 hover:bg-slate-100"
                  >
                    <Heart
                      className={cn(
                        "h-5 w-5 transition-all",
                        item.isFavorited
                          ? "fill-indigo-400 text-indigo-400"
                          : "fill-slate-200 text-slate-200",
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
