"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

const RankingList = dynamic(() => import("./component/RankingList"), {
  ssr: false,
  loading: () => <RankingListSkeleton />,
});

function RankingListSkeleton() {
  return (
    <div className="relative">
      <div className="absolute inset-0 z-10 rounded-[2rem] bg-white/40 backdrop-blur-[2px]" />
      <div className="absolute inset-0 z-20 flex items-start justify-center pt-[30%]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#260656]" />
          <p className="text-sm font-black tracking-widest text-[#260656] uppercase">
            CALCULATING RANK...
          </p>
        </div>
      </div>

      <div className="flex gap-6 pb-12 sm:pb-20">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-[141px] w-full animate-pulse rounded-2xl bg-slate-100 sm:h-[540px]"
          />
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-24 w-full animate-pulse rounded-2xl bg-white"
          />
        ))}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <div className="relative min-h-screen w-full bg-[#FAF9F6] pt-12 pb-24 font-sans tracking-tight text-slate-950 sm:pt-16 lg:pt-20">
      <div className="pointer-events-none fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/felt.png')] opacity-[0.02]" />

      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-6">
        <header className="mb-16 flex flex-col gap-10 border-b-2 border-slate-950 pb-12 sm:flex-row sm:items-end sm:justify-between lg:mb-20">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center bg-[#260656] text-xl shadow-[4px_4px_0_rgba(38,6,86,0.15)]">
                🏆
              </div>
              <span className="text-[10px] font-black tracking-[0.4em] text-[#260656] uppercase">
                Archive / Ranking
              </span>
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl leading-none font-black tracking-tighter text-slate-950 sm:text-5xl lg:text-6xl">
                MEETING <span className="text-[#260656]">RANKING.</span>
              </h1>
              <p className="text-sm font-bold text-slate-400 sm:text-base">
                가장 활발하게 기록되고 있는 모임 아카이브입니다.
              </p>
            </div>
          </div>
        </header>

        <section className="mt-8 sm:mt-12">
          <Suspense fallback={<RankingListSkeleton />}>
            <RankingList />
          </Suspense>
        </section>
      </div>
    </div>
  );
}
