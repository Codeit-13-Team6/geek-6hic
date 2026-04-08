"use client";

import Image from "next/image";
import person from "@/assets/icon/person/person.svg";
import { Progress } from "@/components/ui/ProgressCommon";
import { JoinedMeeting, MeetingListProps } from "@/types";
import { cn } from "@/lib/utils";
import { HeartIcon } from "../../icon/HeartIcon";
import FallbackImage from "@/components/img/FallbackImage";
import { useLoginModalStore } from "@/store/useLoginModalStore";
import { Calendar } from "lucide-react";

export default function MeetingCard({
  meetingList,
  onItemClick,
  sortValue,
  onHeartClick,
  meetingStatusBadgeVisible = true,
}: MeetingListProps) {
  const loginGuardAction = useLoginModalStore((s) => s.loginGuardAction);

  function isMeetingClosed(item: JoinedMeeting) {
    return item.participantCount >= item.capacity;
  }

  const visibleMeetingList =
    sortValue === "registrationEnd"
      ? meetingList.filter((item) => !isMeetingClosed(item))
      : meetingList;

  return (
    <>
      {visibleMeetingList.map((item) => {
        const isClosed = isMeetingClosed(item);
        const isFull = item.participantCount >= item.capacity;

        const isUserJoined =
          item.isJoined || (!!item.joinedAt && !item.isCompleted);

        let statusLabel = null;
        if (isUserJoined) {
          statusLabel = "참여중";
        }

        return (
          <div
            key={item.id}
            onClick={() => onItemClick(item)}
            className={cn(
              "animate-fade-up group relative flex cursor-pointer flex-col overflow-hidden rounded-[24px] bg-white transition-all duration-300 hover:-translate-y-1 sm:flex-row sm:items-stretch sm:gap-0",
              "shadow-[0_10px_25px_-10px_rgba(0,0,0,0.04),_0_15px_35px_-10px_rgba(38,6,86,0.05)]",
              "hover:shadow-[0_20px_45px_-10px_rgba(38,6,86,0.12)]",
              statusLabel ? "opacity-95" : "",
            )}
            // style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="relative h-44 w-full shrink-0 overflow-hidden sm:h-auto sm:w-[200px]">
              <FallbackImage
                src={item.image}
                fill
                className={cn(
                  "object-cover transition-transform duration-500 group-hover:scale-105",
                  statusLabel ? "grayscale-[40%]" : "",
                )}
                alt="모임 이미지"
                unoptimized
              />
              {statusLabel && (
                <span
                  className={cn(
                    "absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-bold shadow-sm backdrop-blur-md",
                    isUserJoined
                      ? "bg-slate-900/80 text-slate-100"
                      : "bg-slate-100 text-slate-500",
                    meetingStatusBadgeVisible ? "" : "hidden",
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
                <h3 className="line-clamp-1 text-lg leading-snug font-extrabold tracking-tight text-slate-900">
                  {item.name}
                </h3>
              </div>
              <HeartIcon
                liked={item.isFavorited}
                onClick={(e) => {
                  e.stopPropagation();
                  loginGuardAction(() => {
                    onHeartClick(item);
                  });
                }}
                size={22}
                className="absolute top-4 right-4 cursor-pointer"
              />
              <p className="mt-1.5 line-clamp-1 text-base font-medium text-slate-500">
                {item.description || "모임 설명이 아직 등록되지 않았습니다."}
              </p>

              <div className="mt-5 flex w-full items-center justify-between gap-3 border-t border-slate-50 pt-4">
                <div className="flex w-full items-center justify-between gap-3">
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
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-slate-300" />
                    <span className="text-xs font-medium text-slate-400">
                      {new Date(item.createdAt)
                        .toLocaleDateString("ko-KR", {
                          year: "2-digit",
                          month: "2-digit",
                          day: "2-digit",
                        })
                        .replace(/\. /g, "/")
                        .replace(/\./g, "")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
