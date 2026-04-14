"use client";

import Image from "next/image";
import person from "@/assets/icon/person/person.svg";
import { Progress } from "@/components/ui/ProgressCommon";
import { JoinedMeeting } from "@/types";
import { cn } from "@/lib/utils";
import { HeartIcon } from "../../icon/HeartIcon";
import FallbackImage from "@/components/img/FallbackImage";
import { useLoginModalStore } from "@/store/useLoginModalStore";
import { Calendar, Crown, Lock } from "lucide-react";
import { isSecretMeeting } from "@/lib/meetingSecret";
import { useAuthStore } from "@/store/useAuthStore";
import crownLgIcon from "@/assets/icon/crown/crown-lg.svg";

interface MeetingCardProps {
  item: JoinedMeeting;
  onItemClick: () => void;
  onHeartClick: () => void;
  meetingStatusBadgeVisible?: boolean;
}

export default function MeetingCard({
  item,
  onItemClick,
  onHeartClick,
  meetingStatusBadgeVisible = true,
}: MeetingCardProps) {
  "use memo";

  const loginGuardAction = useLoginModalStore((s) => s.loginGuardAction);
  const user = useAuthStore((s) => s.user);

  const isHost = user?.id === item.hostId;
  const isUserJoined = item.isJoined || !!item.joinedAt;
  const isSecret = isSecretMeeting(item.dateTime);

  let statusLabel = null;

  if (isUserJoined) {
    if (isHost) {
      statusLabel = "모임장";
    } else {
      statusLabel = "참여중";
    }
  }

  return (
    <article
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onItemClick();
        }
      }}
      onClick={onItemClick}
      aria-label={`${item.name} 모임 상세 보기`}
      className={cn(
        "animate-fade-up group relative flex cursor-pointer flex-col overflow-hidden rounded-[24px] bg-white transition-all duration-300 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-black focus-visible:outline-none sm:flex-row sm:items-stretch sm:gap-0",
        "shadow-[0_10px_25px_-10px_rgba(0,0,0,0.04),_0_15px_35px_-10px_rgba(38,6,86,0.05)]",
        "hover:shadow-[0_20px_45px_-10px_rgba(38,6,86,0.12)]",
        statusLabel ? "opacity-95" : "",
      )}
    >
      <div className="relative h-44 w-full shrink-0 overflow-hidden sm:h-auto sm:w-[200px]">
        <FallbackImage
          src={item.image}
          fill
          className={cn(
            "object-cover transition-transform duration-500 group-hover:scale-105",
            // statusLabel ? "grayscale-[40%]" : "",
          )}
          alt={`${item.name} 모임 이미지`}
        />
        {/* 1. 블러 글래스모피즘 */}
        {isSecret && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/60 backdrop-blur-[2px]">
            <div className="flex flex-col items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-full bg-slate-800/80 shadow-lg ring-1 ring-slate-700/50">
                <Lock className="size-5 text-slate-300" />
              </div>
              <span className="text-xs font-bold tracking-[0.2em] text-slate-300">
                SECRET
              </span>
            </div>
          </div>
        )}
        {statusLabel === "참여중" ? (
          meetingStatusBadgeVisible && (
            <div className="absolute top-5 left-5 z-10 flex items-center gap-1.5 rounded-full border border-slate-700/50 bg-slate-900/80 px-3 py-1.5 shadow-sm backdrop-blur-md sm:top-3 sm:left-3">
              <span className="bg-point-green h-1.5 w-1.5 rounded-full shadow-[0_0_8px_rgba(0,210,135,0.8)]"></span>
              <span className="text-[11px] font-bold tracking-widest text-slate-200">
                참여중
              </span>
            </div>
          )
        ) : statusLabel === "모임장" ? (
          <div className="absolute top-5 left-5 z-10 shrink-0 sm:top-3 sm:left-3">
            <div className="flex items-center gap-1.5 rounded-full border-slate-700/50 bg-slate-900/90 p-2 shadow-sm backdrop-blur-md">
              <Crown
                className="size-4 text-amber-200"
                strokeWidth={2.3}
                aria-hidden="true"
              />
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col justify-between p-5 sm:p-7">
        <div className="flex flex-col gap-1">
          <span className="text-main-purple/60 text-[10px] font-bold tracking-[0.15em] uppercase sm:text-[11px]">
            {item.type}
          </span>
          <div className="flex flex-row items-center gap-1">
            <h3 className="line-clamp-1 text-lg leading-snug font-extrabold tracking-tight text-slate-900">
              {item.name}
            </h3>
          </div>
        </div>
        <div className="flex flex-row gap-1">
          <HeartIcon
            liked={item.isFavorited}
            onClick={(e) => {
              e.stopPropagation();
              loginGuardAction(() => {
                onHeartClick();
              });
            }}
            size={22}
            className="sm: absolute right-3 bottom-30.5 cursor-pointer sm:top-2 sm:right-5"
          />
        </div>

        <p className="mt-1.5 line-clamp-1 text-base font-medium text-slate-500">
          {item.description || "모임 설명이 아직 등록되지 않았습니다."}
        </p>

        <section className="mt-5 flex w-full items-center justify-between gap-3 border-t border-slate-50 pt-4">
          <div className="flex w-full items-center justify-between gap-3">
            <div className="flex w-full items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                <div className="relative h-3.5 w-3.5 opacity-30">
                  <Image src={person} fill alt="인원 아이콘" />
                </div>
                <p className="flex items-baseline gap-0.5">
                  <span className={cn("text-main-purple text-sm font-bold")}>
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
                    "[&_[data-slot=progress-indicator]]:!bg-main-purple block h-1 w-full shrink-0 overflow-hidden rounded-full bg-slate-100",
                  )}
                  value={(item.participantCount / item.capacity) * 100}
                />
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <Calendar
                size={14}
                className="text-slate-300"
                aria-hidden="true"
              />
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
        </section>
      </div>
    </article>
  );
}
