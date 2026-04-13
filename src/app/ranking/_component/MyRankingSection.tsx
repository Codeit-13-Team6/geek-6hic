"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, ChevronDown, Sparkles } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useRanking } from "@/hooks/queries/useRanking";
import { QUERY_KEYS } from "@/constans/queryKey";

export default function MyRankingSection() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const queryClient = useQueryClient();
  const { data: rankedList } = useRanking();
  const joinedIds = queryClient.getQueryData<number[]>(QUERY_KEYS.meetings.joinedIds);

  if (!rankedList || !joinedIds) return null;

  const joinedIdSet = new Set(joinedIds);
  const myMeetings = rankedList
    .filter((item) => joinedIdSet.has(item.id))
    .map((item) => ({
      ...item,
      rank: rankedList.indexOf(item) + 1,
    }));

  if (myMeetings.length === 0) return null;

  // 내 모임 중 가장 높은 순위 찾기 (스포일러용)
  const highestRank = Math.min(...myMeetings.map((m) => m.rank));

  return (
    <section className="mb-10 sm:mb-12">
      {/* 1. 토글 버튼 (접혀있을 때 보이는 얇은 바) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group hover:border-main-purple/40 flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition-all hover:shadow-md active:scale-[0.99]"
      >
        <div className="flex items-center gap-3">
          <div className="bg-main-purple/10 flex size-8 items-center justify-center rounded-full">
            <Trophy className="text-main-purple size-4" />
          </div>
          <p className="text-sm font-bold text-slate-700 sm:text-[15px]">
            현재 나의 모임 최고 랭킹은{" "}
            <span className="text-main-purple font-black">{highestRank}위</span>
            입니다
            <Sparkles className="ml-1 inline-block size-4 -translate-y-0.5 text-yellow-400" />
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="group-hover:text-main-purple hidden text-xs font-bold text-slate-400 sm:block">
            {isOpen ? "접어두기" : "자세히 보기"}
          </span>
          <ChevronDown
            className={`size-5 text-slate-400 transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* 2. 펼쳐지는 가로 스크롤 대시보드 영역 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {/* 상단 여백을 주어 버튼과 분리 */}
            <div className="hide-scrollbar flex w-full snap-x snap-mandatory gap-4 overflow-x-auto pt-6 pb-2">
              {myMeetings.map((meet) => (
                <div
                  key={meet.id}
                  onClick={() => router.push(`/meetings/${meet.id}`)}
                  className="group hover:border-main-purple/30 relative flex w-[260px] shrink-0 cursor-pointer snap-start flex-col justify-between overflow-hidden rounded-[1.5rem] border border-slate-100 bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-1 hover:shadow-lg sm:w-[300px]"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="mb-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                        My Meeting
                      </p>
                      <h3 className="truncate text-base font-black text-slate-800">
                        {meet.meetName}
                      </h3>
                    </div>
                  </div>

                  <div className="mt-6 flex items-end justify-between border-t border-slate-50 pt-4">
                    <div>
                      <p className="text-xs font-medium text-slate-400">랭킹</p>
                      <p className="flex items-baseline gap-0.5">
                        <span className="text-main-purple text-3xl font-black">
                          {meet.rank}
                        </span>
                        <span className="text-xs font-bold text-slate-500">
                          위
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-slate-400">
                        포인트
                      </p>
                      <p className="text-lg font-black text-slate-700">
                        {meet.rankScore.toLocaleString()}
                        <span className="ml-1 text-[10px] font-bold text-slate-400">
                          pt
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
