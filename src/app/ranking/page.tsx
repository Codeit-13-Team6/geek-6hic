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
    <div className="relative mx-auto w-full max-w-[1280px] px-6 py-10 sm:py-20 2xl:px-0">
      <div className="animate-fade-up">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="bg-main-purple shadow-mag flex h-12 min-h-12 w-12 min-w-12 items-center justify-center sm:h-16 sm:w-16">
                <Trophy className="text-white" size={24} />
              </div>
              <span className="text-main-purple text-[10px] font-black tracking-[0.3em] uppercase sm:text-xs">
                Meetings / Ranking
              </span>
            </div>
            <h1 className="text-4xl leading-none font-black tracking-tighter whitespace-nowrap text-slate-950 sm:text-5xl lg:text-6xl">
              MY <span className="text-main-purple">LANKING.</span>
            </h1>
          </div>

          <div className="flex flex-col lg:items-end lg:self-end lg:text-right">
            <div className="max-w-[420px]">
              <div className="bg-main-purple hidden h-1.5 w-16 md:ml-auto md:block" />
              <p className="text-sm font-medium tracking-tight text-slate-400 sm:text-base lg:mt-4">
                스프린터 파트너들이 가장 활발하게 <br />
                활동 중인 모임 리스트를 확인해보세요.
              </p>
            </div>
          </div>
        </div>
        <div className="line-spread mt-8 mb-10 flex w-full justify-center sm:mt-12 sm:mb-20 lg:mt-12">
          <div className="h-[2px] w-full origin-center bg-gray-950" />
        </div>
      </div>

      <section className="mt-3 sm:mt-9">
        <RankingList />
      </section>
      <section className="mt-6 flex flex-row-reverse">
        <p className="text-xs font-medium  text-slate-400 sm:text-xs ">
          랭킹은 참여율 , 댓글 , 출석체크등을 기반으로 산정됩니다.
        </p>
      </section>
    </div>
  );
}
