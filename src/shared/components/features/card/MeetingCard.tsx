"use client";

import Image from "next/image";
import person from "@/assets/icon/person/person.svg";
import { Progress } from "@/shared/components/ui/ProgressCommon";
import { JoinedMeeting } from "@/shared/types";
import { cn } from "@/shared/lib/utils";
import { HeartIcon } from "../../icon/HeartIcon";
import FallbackImage from "@/shared/components/img/FallbackImage";
import { useLoginModalStore } from "@/infra/store/useLoginModalStore";
import { Calendar, Crown, Lock } from "lucide-react";
import { isSecretMeeting } from "@/shared/lib/meetingSecret";
import { useAuthStore } from "@/infra/store/useAuthStore";

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
              <span className="h-1.5 w-1.5 rounded-full bg-[#00d287] shadow-[0_0_8px_rgba(0,210,135,0.8)]"></span>
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
        <div className="flex flex-col gap-2">
          <div className="flex">
            <span className="bg-main-purple/5 text-main-purple ring-main-purple/10 rounded-md px-2 py-0.5 text-[10px] font-black tracking-[0.1em] ring-1 sm:text-[11px]">
              {item.type}
            </span>
          </div>
          <h3 className="line-clamp-1 text-lg leading-snug font-extrabold tracking-tight break-all text-slate-900">
            {item.name}
          </h3>
          <p className="line-clamp-1 text-[14px] font-medium break-all text-slate-500/80">
            {item.description || "모임 설명이 없습니다."}
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-4 border-t border-slate-50 pt-5">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Image
                  src={person}
                  width={12}
                  height={12}
                  alt="인원"
                  className="opacity-40"
                />
                <p className="flex items-baseline gap-1">
                  <span className="text-main-purple text-sm font-bold">
                    {item.participantCount}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">
                    / {item.capacity} 명
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <Calendar size={12} strokeWidth={2.5} />
                <span className="text-[11px] font-bold">
                  {new Date(item.createdAt)
                    .toLocaleDateString("ko-KR", {
                      year: "2-digit",
                      month: "2-digit",
                      day: "2-digit",
                    })
                    .replace(/\. /g, ".") // "26. 04. 04." -> "26.04.04." (공백 제거)
                    .slice(0, -1)}
                </span>
              </div>
            </div>

            <Progress
              className="[&_[data-slot=progress-indicator]]:bg-main-purple h-1 w-full rounded-full bg-slate-100"
              value={(item.participantCount / item.capacity) * 100}
            />
          </div>
        </div>

        <HeartIcon
          liked={item.isFavorited}
          onClick={(e) => {
            e.stopPropagation();
            loginGuardAction(onHeartClick);
          }}
          size={22}
          className="absolute top-5 right-5 z-20"
        />
      </div>
    </article>
  );
}
