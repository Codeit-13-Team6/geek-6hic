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
      <div className="absolute inset-0 z-10 rounded-[24px] bg-white/60" />
      <div className="absolute inset-0 z-20 flex items-start justify-center pt-[30%]">
        <div className="flex flex-col items-center gap-3">
          <div className="border-t-main-green-500 size-8 animate-spin rounded-full border-4 border-gray-200" />
          <p className="text-base font-medium text-gray-600">
            랭킹을 산정하는 중입니다. 잠시만 기다려주세요.
          </p>
        </div>
      </div>

      <div className="flex gap-[16px] pb-[40px]">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex w-full animate-pulse flex-col justify-between rounded-[24px] bg-gray-200 px-[22px] py-[20px] sm:h-[540px]"
          >
            <div className="flex justify-end pb-[16px]">
              <div className="h-[24px] w-[108px] rounded-[24px] bg-gray-300" />
            </div>
            <div className="flex flex-col gap-3 pb-[25px]">
              <div className="h-5 w-1/3 rounded-md bg-gray-300" />
              <div className="h-8 w-2/3 rounded-md bg-gray-300" />
              <div className="h-8 w-1/4 rounded-md bg-gray-300" />
            </div>
            <div className="h-[48px] w-full rounded-[12px] bg-gray-300" />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-[16px]">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="flex h-[100px] w-full animate-pulse flex-row items-center justify-between rounded-[16px] bg-white px-[32px]"
          >
            <div className="flex items-center gap-8">
              <div className="h-6 w-6 rounded-md bg-gray-200" />
              <div className="h-[71px] w-[71px] rounded-[24px] bg-gray-200" />
              <div className="flex flex-col gap-2">
                <div className="h-5 w-[200px] rounded-md bg-gray-200" />
                <div className="h-4 w-[100px] rounded-md bg-gray-200" />
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="h-7 w-[80px] rounded-md bg-gray-200" />
              <div className="h-[36px] w-[125px] rounded-[12px] bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Page() {
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

        <section className="mt-6 sm:mt-9">
          <Suspense fallback={<RankingListSkeleton />}>
            <RankingList />
          </Suspense>
        </section>
      </div>
    </div>
  );
}
