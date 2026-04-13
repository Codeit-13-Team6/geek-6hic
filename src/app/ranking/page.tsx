import { Metadata } from "next";
import RankingList from "@/app/ranking/_component/RankingList";
import { RankingHeroSection } from "./_component/RankingHeroSection";
import PrefetchBoundary from "@/components/boundary/PrefetchBoundary";
import { RankedItem } from "@/types";
import { QUERY_KEYS } from "@/constans/queryKey";
import { Suspense } from "react";
import { getRankingBFF } from "@/internal/ranking";
import RankingListSkeleton from "@/components/skeleton/RankingListSkeleton";

export const metadata: Metadata = {
  title: "랭킹 보드",
  description:
    "스프린터 파트너들이 가장 활발하게 활동 중인 모임 리스트를 확인해보세요.",
  openGraph: {
    title: "랭킹 보드 | co-Git",
    description:
      "스프린터 파트너들이 가장 활발하게 활동 중인 모임 리스트를 확인해보세요.",
    images: ["/img/logo/cogit.png"],
  },
};

export default function Page() {
  return (
    <div className="relative mx-auto w-full max-w-[1280px] px-6 py-10 sm:py-15 lg:py-20 2xl:px-0">
      <RankingHeroSection />

      <div className="animate-fade-up mb-10 flex items-center gap-3 md:mb-15">
        <div
          className="bg-main-purple h-[6px] w-8 rounded-full"
          aria-hidden="true"
        />
        <h2
          id="ranking-top3-title"
          className="text-xs font-black tracking-[0.3em] text-slate-900 uppercase"
        >
          TOP 3 Meetings
        </h2>
      </div>

      <Suspense fallback={<RankingListSkeleton />}>
        <PrefetchBoundary
          prefetchFn={(qc) =>
            qc.prefetchQuery<RankedItem[]>({
              queryKey: QUERY_KEYS.ranking.root,
              queryFn: () => getRankingBFF(),
              staleTime: 1000 * 60,
            })
          }
        >
          <section className="mt-3 sm:mt-9">
            <RankingList />
          </section>
        </PrefetchBoundary>
      </Suspense>

      <section className="mt-6 flex flex-row-reverse">
        <p className="text-xs font-medium text-slate-400 sm:text-xs">
          랭킹은 참여율 , 댓글 , 출석체크등을 기반으로 산정됩니다.
        </p>
      </section>
    </div>
  );
}
