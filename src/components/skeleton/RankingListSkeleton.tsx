export default function RankingListSkeleton() {
  return (
    <div className="relative animate-pulse">
      {/* 오버레이 + 스피너 */}
      <div className="absolute inset-0 z-20 flex items-start justify-center pt-[30%]">
        <div className="flex flex-col items-center gap-3">
          <div className="border-t-main-purple size-8 animate-spin rounded-full border-4 border-gray-200" />
          <p className="text-base font-medium text-gray-600">
            실시간으로 랭킹을 산정하는 중입니다. 잠시만 기다려주세요.
          </p>
        </div>
      </div>

      {/* 데스크톱 Top 3 카드 */}
      <section className="mb-10 md:mb-15">
        <div className="hidden items-end gap-6 md:flex lg:gap-10">
          {[false, true, false].map((isFirst, i) => (
            <div
              key={i}
              className={`relative w-full overflow-hidden rounded-2xl bg-slate-200 ${
                isFirst
                  ? "aspect-[3/4.2] flex-1 -translate-y-8"
                  : "aspect-[3/4.2] flex-1"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-slate-400/40 via-transparent to-transparent" />
              <div className="absolute top-7 right-0">
                <div className="h-6 w-14 bg-slate-300" />
              </div>
              <div className="absolute right-7 bottom-7 left-7 space-y-3 lg:right-10 lg:bottom-10 lg:left-10">
                <div className="h-3 w-16 rounded bg-slate-300" />
                <div className="h-8 w-3/4 rounded bg-slate-300" />
                <div className="flex items-end gap-1">
                  <div className="h-9 w-20 rounded bg-slate-300" />
                  <div className="mb-1 h-2 w-10 rounded bg-slate-300/60" />
                </div>
                <div className="h-12 w-full rounded-2xl bg-slate-300" />
              </div>
            </div>
          ))}
        </div>

        {/* 모바일 Top 3 카드 */}
        <div className="flex flex-col gap-3 md:hidden">
          {[200, 150, 150].map((h, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-[24px] bg-slate-200"
              style={{ height: h }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-slate-400/30 via-transparent to-transparent" />
              <div className="absolute top-5 left-5">
                <div className="h-5 w-10 rounded-full bg-slate-300" />
              </div>
              <div className="absolute bottom-6 left-6 space-y-2">
                <div className="h-2 w-14 rounded bg-slate-300" />
                <div className="h-6 w-40 rounded bg-slate-300" />
                <div className="h-5 w-16 rounded bg-slate-300" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4~10위 리스트 */}
      <section className="flex flex-col gap-1 sm:gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between border-b border-slate-100 py-4 sm:h-[90px] sm:px-4"
          >
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="h-6 w-4 rounded bg-slate-200 sm:w-8" />
              <div className="h-12 w-12 rounded-[14px] bg-slate-200 sm:h-[60px] sm:w-[60px]" />
              <div className="flex flex-col gap-1">
                <div className="h-2.5 w-12 rounded bg-slate-200" />
                <div className="h-4 w-28 rounded bg-slate-200 sm:w-36" />
              </div>
            </div>
            <div className="flex items-center gap-6 sm:gap-8">
              <div className="h-5 w-14 rounded bg-slate-200" />
              <div className="hidden h-9 w-20 rounded-xl bg-slate-200 sm:block" />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
