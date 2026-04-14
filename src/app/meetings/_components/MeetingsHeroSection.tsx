import { GitBranch } from "lucide-react";

export function MeetingsHeroSection() {
  return (
    <div className="animate-fade-up mb-5 sm:mb-8 md:mb-10">
      <div className="flex flex-col gap-10 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col gap-6 sm:gap-8">
          <div className="flex items-center gap-4 sm:gap-5">
            <div
              className="bg-main-purple shadow-mag flex h-12 min-h-12 w-12 min-w-12 items-center justify-center sm:h-16 sm:w-16"
              aria-hidden="true"
            >
              <GitBranch className="text-white" />
            </div>

            <span className="text-main-purple text-[10px] font-black tracking-[0.3em] uppercase sm:text-xs">
              Connection / Archive
            </span>
          </div>

          <h1 className="text-5xl leading-[1.1] font-black tracking-tighter text-slate-950 sm:text-7xl lg:text-8xl">
            CO-GIT
            <br />
            <span className="from-main-purple bg-gradient-to-r to-violet-800 bg-clip-text text-transparent">
              CONNECTION.
            </span>
          </h1>
        </div>

        <div className="flex shrink-0 flex-col items-start gap-4 text-left xl:items-end xl:text-right">
          <div className="w-full">
            <div className="from-main-purple mb-4 hidden h-1.5 w-20 rounded-full bg-gradient-to-r to-violet-800 lg:block xl:ml-auto"></div>
            <p className="text-lg font-medium tracking-tight text-slate-900 sm:text-xl lg:mt-4 lg:text-2xl">
              스프린터 파트너들과 <br className="sm:block xl:hidden" />
              공유하고, 협업하고, 성장하는 공간
            </p>
            <p className="mt-2 text-sm font-light tracking-tight text-slate-400 sm:text-base lg:text-lg">
              모임을 생성하여 아지트를 만들어보세요.
            </p>
          </div>
        </div>
      </div>

      <div className="line-spread mt-8 mb-10 flex w-full justify-center sm:mt-10 sm:mb-15 lg:my-15">
        <div
          aria-hidden="true"
          className="h-[1.5px] w-full origin-center bg-slate-950"
        />
      </div>
    </div>
  );
}
