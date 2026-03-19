"use client";

import TopRankCard from "@/app/ranking/component/TopRankCard";
import RankCard from "@/app/ranking/component/RankCard";
import { useRanking } from "@/hooks/useRanking";
import { useEffect } from "react";

export default function Page() {
  const { rankedList, top3List, top10List, isRankingReady } = useRanking();

  useEffect(() => {
    if (isRankingReady) {
      rankedList.sort((a, b) => b.rankScore - a.rankScore);
      console.log("랭킹 데이터 완료", top3List, top10List, rankedList);
    }
  }, [isRankingReady]);

  return (
    <div className="w-full bg-gray-50 pt-6 pb-20 sm:pt-10 lg:pt-[48px]">
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <section className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-[36px] shrink-0 items-center justify-center rounded-full sm:mr-2 sm:size-[54px]">
              <span className="text-3xl sm:text-5xl">💬</span>
            </div>
            <div>
              <h1 className="text-[20px] font-bold text-gray-900 sm:text-[24px] lg:text-[32px]">
                모임 랭킹
              </h1>
              <p className="mt-1 text-base font-medium text-gray-500 sm:text-lg lg:text-xl">
                모임 랭킹을 확인할 수 있어요 🫶
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 sm:mt-8">
          <div className="flex gap-[16px] pb-[40px]">
            <TopRankCard
              title={top3List[1]?.meetName}
              point={top3List[1]?.rankScore}
              rank={2}
              meetType={top3List[1]?.meetType}
            />

            <TopRankCard
              title={top3List[0]?.meetName}
              point={top3List[0]?.rankScore}
              rank={1}
              meetType={top3List[0]?.meetType}
            />

            <TopRankCard
              title={top3List[2]?.meetName}
              point={top3List[2]?.rankScore}
              rank={3}
              meetType={top3List[2]?.meetType}
            />
            {/*{top3List.map((item, index: number) => (*/}
            {/*  <TopRankCard*/}
            {/*    title={item.meetName}*/}
            {/*    point={item.rankScore}*/}
            {/*    rank={index + 1}*/}
            {/*    meetType={item.meetType}*/}
            {/*  />*/}
            {/*))}*/}
          </div>

          <div className="flex flex-col gap-[16px]">
            {top10List.map((item, index) => (
              <RankCard
                key={item.id}
                title={item.meetName}
                point={item.rankScore}
                rank={index + 4}
                meetType={item.meetType}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
