"use client";

import Image from "next/image";
import person from "@/assets/icon/person/person.svg";
import { Progress } from "@/components/ui/ProgressCommon";
import { JoinedMeeting } from "@/types";
import { cn } from "@/lib/utils";
import { HeartIcon } from "../../icon/HeartIcon";
import FallbackImage from "@/components/img/FallbackImage";
import { useLoginModalStore } from "@/store/useLoginModalStore";
import { Calendar } from "lucide-react";
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
    <div
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onItemClick();
        }
      }}
      onClick={onItemClick}
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
            statusLabel ? "grayscale-[40%]" : "",
          )}
          alt="모임 이미지"
        />
        {isSecret && (
          <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
            <div className="absolute top-[15%] -left-[20%] flex w-[160%] rotate-[-20deg] items-center justify-center gap-1.5 bg-slate-900/80 py-1 text-[10px] font-bold tracking-[0.3em] text-white shadow-md backdrop-blur-sm">
              🔒 SECRET · SECRET · SECRET
            </div>
            <div className="absolute top-[45%] -left-[20%] flex w-[160%] rotate-[15deg] items-center justify-center gap-1.5 bg-slate-900/80 py-1 text-[10px] font-bold tracking-[0.3em] text-white shadow-md backdrop-blur-sm">
              SECRET · 🔒 · SECRET · SECRET
            </div>
            <div className="absolute top-[72%] -left-[20%] flex w-[160%] rotate-[-8deg] items-center justify-center gap-1.5 bg-slate-900/80 py-1 text-[10px] font-bold tracking-[0.3em] text-white shadow-md backdrop-blur-sm">
              SECRET · SECRET 🔒 SECRET
            </div>
          </div>
        )}
        {statusLabel === "참여중" ? (
          meetingStatusBadgeVisible && (
            <span className="absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-lg bg-slate-900/80 px-3 py-1.5 text-[11px] font-bold text-slate-100 shadow-sm backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              {statusLabel}
            </span>
          )
        ) : statusLabel === "모임장" ? (
          <div className="absolute top-3 left-3 z-10 shrink-0 rounded-full bg-amber-100 p-1.5 shadow-sm">
            <Image
              src={crownLgIcon}
              alt="호스트 이미지"
              width={20}
              height={20}
              className="xl:size-6"
            />
          </div>
        ) : (
          <span></span>
        )}
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
            className="absolute top-4 right-4 cursor-pointer"
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
        </section>
      </div>
    </div>
  );
}
