"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import RankingListSkeleton from "@/components/skeleton/RankingListSkeleton";
import { Trophy } from "lucide-react";

const RankingList = dynamic(() => import("./component/RankingList"), {
  ssr: false,
  loading: () => <RankingListSkeleton />,
});

export default function Page() {
  return (
    <div className="relative w-full">
      <header className="mb-10 border-b-2 border-slate-950 pb-8 sm:mb-20 sm:pb-12 lg:pb-12">
        <div className="grid grid-cols-2 items-center gap-5 sm:gap-8">
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4">
              {" "}
              <div className="bg-main-purple shadow-main-purple/20 flex h-12 w-12 items-center justify-center shadow-lg sm:h-14 sm:w-14">
                <Trophy className="text-white" size={24} />
              </div>
              <span className="text-main-purple text-[10px] font-black tracking-[0.3em] uppercase">
                Meetings / Ranking
              </span>
            </div>
            <div className="space-y-2">
              <h1 className="text-[32px] leading-none font-black tracking-tighter whitespace-nowrap text-slate-950 sm:text-5xl lg:text-6xl">
                MEETING{" "}
                <span className="text-main-purple uppercase">Ranking.</span>
              </h1>
            </div>
          </div>

          <div className="flex flex-col items-end self-end text-right">
            <div className="max-w-[420px]">
              <div className="bg-main-purple mb-2 hidden h-1.5 w-16 md:ml-auto md:block" />
              <p className="text-sm font-medium tracking-tight text-slate-400 sm:text-base">
                스프린터 파트너들이 가장 활발하게 <br />
                활동 중인 모임 리스트를 확인해보세요.
              </p>
            </div>
          </div>
        </div>
      </header>

      <section className="mt-3 sm:mt-9">
        <Suspense fallback={<RankingListSkeleton />}>
          <RankingList />
        </Suspense>
      </section>
    </div>
  );
}
