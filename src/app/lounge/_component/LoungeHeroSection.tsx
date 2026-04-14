import { MessageSquareText } from "lucide-react";

export function LoungeHeroSection() {
  return (
    <div className="animate-fade-up">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-4 sm:gap-5">
            <div
              className="bg-main-purple shadow-mag flex h-12 min-h-12 w-12 min-w-12 items-center justify-center sm:h-16 sm:w-16"
              aria-hidden="true"
            >
              <MessageSquareText className="text-white" />
            </div>
            <span className="text-main-purple text-[10px] font-black tracking-[0.3em] uppercase sm:text-xs">
              Community / Lounge
            </span>
          </div>

          <h1 className="text-4xl leading-none font-black tracking-tighter whitespace-nowrap text-slate-950 sm:text-5xl lg:text-6xl">
            SPRINT{" "}
            <span className="from-main-purple bg-gradient-to-t to-violet-800 bg-clip-text text-transparent uppercase">
              Lounge.
            </span>
          </h1>
        </div>

        <div className="flex flex-col lg:items-end lg:self-end lg:text-right">
          <div className="max-w-[420px]">
            <div className="from-main-purple hidden h-1.5 w-16 rounded-full bg-gradient-to-r to-violet-800 sm:ml-auto lg:block" />
            <p className="text-sm font-light tracking-tight text-slate-400 sm:text-base lg:mt-4">
              자유롭게 정보를 공유하고, 필요한 정보를 탐색해보세요.
            </p>
          </div>
        </div>
      </div>

      <div className="line-spread mt-8 mb-10 flex w-full justify-center sm:mt-10 sm:mb-15 lg:my-15">
        <div className="h-[1.5px] w-full origin-center bg-gray-950" />
      </div>
    </div>
  );
}
