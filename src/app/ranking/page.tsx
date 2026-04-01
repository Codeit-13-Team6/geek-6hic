import { Metadata } from "next";
import { Trophy } from "lucide-react";
import RankingList from "@/app/ranking/_component/RankingList";

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
    <div className="relative w-full">
      <header className="mb-10 border-b-2 border-slate-950 pb-8 sm:mb-20 sm:pb-12 lg:pb-12">
        <div className="grid grid-cols-1 gap-10 sm:items-end md:grid-cols-2 md:items-center">
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4 sm:gap-5">
              {" "}
              <div className="bg-main-purple shadow-mag flex h-12 min-h-12 w-12 min-w-12 items-center justify-center sm:h-16 sm:w-16">
                <Trophy className="text-white" size={24} />
              </div>
              <span className="text-main-purple text-[10px] font-black tracking-[0.3em] uppercase sm:text-xs">
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
          <RankingList />
      </section>
    </div>
  );
}
