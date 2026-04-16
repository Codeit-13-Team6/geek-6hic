"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles, ChartColumn, ArrowUpRight } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useRanking } from "@/app/ranking/_hooks/useRanking";
import { QUERY_KEYS } from "@/constants/queryKey";
import { useDragScroll } from "@/hooks/useDragScroll";

export default function MyRankingSection() {
  const router = useRouter();
  const { dragProps } = useDragScroll();
  const [isOpen, setIsOpen] = useState(false);

  const queryClient = useQueryClient();
  const { data: rankedList } = useRanking();
  const joinedIds = queryClient.getQueryData<number[]>(
    QUERY_KEYS.meetings.joinedIds,
  );

  if (!rankedList || !joinedIds) return null;

  const joinedIdSet = new Set(joinedIds);
  const myMeetings = rankedList
    .filter((item) => joinedIdSet.has(item.id))
    .map((item) => ({
      ...item,
      rank: rankedList.indexOf(item) + 1,
    }));

  if (myMeetings.length === 0) return null;

  const highestRank = Math.min(...myMeetings.map((m) => m.rank));

  return (
    <section className="mb-10 sm:mb-12">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group hover:border-main-purple/40 flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition-all hover:shadow-md active:scale-[0.99]"
      >
        <div className="flex items-center gap-3">
          <div className="bg-main-purple/10 flex size-8 items-center justify-center rounded-full transition-transform group-hover:scale-110">
            <ChartColumn className="text-main-purple size-4" />
          </div>
          <p className="text-sm font-bold text-slate-700 sm:text-[15px]">
            현재 참여중인 모임 최고 랭킹은{" "}
            <span className="text-main-purple font-black">{highestRank}위</span>
            입니다
            <Sparkles className="ml-1.5 inline-block size-4 -translate-y-0.5 text-yellow-400 transition-transform group-hover:scale-110 group-hover:rotate-12" />
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="group-hover:text-main-purple hidden text-xs font-bold text-slate-400 transition-colors sm:block">
            {isOpen ? "접어두기" : "자세히 보기"}
          </span>
          <ChevronDown
            className={`group-hover:text-main-purple size-5 text-slate-400 transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div
              {...dragProps}
              className="custom-scrollbar flex w-full gap-4 overflow-x-auto pt-6 pb-4 sm:pb-6"
            >
              {myMeetings.map((meet) => (
                <div
                  key={meet.id}
                  onClick={() => router.push(`/meetings/${meet.id}`)}
                  className="group hover:border-main-purple/30 relative flex w-[260px] shrink-0 cursor-pointer snap-start flex-col justify-between overflow-hidden rounded-[1.5rem] border border-slate-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_-12px_rgba(38,6,86,0.12)] sm:w-[300px]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <span className="bg-main-purple/5 text-main-purple ring-main-purple/10 mb-2 inline-block rounded-md px-2 py-0.5 text-[9px] font-black tracking-[0.2em] uppercase ring-1">
                        {meet.meetType}
                      </span>
                      <h3 className="group-hover:text-main-purple truncate text-base font-bold tracking-tight text-slate-800 transition-colors">
                        {meet.meetName}
                      </h3>
                    </div>

                    <div className="group-hover:bg-main-purple flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-all group-hover:text-white group-hover:shadow-md">
                      <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>

                  <div className="mt-6 flex items-end justify-between border-t border-slate-50 pt-4">
                    <div>
                      <p className="flex items-baseline gap-0.5">
                        <span className="text-main-purple origin-left text-3xl font-black transition-transform group-hover:scale-105">
                          {meet.rank}
                        </span>
                        <span className="text-xs font-bold text-slate-500">
                          위
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black tracking-tighter text-slate-700">
                        {meet.rankScore.toLocaleString()}
                        <span className="ml-1 text-[9px] font-bold tracking-widest text-slate-400 uppercase">
                          포인트
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
