"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import RankingListSkeleton from "@/components/skeleton/RankingListSkeleton";

const RankingList = dynamic(() => import("./component/RankingList"), {
  ssr: false,
  loading: () => <RankingListSkeleton />,
});

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
