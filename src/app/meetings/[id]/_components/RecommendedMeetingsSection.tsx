"use client";

import Link from "next/link";
import type { RecommendedMeetingsSectionProps } from "@/types";
import { Sparkles, ArrowUpRight, ArrowRight } from "lucide-react";
import FallbackImage from "@/components/ui/FallbackImage";
import { useMeetingRecommendationsQuery } from "@/app/meetings/[id]/_hooks/useMeetingDetail";

import { useDragScroll } from "@/hooks/useDragScroll";

export function RecommendedMeetingsSection({
  meetingId,
  meetingType,
}: RecommendedMeetingsSectionProps) {
  const recommendationsQuery = useMeetingRecommendationsQuery(
    meetingId,
    meetingType,
  );
  const meetings = recommendationsQuery.data ?? [];
  const isPending = recommendationsQuery.isPending;

  const { dragProps } = useDragScroll({ dragDistanceThreshold: 4 });

  return (
    <section className="w-full space-y-6">
      <div className="flex flex-col gap-1 px-2">
        <div className="text-main-purple flex items-center gap-2">
          <Sparkles size={18} strokeWidth={3} />
          <h2 className="text-xl font-black tracking-tighter text-slate-950 sm:text-2xl">
            이런 모임은 어때요?
          </h2>
        </div>

        <p className="text-[10px] font-bold tracking-[0.3em] text-slate-400 uppercase">
          추천 모임
        </p>
      </div>

      {isPending ? (
        <div className="flex min-h-[240px] w-full items-center justify-center rounded-[32px] border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
          <p className="text-sm font-bold text-slate-400">
            추천 모임을 불러오는 중이에요.
          </p>
        </div>
      ) : meetings.length === 0 ? (
        <div className="flex min-h-[240px] w-full flex-col items-center justify-center rounded-[32px] border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-white text-slate-200 shadow-sm">
            <Sparkles size={28} />
          </div>

          <div className="space-y-1">
            <p className="text-lg font-black tracking-tighter text-slate-900">
              새로울 모임을 찾는 중이에요
            </p>
            <p className="text-sm font-bold text-slate-400">
              아직 추천해 드릴 수 있는 모임이 없습니다.
            </p>
          </div>

          <Link
            href="/meetings"
            className="hover:bg-main-purple mt-8 flex items-center gap-2 rounded-2xl bg-slate-950 px-6 py-3 text-xs font-black tracking-widest text-white transition-all active:scale-95"
          >
            전체 목록 보기
            <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="relative -mx-4 overflow-hidden sm:-mx-6 lg:-mx-8">
          <div
            {...dragProps}
            className="scrollbar-hide flex cursor-grab snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-8 active:cursor-grabbing sm:px-6 lg:px-8"
          >
            {meetings.slice(0, 5).map((meeting) => (
              <Link
                key={meeting.id}
                href={`/meetings/${meeting.id}`}
                draggable={false}
                className="group relative flex w-[260px] shrink-0 snap-start flex-col overflow-hidden transition-all duration-300 sm:w-[300px]"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[28px] bg-slate-100 shadow-sm transition-shadow group-hover:shadow-md">
                  <FallbackImage
                    src={meeting.image}
                    alt="모임 이미지"
                    fill
                    className="pointer-events-none object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/*<div className="group-hover:blur-0 absolute top-4 right-4 flex size-10 items-center justify-center rounded-full bg-white/20 opacity-0 blur-sm backdrop-blur-md transition-all group-hover:opacity-100">*/}
                  {/*  <ArrowUpRight*/}
                  {/*    className="text-white"*/}
                  {/*    size={22}*/}
                  {/*    strokeWidth={3}*/}
                  {/*  />*/}
                  {/*</div>*/}
                </div>

                <div className="flex flex-col px-2 pt-4 pb-2">
                  <div className="flex items-center gap-2 text-xs font-bold tracking-tight text-slate-400 sm:text-[13px]">
                    <span>
                      {meeting.participantCount} / {meeting.capacity}명
                    </span>
                  </div>

                  <h3 className="group-hover:text-main-purple mt-2 line-clamp-1 text-base font-black tracking-tighter text-slate-900 transition-colors sm:text-lg">
                    {meeting.name}
                  </h3>
                </div>
              </Link>
            ))}

            {/* <div className="w-1 shrink-0 sm:w-2 lg:w-4" /> */}
          </div>
        </div>
      )}
    </section>
  );
}
