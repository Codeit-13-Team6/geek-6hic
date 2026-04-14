import { Trophy } from "lucide-react";

export function RankingHeroSection() {
  return (
    <div className="animate-fade-up">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
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
            TOP{" "}
            <span className="from-main-purple bg-gradient-to-t to-violet-800 bg-clip-text text-transparent">
              RANKING.
            </span>
          </h1>
        </div>

        <div className="flex flex-col lg:items-end lg:self-end lg:text-right">
          <div className="max-w-[450px]">
            <div className="from-main-purple hidden h-1.5 w-16 rounded-full bg-gradient-to-r to-violet-800 md:ml-auto lg:block" />
            <p className="text-sm font-light tracking-tight text-slate-400 sm:text-base lg:mt-4">
              스프린터 파트너들이 가장 활발하게 <br className="md:hidden" />
              활동 중인 모임 리스트를 확인해보세요.
            </p>
          </div>
        </div>
      </div>
      <div className="line-spread mt-8 mb-10 flex w-full justify-center sm:mt-10 sm:mb-15 lg:my-15">
        <div className="h-[2px] w-full origin-center bg-gray-950" />
      </div>
    </div>
  );
}
