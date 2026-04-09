export function MeetingsHeaderSkeleton() {
  return (
    <div
      className="relative mx-auto w-full max-w-[1280px] px-6 py-10 sm:py-20 2xl:px-0"
      aria-hidden="true"
    >
      <div className="animate-pulse">
        <div className="flex flex-col gap-10 xl:flex-row xl:items-center xl:justify-between">
          {/* 좌측: 타이틀 로고 부분 */}
          <div className="flex flex-col gap-6 sm:gap-8">
            <div className="flex items-center gap-4 sm:gap-5">
              {/* 아이콘 박스 */}
              <div className="h-12 w-12 rounded-sm bg-slate-200 sm:h-16 sm:w-16" />
              {/* 서브 타이틀 텍스트 */}
              <div className="h-4 w-40 rounded bg-slate-200 sm:h-5 sm:w-48" />
            </div>

            {/* 메인 타이틀 (CO-GIT CONNECTION) */}
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="h-12 w-48 rounded bg-slate-200 sm:h-16 sm:w-64 lg:h-20 lg:w-80" />
              <div className="h-12 w-64 rounded bg-slate-200 sm:h-16 sm:w-80 lg:h-20 lg:w-96" />
            </div>
          </div>

          {/* 우측: 설명글 부분 */}
          <div className="flex shrink-0 flex-col items-start gap-4 xl:items-end">
            <div className="w-full">
              {/* 보라색 짧은 선 */}
              <div className="mb-4 hidden h-1.5 w-20 bg-slate-200 lg:block xl:ml-auto" />
              {/* 메인 설명 (2줄) */}
              <div className="mt-2 h-6 w-64 rounded bg-slate-200 sm:h-7 sm:w-80 lg:mt-4 lg:h-8 lg:w-96" />
              <div className="mt-2 hidden h-6 w-48 rounded bg-slate-200 sm:block sm:h-7 sm:w-64 lg:h-8 xl:hidden" />
              {/* 서브 설명 */}
              <div className="mt-3 h-4 w-56 rounded bg-slate-200 sm:h-5 sm:w-64" />
            </div>
          </div>
        </div>

        {/* 구분선 (Line Spread) */}
        <div className="mt-8 mb-10 flex w-full justify-center sm:mt-10 sm:mb-15 lg:mt-15 lg:mb-24">
          <div className="h-[2px] w-full bg-slate-200" />
        </div>

        <div className="flex flex-col gap-6 md:gap-8">
          {/* 탭 목록 */}
          <div className="custom-scrollbar flex gap-2 overflow-x-auto pb-2">
            {["전체", "팀미팅", "스터디", "프로젝트", "취준생", "기타"].map(
              (label) => (
                <div
                  key={label}
                  className="shrink-0 rounded-[14px] bg-slate-200 px-4 py-2 text-transparent"
                >
                  {label}
                </div>
              ),
            )}
          </div>

          {/* 검색바 & 정렬 드롭다운 */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            {/* 검색바 */}
            <div className="flex w-full items-center sm:max-w-[480px]">
              <div className="h-12 flex-1 rounded-xl bg-slate-200 sm:h-14" />
              <div className="ml-4 h-6 w-6 shrink-0 rounded-full bg-slate-200" />
            </div>

            {/* 정렬 드롭다운 */}
            <div className="flex shrink-0 items-center justify-end">
              <div className="h-[44px] w-[110px] rounded-xl bg-slate-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
